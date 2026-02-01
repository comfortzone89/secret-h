"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface ViewTransitionProps {
  viewKey: string;
  children: ReactNode;
}

export default function ViewTransition({
  viewKey,
  children,
}: ViewTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="h-full w-full main-wrapper"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
