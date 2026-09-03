function pemToBinary(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN (RSA )?PRIVATE KEY-----/, "")
    .replace(/-----END (RSA )?PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes.buffer;
}

function pkcs1ToPkcs8(pkcs1: ArrayBuffer): ArrayBuffer {
  const len = pkcs1.byteLength;
  if (len > 0xffff) {
    throw new Error("Private key is too large for PKCS#8 conversion");
  }
  const innerLength = len + 22;
  if (innerLength > 0xffff) {
    throw new Error("Private key is too large for PKCS#8 conversion");
  }

  const out = new Uint8Array(4 + innerLength);
  let p = 0;

  out[p++] = 0x30;
  out[p++] = 0x82;
  out[p++] = (innerLength >> 8) & 0xff;
  out[p++] = innerLength & 0xff;

  // version 0
  out[p++] = 0x02;
  out[p++] = 0x01;
  out[p++] = 0x00;

  // AlgorithmIdentifier: rsaEncryption 1.2.840.113549.1.1.1
  const algId = [
    0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86,
    0xf7, 0x0d, 0x01, 0x01, 0x01, 0x05, 0x00,
  ];
  out.set(algId, p);
  p += algId.length;

  // OCTET STRING containing PKCS#1
  out[p++] = 0x04;
  out[p++] = 0x82;
  out[p++] = (len >> 8) & 0xff;
  out[p++] = len & 0xff;
  out.set(new Uint8Array(pkcs1), p);

  return out.buffer;
}

export async function importRsaPrivateKey(pem: string): Promise<CryptoKey> {
  let raw = pemToBinary(pem);
  const first = new Uint8Array(raw)[0];
  // PKCS#1 starts with SEQUENCE tag 0x30; PKCS#8 also starts with 0x30.
  // Detect by trying PKCS#8 first; if import fails, wrap PKCS#1.
  try {
    return await crypto.subtle.importKey(
      "pkcs8",
      raw,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"]
    );
  } catch {
    raw = pkcs1ToPkcs8(raw);
    return await crypto.subtle.importKey(
      "pkcs8",
      raw,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"]
    );
  }
}

function uint8ArrayFrom(input: string | ArrayBuffer | ArrayBufferView): Uint8Array {
  if (typeof input === "string") {
    return new TextEncoder().encode(input);
  }
  if (ArrayBuffer.isView(input)) {
    return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  }
  return new Uint8Array(input);
}

export function base64url(input: string | ArrayBuffer | ArrayBufferView): string {
  const bytes = uint8ArrayFrom(input);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i] ?? 0);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function signJwt(
  header: string,
  payload: string,
  privateKey: CryptoKey,
): Promise<string> {
  const signingInput = `${base64url(header)}.${base64url(payload)}`;
  const data = new TextEncoder().encode(signingInput);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, data as unknown as ArrayBuffer);
  return `${signingInput}.${base64url(signature)}`;
}
