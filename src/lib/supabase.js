import { createClient } from "@supabase/supabase-js";

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = typeof rawUrl === "string" ? rawUrl.trim() : "";
const supabaseAnonKey = typeof rawKey === "string" ? rawKey.trim() : "";

const looksLikeBadUrl =
  !supabaseUrl ||
  supabaseUrl.includes(" ") ||
  supabaseUrl.includes("VITE_SUPABASE_ANON_KEY") ||
  supabaseUrl.toLowerCase().includes("vite_supabase_anon_key") ||
  supabaseUrl.toLowerCase().includes("eyjhb"); // common JWT prefix accidentally pasted

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("For You page: missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
}
if (looksLikeBadUrl) {
  console.warn(
    "For You page: VITE_SUPABASE_URL looks invalid. It should be like https://<project-ref>.supabase.co (no spaces, no keys)."
  );
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const FOR_YOU_STORAGE_BUCKET = "for-you-videos";
export const FOR_YOU_VIDEOS_TABLE = "for_you_videos";
export const FOR_YOU_ROLES_TABLE = "user_roles";
