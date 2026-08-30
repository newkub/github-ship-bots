export async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): Promise<void> {
  if (!signature) {
    throw new Error("Signature is missing");
  }
  if (!signature.startsWith("sha256=")) {
    throw new Error("Invalid signature format");
  }

  const algorithm = { name: "HMAC", hash: "SHA-256" };
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    algorithm,
    false,
    ["sign", "verify"],
  );

  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(payload),
  );
  const expectedSignature = "sha256=" + array2hex(signed);

  if (!safeCompare(expectedSignature, signature)) {
    throw new Error("Signature does not match event payload and secret");
  }
}

function array2hex(arr: ArrayBuffer): string {
  return [...new Uint8Array(arr)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

function safeCompare(expected: string, actual: string): boolean {
  const lenExpected = expected.length;
  let result = 0;

  if (lenExpected !== actual.length) {
    actual = expected;
    result = 1;
  }

  for (let i = 0; i < lenExpected; i++) {
    result |= expected.charCodeAt(i) ^ actual.charCodeAt(i);
  }

  return result === 0;
}
