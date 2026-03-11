const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let cache = {
  at: 0,
  uid: null,
  role: null,
  memories: null,
};

export function getForYouCache(uid) {
  if (!uid) return null;
  const fresh = Date.now() - cache.at < CACHE_TTL_MS;
  if (!fresh) return null;
  if (cache.uid !== uid) return null;
  return { role: cache.role, memories: cache.memories };
}

export function setForYouCache(uid, { role, memories }) {
  cache = {
    at: Date.now(),
    uid,
    role: role ?? null,
    memories: Array.isArray(memories) ? memories : null,
  };
}

export function clearForYouCache() {
  cache = { at: 0, uid: null, role: null, memories: null };
}

