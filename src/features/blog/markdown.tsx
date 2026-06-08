import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { headingIdForText } from "./toc";
import type { TocHeading } from "./types";

type Props = {
  content: string;
  headings?: TocHeading[];
  className?: string;
};

function headingText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(headingText).join("");
  return "";
}

/** Renders blog post markdown with Strada typography styles and anchor ids. */
export function BlogMarkdown({ content, headings = [], className }: Props) {
  return (
    <div className={cn("space-y-5 text-slate-300", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => {
            const text = headingText(children);
            const id = headingIdForText(text, headings);
            return (
              <h2
                id={id}
                className="scroll-mt-28 mt-10 text-2xl font-semibold tracking-tight text-white"
              >
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const text = headingText(children);
            const id = headingIdForText(text, headings);
            return (
              <h3 id={id} className="scroll-mt-28 mt-8 text-xl font-semibold text-white">
                {children}
              </h3>
            );
          },
          p: ({ children }) => <p className="leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc space-y-2 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-2 pl-6">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-brand-300 underline-offset-4 hover:underline">
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="rounded bg-surface-2/80 px-1.5 py-0.5 text-sm text-brand-200">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
