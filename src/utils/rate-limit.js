const windows = new Map();
export function allow(key, limit = 5, duration = 10_000) {
  const now = Date.now(); const entries = (windows.get(key) ?? []).filter((at) => now - at < duration);
  if (entries.length >= limit) return false;
  entries.push(now); windows.set(key, entries); return true;
}
