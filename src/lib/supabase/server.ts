import { createClient } from "@supabase/supabase-js";

/** Sunucu tarafı Supabase istemcisi (service role — yalnızca API/route'larda). */
export function createSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY tanımlı değil");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
