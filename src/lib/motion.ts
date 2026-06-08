import type { Variants, Transition } from "framer-motion";

/**
 * Shared Framer Motion presets. Centralising variants keeps every section's
 * scroll-entry choreography consistent and respects the premium easing curve
 * defined in the design system.
 */
export const premiumEase: Transition["ease"] = [0.16, 1, 0.3, 1];

/** Fade + rise — the default entrance for headings, copy and cards. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: premiumEase },
  },
};

/** Subtle fade for backgrounds and ambient layers. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: premiumEase } },
};

/** Scale-in for product mockups and figure elements. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease: premiumEase },
  },
};

/**
 * Stagger container — children should use `fadeUp`/`scaleIn`. The small delay
 * between children creates the cascading "reveal" feel without feeling slow.
 */
export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

/** Default viewport config — animate once, slightly before fully in view. */
export const viewportOnce = { once: true, amount: 0.25, margin: "0px 0px -10% 0px" } as const;
