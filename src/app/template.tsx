"use client";

import { motion } from "framer-motion";

/** Re-mounts on every navigation, giving each page a soft fade/slide-in. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      // Opacity only: a transform here would break position:fixed modals inside pages.
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
