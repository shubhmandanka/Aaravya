import type { Variants } from "framer-motion";

/**
 * Shared, purposeful motion presets for the public site.
 *
 * Reduced motion: the root layout wraps the app in
 * `<MotionConfig reducedMotion="user">`, which makes every Framer Motion
 * animation in the tree automatically collapse to instant/no-op when the
 * visitor's OS has "reduce motion" enabled -- individual components don't
 * need to check for it themselves.
 *
 * Usage:
 *   <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
 */

const easeStandard = [0.22, 1, 0.36, 1] as const;

export const viewportOnce = { once: true, margin: "-80px 0px -80px 0px" } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeStandard },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: easeStandard } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: easeStandard },
  },
};

/** Stagger a group of children as the parent enters the viewport. */
export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren },
  },
});

/** Subtle hover/tap lift for cards and interactive tiles. */
export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.2, ease: easeStandard } },
  whileTap: { y: 0, scale: 0.99 },
};

/** Subtle hover/tap scale for buttons and icon targets. */
export const hoverScale = {
  whileHover: { scale: 1.02, transition: { duration: 0.2, ease: easeStandard } },
  whileTap: { scale: 0.98 },
};
