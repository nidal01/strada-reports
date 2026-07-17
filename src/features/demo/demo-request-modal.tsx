"use client";

import { DemoRequestForm } from "@/features/demo/demo-request-form";
import { useDemoRequest } from "@/features/demo/demo-request-context";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export function DemoRequestModal() {
  const { isOpen, close } = useDemoRequest();
  const t = useTranslations("demoRequest.modal");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-toast)] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label={t("close")}
        className="absolute inset-0 bg-base/80 backdrop-blur-sm"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-request-title"
        className={cn(
          "glass-strong gradient-border relative z-10 w-full max-w-lg overflow-hidden rounded-3xl p-6 sm:p-8",
        )}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
              {t("eyebrow")}
            </p>
            <h2 id="demo-request-title" className="mt-1 text-xl font-semibold text-white">
              {t("title")}
            </h2>
            <p className="mt-1 text-sm text-slate-400">{t("subtitle")}</p>
          </div>
          <button
            type="button"
            onClick={close}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label={t("close")}
          >
            <X className="size-4" />
          </button>
        </div>
        <DemoRequestForm />
      </div>
    </div>
  );
}
