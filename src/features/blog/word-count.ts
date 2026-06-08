/** Markdown içeriğindeki kelime sayısını hesaplar. */
export function countWords(markdown: string): number {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/[#>*_~\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plain) return 0;
  return plain.split(" ").filter(Boolean).length;
}

export const MIN_BLOG_WORDS = 1500;
