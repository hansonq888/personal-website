import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase, FOR_YOU_STORAGE_BUCKET, FOR_YOU_VIDEOS_TABLE, FOR_YOU_ROLES_TABLE } from "../lib/supabase";
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

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchRole(session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchRole(session.user.id);
      else setRole(null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function fetchRole(uid) {
    if (!supabase) return;
    setMemoriesLoading(true);
    const { data, error: roleError } = await supabase
      .from(FOR_YOU_ROLES_TABLE)
      .select("role")
      .eq("id", uid)
      .single();
    if (roleError) {
      setRole(null);
      setError("Could not load role. Make sure user_roles is set up and your user is in it.");
    } else {
      setRole(data?.role ?? null);
      await fetchMemories();
    }
    setMemoriesLoading(false);
    setLoading(false);
  }

  async function fetchMemories() {
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
    const withUrls = await Promise.all(
      (data || []).map(async (m) => {
        const { data: signed, error: signedErr } = await supabase
          .storage
          .from(FOR_YOU_STORAGE_BUCKET)
          .createSignedUrl(m.storage_path, 60 * 60); // 1 hour
        return { ...m, public_url: signedErr ? "" : (signed?.signedUrl ?? "") };
      })
    );
    setMemories(withUrls);
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
            <input
              type="text"
              placeholder="Caption"
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              className="w-full px-4 py-2.5 border border-black/15 rounded-xl bg-white text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/15"
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
          <div className="columns-2 sm:columns-3 [column-gap:1rem]">
            {memories.map((m) => (
              <div key={m.id} className="break-inside-avoid mb-4">
                <div className="rounded-2xl border border-black/10 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
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
                  <div className="p-3 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      {isAdmin && editingId === m.id ? (
                        <div className="space-y-2">
                          <input
                            value={editingCaption}
                            onChange={(e) => setEditingCaption(e.target.value)}
                            className="w-full px-3 py-2 border border-black/15 rounded-xl bg-white text-black text-sm placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10"
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
                        <p className="text-black/90 text-sm leading-snug break-words">{m.caption}</p>
                      )}
                    </div>
                    {isAdmin && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setError("");
                            setEditingId(m.id);
                            setEditingCaption(m.caption || "");
                          }}
                          className="text-black/60 hover:text-black text-xs"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(m.id)}
                          className="text-red-600 hover:text-red-700 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link to="/" className="inline-block mt-8 text-black/60 hover:text-black text-sm">← Back home</Link>
      </div>
    </PageShell>
  );
}
