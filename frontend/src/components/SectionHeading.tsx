import { motion } from "motion/react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  testId: string;
}

export function SectionHeading({ index, eyebrow, title, testId }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE }}
      className="mb-10 sm:mb-14"
      data-testid={testId}
    >
      <div className="flex items-baseline gap-4">
        <span className="font-heading text-sm font-medium tracking-[0.25em] text-neon">{index}</span>
        <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{eyebrow}</span>
      </div>
      <h2 className="mt-3 font-heading text-3xl tracking-tight text-foreground sm:text-4xl">{title}</h2>
      <div className="mt-4 h-px w-24 bg-neon/60" />
    </motion.div>
  );
}
