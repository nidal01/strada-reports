"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, viewportOnce } from "@/lib/motion";

/** Semantic tags supported by the scroll-reveal wrapper. */
type RevealTag = "div" | "section" | "article" | "ul" | "li" | "span" | "figure";

interface RevealProps {
  children: ReactNode;
  /** Override the default `fadeUp` variant. */
  variants?: Variants;
  /** Stagger entrance among siblings. */
  delay?: number;
  className?: string;
  /** Render as a different semantic element (section, article, li…). */
  as?: RevealTag;
}

/**
 * Scroll-triggered entrance wrapper. Animates once when scrolled into view and
 * automatically respects `prefers-reduced-motion` (handled globally in CSS +
 * Framer Motion). Uses the `motion` proxy (`motion.div`, `motion.li`, …) so the
 * element type is resolved without re-creating components on every render.
 */
export function Reveal({
  children,
  variants = fadeUp,
  delay = 0,
  className,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  );
}
