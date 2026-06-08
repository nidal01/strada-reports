/**
 * Supabase blog kurulum yardımcısı.
 * Kullanım: node scripts/setup-supabase.mjs
 * Önkoşul: .env.local içinde SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 */
import { readFileSync, existsSync } from "fs";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  if (!existsSync(".env.local")) return;
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

loadEnvLocal();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli (.env.local)");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error: tableError } = await supabase.from("blog_posts").select("id").limit(1);

if (tableError?.code === "PGRST205" || tableError?.message?.includes("schema cache")) {
  console.log("\n⚠️  blog_posts tablosu henüz yok.");
  console.log("Supabase Dashboard → SQL Editor → supabase/migrations/001_blog_posts.sql dosyasını çalıştırın.\n");
  process.exit(1);
}

if (tableError) {
  console.error("Bağlantı hatası:", tableError.message);
  process.exit(1);
}

console.log("✓ Supabase bağlantısı OK");

const { count } = await supabase.from("blog_posts").select("*", { count: "exact", head: true });
if ((count ?? 0) > 0) {
  console.log(`✓ blog_posts tablosunda ${count} yazı var`);
  process.exit(0);
}

const TS = new Date().toISOString();
const demos = [
  {
    id: "post_demo_tr",
    slug: "dia-erp-entegrasyonu-ile-finansal-raporlama",
    locale: "tr",
    title: "DIA ERP Entegrasyonu ile Finansal Raporlama Nasıl Dönüşür?",
    excerpt:
      "ERP verinizi manuel tablolardan kurtarın. DIA entegrasyonu ile gerçek zamanlı finansal raporlama süreçlerini keşfedin.",
    content: `## ERP Verisi Neden Dağınık Kalır?\n\nÇoğu şirket, DIA ERP'de doğru veriyi tutar ancak yönetime sunarken Excel'e döner.\n\n## Strada ile Gerçek Zamanlı Senkronizasyon\n\nStrada, DIA ERP'deki hareketleri otomatik çeker.\n\n### Temel Faydalar\n\n- **Anlık görünürlük**\n- **Hata azaltma**\n- **Hızlı karar**`,
    status: "published",
    meta_title: "DIA ERP Entegrasyonu ile Finansal Raporlama | Strada",
    meta_description: "DIA ERP verinizi gerçek zamanlı finansal raporlara dönüştürün.",
    tags: ["DIA ERP", "finansal raporlama", "entegrasyon"],
    author: "Strada",
    ai_generated: false,
    view_count: 0,
    read_count: 0,
    published_at: TS,
    created_at: TS,
    updated_at: TS,
  },
];

const { error: insertError } = await supabase.from("blog_posts").insert(demos);
if (insertError) {
  console.error("Demo yazı eklenemedi:", insertError.message);
  process.exit(1);
}

console.log("✓ Demo blog yazıları eklendi");
