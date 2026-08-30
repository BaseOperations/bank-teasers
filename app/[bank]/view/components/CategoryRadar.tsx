"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

const tierColors = ["#78C6F5", "#6A93E7", "#676DD8", "#9151B9", "#BD268E"];

function getTierColor(score: number): string {
  if (score < 30) return tierColors[0];
  if (score < 50) return tierColors[1];
  if (score < 70) return tierColors[2];
  if (score < 90) return tierColors[3];
  return tierColors[4];
}

interface CategoryBarProps {
  categories: Record<string, number | null>;
  cityName: string;
}

export function CategoryBars({ categories, cityName }: CategoryBarProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const sorted = Object.entries(categories)
    .filter(([, v]) => v !== null)
    .sort((a, b) => (b[1] as number) - (a[1] as number));

  return (
    <div ref={ref} className="space-y-2">
      <div className="text-xs text-text-muted mb-3 uppercase tracking-wider font-medium">
        {cityName} Category Breakdown
      </div>
      {sorted.map(([name, score], i) => {
        const s = score as number;
        return (
          <div key={name} className="flex items-center gap-2">
            <span className="text-[11px] text-text-tertiary w-32 text-right shrink-0 truncate">
              {name}
            </span>
            <div className="flex-1 h-5 bg-surface-primary/40 rounded overflow-hidden relative">
              <motion.div
                className="h-full rounded flex items-center justify-end pr-2"
                style={{
                  backgroundColor: `${getTierColor(s)}18`,
                  borderLeft: `2px solid ${getTierColor(s)}`,
                }}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${s}%` } : { width: 0 }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.04,
                  ease: [0.2, 0.7, 0.2, 1],
                }}
              >
                <motion.span
                  className="text-[10px] font-semibold tabular-nums"
                  style={{ color: getTierColor(s) }}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.4 + i * 0.04 }}
                >
                  {s}
                </motion.span>
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
