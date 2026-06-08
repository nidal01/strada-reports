import { createSupabaseAdmin } from "@/lib/supabase/server";
import type { BlogTopic, BlogTopicInput, BlogTopicStatus } from "./types";

type Row = {
  id: string;
  title: string;
  locale: string;
  keywords: string[] | unknown;
  image_query: string | null;
  status: string;
  scheduled_date: string | null;
  week_start: string;
  post_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

function mapRow(row: Row): BlogTopic {
  return {
    id: row.id,
    title: row.title,
    locale: row.locale as BlogTopic["locale"],
    keywords: Array.isArray(row.keywords) ? (row.keywords as string[]) : [],
    imageQuery: row.image_query,
    status: row.status as BlogTopicStatus,
    scheduledDate: row.scheduled_date,
    weekStart: row.week_start,
    postId: row.post_id,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function newId() {
  return `topic_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function now() {
  return new Date().toISOString();
}

export async function supabaseListTopics(opts?: {
  locale?: string;
  status?: BlogTopicStatus;
  weekStart?: string;
  limit?: number;
}): Promise<BlogTopic[]> {
  const supabase = createSupabaseAdmin();
  let query = supabase
    .from("blog_topics")
    .select("*")
    .order("scheduled_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true })
    .limit(opts?.limit ?? 100);

  if (opts?.locale) query = query.eq("locale", opts.locale);
  if (opts?.status) query = query.eq("status", opts.status);
  if (opts?.weekStart) query = query.eq("week_start", opts.weekStart);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as Row[]).map(mapRow);
}

export async function supabaseGetTopicById(id: string): Promise<BlogTopic | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from("blog_topics").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapRow(data as Row) : null;
}

/** Sıradaki bekleyen konu — bugün veya öncesi planlanmış. */
export async function supabasePickNextPendingTopic(locale = "tr"): Promise<BlogTopic | null> {
  const supabase = createSupabaseAdmin();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("blog_topics")
    .select("*")
    .eq("locale", locale)
    .eq("status", "pending")
    .or(`scheduled_date.is.null,scheduled_date.lte.${today}`)
    .order("scheduled_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapRow(data as Row) : null;
}

export async function supabaseCreateTopic(input: BlogTopicInput): Promise<BlogTopic> {
  const supabase = createSupabaseAdmin();
  const id = newId();
  const ts = now();

  const { data, error } = await supabase
    .from("blog_topics")
    .insert({
      id,
      title: input.title,
      locale: input.locale,
      keywords: input.keywords,
      image_query: input.imageQuery ?? null,
      status: input.status ?? "pending",
      scheduled_date: input.scheduledDate ?? null,
      week_start: input.weekStart,
      notes: input.notes ?? null,
      updated_at: ts,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data as Row);
}

export async function supabaseCreateTopics(inputs: BlogTopicInput[]): Promise<BlogTopic[]> {
  const supabase = createSupabaseAdmin();
  const ts = now();
  const rows = inputs.map((input) => ({
    id: newId(),
    title: input.title,
    locale: input.locale,
    keywords: input.keywords,
    image_query: input.imageQuery ?? null,
    status: input.status ?? "pending",
    scheduled_date: input.scheduledDate ?? null,
    week_start: input.weekStart,
    notes: input.notes ?? null,
    updated_at: ts,
  }));

  const { data, error } = await supabase.from("blog_topics").insert(rows).select("*");
  if (error) throw new Error(error.message);
  return (data as Row[]).map(mapRow);
}

export async function supabaseUpdateTopic(
  id: string,
  input: Partial<BlogTopicInput> & { postId?: string | null; status?: BlogTopicStatus },
): Promise<BlogTopic | null> {
  const current = await supabaseGetTopicById(id);
  if (!current) return null;

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("blog_topics")
    .update({
      title: input.title ?? current.title,
      locale: input.locale ?? current.locale,
      keywords: input.keywords ?? current.keywords,
      image_query: input.imageQuery !== undefined ? input.imageQuery : current.imageQuery,
      status: input.status ?? current.status,
      scheduled_date: input.scheduledDate !== undefined ? input.scheduledDate : current.scheduledDate,
      week_start: input.weekStart ?? current.weekStart,
      post_id: input.postId !== undefined ? input.postId : current.postId,
      notes: input.notes !== undefined ? input.notes : current.notes,
      updated_at: now(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data as Row);
}

export async function supabaseDeleteTopic(id: string): Promise<boolean> {
  const supabase = createSupabaseAdmin();
  const { error, count } = await supabase.from("blog_topics").delete({ count: "exact" }).eq("id", id);
  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

export async function supabaseHasTopicsForWeek(weekStart: string, locale: string): Promise<boolean> {
  const supabase = createSupabaseAdmin();
  const { count, error } = await supabase
    .from("blog_topics")
    .select("*", { count: "exact", head: true })
    .eq("week_start", weekStart)
    .eq("locale", locale);

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}
