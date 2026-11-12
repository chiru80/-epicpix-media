"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function RevealOnScroll({
  children,
  delay = 0,
  transition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
    duration: 0.6,
    ease: "easeOut",
  },
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  transition?: any;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "0px 0px -200px 0px", // ds-allow-hardcode
  } as any);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }} // ds-allow-hardcode
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }} // ds-allow-hardcode
      transition={{
        ...transition,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}