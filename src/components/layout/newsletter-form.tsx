"use client";

import { useState, type FormEvent } from "react";
import { Check, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";

/**
 * Footer newsletter capture — POST /api/newsletter (SMTP on server).
 */
export function NewsletterForm({
  placeholder,
  cta,
}: {
  placeholder: string;
  cta: string;
}) {
  const locale = useLocale();
  const t = useTranslations("footer");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      if (!res.ok) throw new Error("subscribe_failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            {placeholder}
          </label>
          <Input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder={placeholder}
            disabled={status === "loading" || status === "done"}
            className="pr-10"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading" || status === "done"}
          aria-label={cta}
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-b from-brand-400 to-brand-600 text-white transition-all duration-200 hover:from-brand-300 hover:to-brand-500 disabled:opacity-70"
        >
          {status === "loading" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : status === "done" ? (
            <Check className="size-4" />
          ) : (
            <ArrowRight className="size-4" />
          )}
        </button>
      </form>
      {status === "done" ? (
        <p className="mt-2 text-xs text-positive-400" role="status">
          {t("newsletterSuccess")}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mt-2 flex items-center gap-1 text-xs text-red-400" role="alert">
          <AlertCircle className="size-3.5 shrink-0" />
          {t("newsletterError")}
        </p>
      ) : null}
    </div>
  );
}
