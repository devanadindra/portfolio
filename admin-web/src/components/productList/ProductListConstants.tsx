import { Variants } from "framer-motion";

// Varian untuk seluruh konten (fade-in dan slide-up ringan)
export const contentVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      when: "beforeChildren",
    },
  },
};

// Varian untuk baris tabel (termasuk animasi exit untuk AnimatePresence)
export const rowVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05, // Stagger effect
      duration: 0.4,
    },
  }),
  exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
};

// Varian untuk baris skeleton (hanya untuk animasi opacity bolak-balik)
export const skeletonRowVariants: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};