"use client";

import { useEffect } from "react";

type Props = {
  postId: string;
};

/** Görüntülenme (sayfa açılışı) ve okunma (%50 scroll) sayaçlarını kaydeder. */
export function BlogPostTracker({ postId }: Props) {
  useEffect(() => {
    fetch("/api/blog/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, type: "view" }),
    }).catch(() => {});
  }, [postId]);

  useEffect(() => {
    const storageKey = `strada-blog-read-${postId}`;
    if (sessionStorage.getItem(storageKey)) return;

    function onScroll() {
      const doc = document.documentElement;
      const scrolled = (window.scrollY + window.innerHeight) / doc.scrollHeight;
      if (scrolled < 0.5) return;

      sessionStorage.setItem(storageKey, "1");
      window.removeEventListener("scroll", onScroll);
      fetch("/api/blog/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, type: "read" }),
      }).catch(() => {});
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [postId]);

  return null;
}
