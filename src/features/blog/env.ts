/** Postgres (Neon) bağlantısı mevcut mu? */
export function useDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/** Yerel JSON dosya store'a yazılabilir mi? (Vercel/serverless'ta hayır) */
export function isWritableJsonStore(): boolean {
  return process.env.NODE_ENV === "development" && !process.env.VERCEL;
}
