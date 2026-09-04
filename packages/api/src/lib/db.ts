export function generateId() {
  return crypto.randomUUID();
}

export function now() {
  return new Date().toISOString();
}
