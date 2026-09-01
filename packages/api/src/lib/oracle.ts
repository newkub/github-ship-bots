export function base64ToBytes(b64: string): Uint8Array {
  try {
    const clean = b64.replace(/^data:image\/[^;]+;base64,/, "");
    const bin = atob(clean);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i);
    }
    return bytes;
  } catch {
    return new Uint8Array();
  }
}

export async function sha256Hex(data: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", data.buffer as ArrayBuffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function byteDiffScore(a: Uint8Array, b: Uint8Array): number {
  if (a.length === 0 || b.length === 0) return 1;
  const max = Math.max(a.length, b.length);
  let diffs = Math.abs(a.length - b.length) * 255;
  const min = Math.min(a.length, b.length);
  for (let i = 0; i < min; i++) {
    const ai = a[i] ?? 0;
    const bi = b[i] ?? 0;
    diffs += Math.abs(ai - bi);
  }
  return Math.min(1, diffs / (max * 255));
}

export async function diffImages(
  a: string,
  b: string,
  threshold = 0.05,
): Promise<{ diffScore: number; hashA: string; hashB: string; passed: boolean }> {
  const bytesA = base64ToBytes(a);
  const bytesB = base64ToBytes(b);
  const [hashA, hashB] = await Promise.all([sha256Hex(bytesA), sha256Hex(bytesB)]);
  if (hashA === hashB) {
    return { diffScore: 0, hashA, hashB, passed: true };
  }
  const score = byteDiffScore(bytesA, bytesB);
  return { diffScore: score, hashA, hashB, passed: score < threshold };
}
