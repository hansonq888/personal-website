import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase, FOR_YOU_STORAGE_BUCKET, FOR_YOU_VIDEOS_TABLE, FOR_YOU_ROLES_TABLE } from "../lib/supabase";
import { getForYouCache, setForYouCache, clearForYouCache } from "../lib/forYouCache";
import PageShell from "../components/PageShell";

const ROLE_ADMIN = "admin";
const ROLE_VIEWER = "viewer";

export default function ForYou() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [memories, setMemories] = useState([]);
  const [memoriesLoading, setMemoriesLoading] = useState(false);
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingCaption, setEditingCaption] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [columnCount, setColumnCount] = useState(1);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const cached = getForYouCache(session.user.id);
        if (cached?.role) setRole(cached.role);
        if (cached?.memories) {
          setMemories(cached.memories);
          setLoading(false);
        }
        fetchRole(session.user.id); // refresh in background (renews signed URLs)
      }
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchRole(session.user.id);
      else {
        setRole(null);
        setMemories([]);
        clearForYouCache();
      }
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const getCols = () => {
      const w = window.innerWidth;
      if (w >= 1024) return 4; // lg+
      if (w >= 768) return 3; // md
      if (w >= 640) return 2; // sm
      return 2; // mobile: keep cards smaller
    };
    const onResize = () => setColumnCount(getCols());
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const memoryColumns = useMemo(() => {
    const cols = Math.max(1, columnCount);
    const buckets = Array.from({ length: cols }, () => []);
    memories.forEach((m, i) => {
      // right-to-left cycling: 4 -> 3 -> 2 -> 1 -> 4 ...
      const target = (cols - 1) - (i % cols);
      buckets[target].push(m);
    });
    return buckets;
  }, [memories, columnCount]);

  async function fetchRole(uid) {
    if (!supabase) return;
    // only show the spinner if we don't already have cached memories
    if (memories.length === 0) setMemoriesLoading(true);
    const { data, error: roleError } = await supabase
      .from(FOR_YOU_ROLES_TABLE)
      .select("role")
      .eq("id", uid)
      .single();
    if (roleError) {
      setRole(null);
      setError("Could not load role. Make sure user_roles is set up and your user is in it.");
    } else {
      const nextRole = data?.role ?? null;
      setRole(nextRole);
      // Avoid reloading media if we already have memories loaded and role is unchanged.
      if (memories.length === 0 || nextRole !== role) {
        await fetchMemories(uid, nextRole);
      } else {
        // still refresh URLs if they are expiring soon, but keep the same src whenever possible
        await refreshSignedUrlsIfNeeded(uid, nextRole);
      }
    }
    setMemoriesLoading(false);
    setLoading(false);
  }

  async function fetchMemories(uidForCache, roleForCache) {
    if (!supabase) return;
    const { data, error: e } = await supabase
      .from(FOR_YOU_VIDEOS_TABLE)
      .select("id, storage_path, caption, created_at")
      .order("created_at", { ascending: false });
    if (e) {
      setError("Could not load memories.");
      return;
    }
    // Use signed URLs so this works even if the bucket isn't public.
    const existingById = new Map(memories.map((m) => [m.id, m]));
    const withUrls = await Promise.all(
      (data || []).map(async (m) => {
        const existing = existingById.get(m.id);
        // reuse URL if path unchanged and not expiring soon
        const now = Date.now();
        const expiresAt = existing?.signed_expires_at ? new Date(existing.signed_expires_at).getTime() : 0;
        const expiresSoon = expiresAt && expiresAt - now < 5 * 60 * 1000; // 5 minutes
        if (existing && existing.storage_path === m.storage_path && existing.public_url && !expiresSoon) {
          return { ...m, public_url: existing.public_url, signed_expires_at: existing.signed_expires_at };
        }
        const { data: signed, error: signedErr } = await supabase
          .storage
          .from(FOR_YOU_STORAGE_BUCKET)
          .createSignedUrl(m.storage_path, 60 * 60); // 1 hour
        return {
          ...m,
          public_url: signedErr ? "" : (signed?.signedUrl ?? ""),
          signed_expires_at: signedErr ? null : (signed?.expiresAt ?? null),
        };
      })
    );

    // Only set state if something actually changed (prevents <video> src from bouncing)
    const same =
      withUrls.length === memories.length &&
      withUrls.every((m, i) => {
        const prev = memories[i];
        return (
          prev?.id === m.id &&
          prev?.caption === m.caption &&
          prev?.storage_path === m.storage_path &&
          prev?.public_url === m.public_url
        );
      });
    if (!same) setMemories(withUrls);
    // cache for fast back/forward navigation
    if (uidForCache) setForYouCache(uidForCache, { role: roleForCache, memories: withUrls });
  }

  async function refreshSignedUrlsIfNeeded(uidForCache, roleForCache) {
    // refresh only URLs that are missing or expiring soon; keep the same ordering/object identity where possible
    if (!supabase || memories.length === 0) return;
    const now = Date.now();
    const needs = memories.filter((m) => {
      if (!m.public_url) return true;
      const expiresAt = m.signed_expires_at ? new Date(m.signed_expires_at).getTime() : 0;
      return !expiresAt || expiresAt - now < 5 * 60 * 1000;
    });
    if (needs.length === 0) return;

    const refreshedById = new Map();
    for (const m of needs) {
      const { data: signed, error: signedErr } = await supabase
        .storage
        .from(FOR_YOU_STORAGE_BUCKET)
        .createSignedUrl(m.storage_path, 60 * 60);
      refreshedById.set(m.id, {
        public_url: signedErr ? "" : (signed?.signedUrl ?? ""),
        signed_expires_at: signedErr ? null : (signed?.expiresAt ?? null),
      });
    }

    setMemories((prev) => {
      const next = prev.map((m) => {
        const r = refreshedById.get(m.id);
        return r ? { ...m, ...r } : m;
      });
      if (uidForCache) setForYouCache(uidForCache, { role: roleForCache, memories: next });
      return next;
    });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setAuthLoading(true);
    const { data, error: e2 } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (e2) {
      setError(e2.message || "Login failed.");
      return;
    }
    if (data?.user) await fetchRole(data.user.id);
    setPassword("");
  }

  async function handleSignOut() {
    await supabase?.auth.signOut();
    setEmail("");
    setPassword("");
    setError("");
    clearForYouCache();
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!uploadFile || !uploadCaption.trim() || !supabase || role !== ROLE_ADMIN) return;
    setError("");
    // iPhone photos are often HEIC which most browsers won't display in <img>.
    const nameLower = (uploadFile.name || "").toLowerCase();
    const isVideo = (uploadFile.type || "").startsWith("video/");
    const isHeic = nameLower.endsWith(".heic") || uploadFile.type === "image/heic" || uploadFile.type === "image/heif";
    if (!isVideo && isHeic) {
      setError("HEIC photos aren't supported in most browsers. Please upload a JPG/PNG/WebP instead.");
      return;
    }
    setUploading(true);
    const ext = uploadFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from(FOR_YOU_STORAGE_BUCKET).upload(path, uploadFile, {
      upsert: false,
      contentType: uploadFile.type || undefined,
    });
    if (uploadErr) {
      setError(uploadErr.message || "Upload failed.");
      setUploading(false);
      return;
    }
    const { error: insertErr } = await supabase.from(FOR_YOU_VIDEOS_TABLE).insert({ storage_path: path, caption: uploadCaption.trim() });
    if (insertErr) {
      setError(insertErr.message || "Failed to save caption.");
      setUploading(false);
      return;
    }
    setUploadCaption("");
    setUploadFile(null);
    await fetchMemories();
    setUploading(false);
  }

  async function handleDelete(id) {
    if (!supabase || role !== ROLE_ADMIN) return;
    const m = memories.find((x) => x.id === id);
    if (!m) return;
    await supabase.storage.from(FOR_YOU_STORAGE_BUCKET).remove([m.storage_path]);
    await supabase.from(FOR_YOU_VIDEOS_TABLE).delete().eq("id", id);
    await fetchMemories();
  }

  async function handleSaveCaption() {
    if (!supabase || role !== ROLE_ADMIN || !editingId) return;
    const nextCaption = editingCaption.trim();
    if (!nextCaption) return;
    setSavingEdit(true);
    setError("");
    const { error: e } = await supabase
      .from(FOR_YOU_VIDEOS_TABLE)
      .update({ caption: nextCaption })
      .eq("id", editingId);
    if (e) {
      setError(e.message || "Failed to update caption.");
      setSavingEdit(false);
      return;
    }
    setMemories((prev) => prev.map((m) => (m.id === editingId ? { ...m, caption: nextCaption } : m)));
    setEditingId(null);
    setEditingCaption("");
    setSavingEdit(false);
  }

  if (!supabase) {
    return (
      <PageShell>
        <div className="min-h-screen bg-white text-black p-6 max-w-lg mx-auto">
          <p className="text-black/70">Set up <code className="bg-black/5 px-1 rounded">VITE_SUPABASE_URL</code> and <code className="bg-black/5 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> in <code className="bg-black/5 px-1 rounded">.env</code> to use this page.</p>
          <Link to="/" className="inline-block mt-4 text-black/80 hover:underline">← Back home</Link>
        </div>
      </PageShell>
    );
  }

  if (loading) {
    return (
      <PageShell>
        <div className="min-h-screen bg-white text-black flex items-center justify-center p-6">
          <p className="text-black/60">Loading...</p>
        </div>
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell>
        <div className="min-h-screen bg-white text-black p-6 flex flex-col items-center justify-center max-w-md mx-auto">
          <h1 className="jersey-25-heading text-2xl font-bold text-black mb-2">For you</h1>
          <p className="text-black/60 text-sm mb-6">Sign in to view</p>
          <form onSubmit={handleLogin} className="w-full space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-black/20 rounded-xl bg-white text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-black/20 rounded-xl bg-white text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20"
              required
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 rounded-xl bg-black text-white font-medium hover:bg-black/90 disabled:opacity-50"
            >
              {authLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <Link to="/" className="mt-6 text-black/60 hover:text-black text-sm">← Back home</Link>
        </div>
      </PageShell>
    );
  }

  if (role !== ROLE_ADMIN && role !== ROLE_VIEWER) {
    return (
      <PageShell>
        <div className="min-h-screen bg-white text-black p-6 max-w-lg mx-auto">
          <p className="text-black/70">{error || "You don't have access. Ask the site owner to add your account."}</p>
          <button onClick={handleSignOut} className="mt-4 text-black/80 hover:underline">Sign out</button>
          <Link to="/" className="block mt-2 text-black/60 hover:underline">← Back home</Link>
        </div>
      </PageShell>
    );
  }

  const isAdmin = role === ROLE_ADMIN;

  return (
    <PageShell>
      <div className="min-h-screen bg-white text-black p-4 md:p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="jersey-25-heading text-2xl md:text-3xl font-bold text-black">For you</h1>
          <button onClick={handleSignOut} className="text-sm text-black/60 hover:text-black">Sign out</button>
        </div>

        {isAdmin && (
          <form onSubmit={handleUpload} className="mb-8 p-4 rounded-2xl border border-black/10 bg-black/[0.02] space-y-3">
            <p className="text-sm font-medium text-black/70">Add a memory</p>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime,video/x-m4v"
              onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-black/80 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-black/10 file:text-black"
            />
            <textarea
              placeholder="Caption"
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-black/15 rounded-xl bg-white text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/15 resize-y"
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={uploading || !uploadFile || !uploadCaption.trim()} className="py-2 px-4 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/90 disabled:opacity-50">
              {uploading ? "Uploading..." : "Add"}
            </button>
          </form>
        )}

        {memoriesLoading ? (
          <p className="text-black/50">Loading...</p>
        ) : memories.length === 0 ? (
          <p className="text-black/50">No memories yet.</p>
        ) : (
          <div
            className="grid gap-x-2 sm:gap-x-2.5"
            style={{ gridTemplateColumns: `repeat(${Math.max(1, columnCount)}, minmax(0, 1fr))` }}
          >
            {memoryColumns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-2 sm:gap-2.5">
                {col.map((m) => (
                  <div key={m.id} className="rounded-lg border border-black/10 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-black/5">
                      {m.public_url ? (() => {
                        const lower = (m.storage_path || "").toLowerCase();
                        const isVid = lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".mov") || lower.endsWith(".m4v");
                        return isVid ? (
                          <video
                            src={m.public_url}
                            controls
                            playsInline
                            preload="metadata"
                            className="w-full h-auto block bg-black"
                          />
                        ) : (
                          <img
                            src={m.public_url}
                            alt=""
                            loading="lazy"
                            className="w-full h-auto block object-cover object-center"
                          />
                        );
                      })() : (
                        <div className="w-full aspect-[4/3] flex items-center justify-center text-xs text-black/40">
                          Media unavailable
                        </div>
                      )}
                    </div>
                    <div className="p-1.5 sm:p-2 flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        {isAdmin && editingId === m.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editingCaption}
                              onChange={(e) => setEditingCaption(e.target.value)}
                              rows={3}
                              className="w-full px-2 py-1.5 border border-black/15 rounded-lg bg-white text-black text-[10px] sm:text-[11px] placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10 resize-y"
                              placeholder="Caption"
                              autoFocus
                            />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={handleSaveCaption}
                                disabled={savingEdit || !editingCaption.trim()}
                                className="px-3 py-1.5 rounded-lg bg-black text-white text-xs font-medium hover:bg-black/90 disabled:opacity-50"
                              >
                                {savingEdit ? "Saving..." : "Save"}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingId(null);
                                  setEditingCaption("");
                                }}
                                className="px-2 py-1.5 text-xs text-black/60 hover:text-black"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-black/90 text-[10px] sm:text-[11px] leading-snug break-words w-full">{m.caption}</p>
                        )}
                      </div>
                      {isAdmin && (
                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setError("");
                              setEditingId(m.id);
                              setEditingCaption(m.caption || "");
                            }}
                            className="text-black/60 hover:text-black text-[10px]"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(m.id)}
                            className="text-red-600 hover:text-red-700 text-[10px]"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <Link to="/" className="inline-block mt-8 text-black/60 hover:text-black text-sm">← Back home</Link>
      </div>
    </PageShell>
  );
}
