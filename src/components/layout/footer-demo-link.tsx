"use client";

import { useTranslations } from "next-intl";
import { useDemoRequest } from "@/features/demo/demo-request-context";

export function FooterDemoLink({ label }: { label: string }) {
  const { open } = useDemoRequest();

  return (
    <button
      type="button"
      onClick={open}
      className="text-sm text-slate-400 transition-colors duration-200 hover:text-white"
    >
      {label}
    </button>
  );
}
