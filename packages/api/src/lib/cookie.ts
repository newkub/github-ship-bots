const algorithm = { name: "HMAC", hash: "SHA-256" };

const keyCache: Record<string, CryptoKey> = {};

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  if (keyCache[secret]) return keyCache[secret];
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    algorithm,
    false,
    ["sign", "verify"]
  );
  keyCache[secret] = key;
  return key;
}

async function signValue(value: string, secret: string): Promise<string> {
  const key = await getCryptoKey(secret);
  const data = new TextEncoder().encode(value).buffer as ArrayBuffer;
  const signature = await crypto.subtle.sign("HMAC", key, data);
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

async function unsignValue(
  signed: string,
  secret: string
): Promise<string | false> {
  const separator = signed.lastIndexOf(".");
  if (separator < 0) return false;
  const value = signed.slice(0, separator);
  const signature = signed.slice(separator + 1);
  if (signature.length !== 44 || !signature.endsWith("=")) return false;

  const key = await getCryptoKey(secret);
  let signatureBytes: Uint8Array;
  try {
    signatureBytes = Uint8Array.from(atob(signature), (c) => c.charCodeAt(0));
  } catch {
    return false;
  }

  const data = new TextEncoder().encode(value).buffer as ArrayBuffer;
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes.buffer as ArrayBuffer,
    data
  );
  return valid ? value : false;
}

export function parseCookies(header: string | null): Record<string, string> {
  const result: Record<string, string> = {};
  if (!header) return result;
  for (const part of header.split(";")) {
    const [rawName, ...rest] = part.trim().split("=");
    if (!rawName) continue;
    const name = decodeURIComponent(rawName.trim());
    const value = rest.length ? decodeURIComponent(rest.join("=").trim()) : "";
    result[name] = value;
  }
  return result;
}

export async function getSignedCookie(
  cookieHeader: string | null,
  secret: string,
  name: string
): Promise<string | false | undefined> {
  const cookies = parseCookies(cookieHeader);
  const value = cookies[name];
  if (!value) return undefined;
  return unsignValue(value, secret);
}

export interface CookieOptions {
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  maxAge?: number;
}

export async function serializeSignedCookie(
  name: string,
  value: string,
  secret: string,
  options: CookieOptions = {}
): Promise<string> {
  const signature = await signValue(value, secret);
  const signed = `${value}.${signature}`;
  const encoded = encodeURIComponent(signed);

  const parts = [`${name}=${encoded}`];
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.secure) parts.push("Secure");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);

  return parts.join("; ");
}

export function serializeCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): string {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.secure) parts.push("Secure");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);

  return parts.join("; ");
}
