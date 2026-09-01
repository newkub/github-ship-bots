import { describe, test, expect } from "bun:test";
import { base64ToBytes, byteDiffScore, sha256Hex, diffImages } from "../src/lib/oracle";

function b64(s: string): string {
  return btoa(s);
}

describe("oracle diff", () => {
  test("base64ToBytes decodes strings", () => {
    const bytes = base64ToBytes(b64("hello"));
    expect(bytes.length).toBe(5);
    expect(new TextDecoder().decode(bytes)).toBe("hello");
  });

  test("base64ToBytes strips data URI prefix", () => {
    const bytes = base64ToBytes("data:image/png;base64," + b64("world"));
    expect(new TextDecoder().decode(bytes)).toBe("world");
  });

  test("sha256Hex produces 64-char hex", async () => {
    const hash = await sha256Hex(base64ToBytes(b64("test")));
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  test("identical images have zero diff score", async () => {
    const payload = b64("same-image-bytes");
    const result = await diffImages(payload, payload);
    expect(result.diffScore).toBe(0);
    expect(result.passed).toBe(true);
    expect(result.hashA).toBe(result.hashB);
  });

  test("different images have positive diff score", async () => {
    const a = b64("baseline-image");
    const b = b64("changed-image-");
    const result = await diffImages(a, b);
    expect(result.diffScore).toBeGreaterThan(0);
    expect(result.passed).toBe(false);
    expect(result.hashA).not.toBe(result.hashB);
  });

  test("byteDiffScore is zero for identical bytes", () => {
    const a = new Uint8Array([1, 2, 3]);
    expect(byteDiffScore(a, a)).toBe(0);
  });
});
