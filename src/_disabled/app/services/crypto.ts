export async function deriveAesKeyFromString(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const data = enc.encode(secret);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return crypto.subtle.importKey('raw', digest, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

export function b64encode(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function b64decode(str: string): ArrayBuffer {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export async function encryptJsonWithAesGcm(
  key: CryptoKey,
  obj: unknown,
): Promise<{ cipherB64: string; ivB64: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(JSON.stringify(obj));
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);
  return { cipherB64: b64encode(cipher), ivB64: b64encode(iv) };
}

export async function decryptJsonWithAesGcm<T = unknown>(
  key: CryptoKey,
  cipherB64: string,
  ivB64: string,
): Promise<T> {
  const iv = new Uint8Array(b64decode(ivB64));
  const cipher = b64decode(cipherB64);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
  const text = new TextDecoder().decode(plain);
  return JSON.parse(text) as T;
}

