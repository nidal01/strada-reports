import { useSupabase } from "./env";
import * as sb from "./store-topics-supabase";
import type { BlogTopic, BlogTopicInput, BlogTopicStatus } from "./types";

function ensureStore() {
  if (!useSupabase()) {
    throw new Error("Blog konuları için SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli");
  }
}

export async function listTopics(opts?: {
  locale?: string;
  status?: BlogTopicStatus;
  weekStart?: string;
  limit?: number;
}): Promise<BlogTopic[]> {
  ensureStore();
  return sb.supabaseListTopics(opts);
}

export async function getTopicById(id: string): Promise<BlogTopic | null> {
  ensureStore();
  return sb.supabaseGetTopicById(id);
}

export async function pickNextPendingTopic(locale = "tr"): Promise<BlogTopic | null> {
  ensureStore();
  return sb.supabasePickNextPendingTopic(locale);
}

export async function createTopic(input: BlogTopicInput): Promise<BlogTopic> {
  ensureStore();
  return sb.supabaseCreateTopic(input);
}

export async function createTopics(inputs: BlogTopicInput[]): Promise<BlogTopic[]> {
  ensureStore();
  return sb.supabaseCreateTopics(inputs);
}

export async function updateTopic(
  id: string,
  input: Partial<BlogTopicInput> & { postId?: string | null; status?: BlogTopicStatus },
): Promise<BlogTopic | null> {
  ensureStore();
  return sb.supabaseUpdateTopic(id, input);
}

export async function deleteTopic(id: string): Promise<boolean> {
  ensureStore();
  return sb.supabaseDeleteTopic(id);
}

export async function hasTopicsForWeek(weekStart: string, locale: string): Promise<boolean> {
  ensureStore();
  return sb.supabaseHasTopicsForWeek(weekStart, locale);
}

export async function markTopicUsed(id: string, postId: string): Promise<BlogTopic | null> {
  return updateTopic(id, { status: "used", postId });
}
