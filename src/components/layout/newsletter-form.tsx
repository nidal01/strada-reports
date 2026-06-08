"use client";

import { useState, type FormEvent } from "react";
import { Check, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

/**
 * Lightweight newsletter capture (client island inside the server footer).
 * Demonstrates an optimistic animated success state; wire `onSubmit` to a real
 * endpoint / server action in production.
 */
export function NewsletterForm({
  placeholder,
  cta,
}: {
  placeholder: string;
  cta: string;
}) {
  const [done, setDone] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <div className="relative flex-1">
        <label htmlFor="newsletter-email" className="sr-only">
          {placeholder}
        </label>
        <Input
          id="newsletter-email"
          type="email"
          required
          placeholder={placeholder}
          disabled={done}
          className="pr-10"
        />
      </div>
      <button
        type="submit"
        disabled={done}
        aria-label={cta}
        className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-b from-brand-400 to-brand-600 text-white transition-all duration-200 hover:from-brand-300 hover:to-brand-500 disabled:opacity-70"
      >
        {done ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
      </button>
    </form>
  );
}
