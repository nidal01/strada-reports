/** Supabase bağlantısı mevcut mu? */
export function useSupabase(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** @deprecated useSupabase kullanın */
export function useDatabase(): boolean {
  return useSupabase();
}

/** Yerel JSON dosya store'a yazılabilir mi? (Vercel/serverless'ta hayır) */
export function isWritableJsonStore(): boolean {
  return process.env.NODE_ENV === "development" && !process.env.VERCEL && !useSupabase();
}
