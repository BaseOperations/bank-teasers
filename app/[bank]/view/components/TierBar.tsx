"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

const tierColors = ["#78C6F5", "#6A93E7", "#676DD8", "#9151B9", "#BD268E"];

interface Tier {
  name: string;
  count: number;
  pct: number;
}

export function TierBar({ tiers }: { tiers: Tier[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="space-y-4">
      {/* Stacked bar */}
      <div className="flex h-3 rounded-full overflow-hidden gap-[2px]">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            className="h-full rounded-full"
            style={{ backgroundColor: tierColors[i] }}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${tier.pct}%` } : { width: 0 }}
            transition={{
              duration: 0.8,
              delay: i * 0.12,
              ease: [0.2, 0.7, 0.2, 1],
            }}
          />
        ))}
      </div>

      {/* Labels */}
      <div className="grid grid-cols-5 gap-2">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            className="text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
          >
            <div
              className="text-xl font-bold tabular-nums"
              style={{ color: tierColors[i] }}
            >
              {tier.count}
            </div>
            <div className="text-[11px] text-text-muted mt-0.5">
              {tier.name}
            </div>
            <div className="text-[10px] text-text-muted/60 tabular-nums">
              {tier.pct}%
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function TierBreakdownBars({ tiers }: { tiers: Tier[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const maxCount = Math.max(...tiers.map((t) => t.count));

  return (
    <div ref={ref} className="space-y-3">
      {tiers.map((tier, i) => (
        <div key={tier.name} className="flex items-center gap-3">
          <span className="text-xs text-text-tertiary w-20 text-right shrink-0">
            {tier.name}
          </span>
          <div className="flex-1 h-7 bg-surface-primary/50 rounded-lg overflow-hidden relative">
            <motion.div
              className="h-full rounded-lg flex items-center px-3"
              style={{ backgroundColor: `${tierColors[i]}20` }}
              initial={{ width: 0 }}
              animate={
                isInView
                  ? { width: `${(tier.count / maxCount) * 100}%` }
                  : { width: 0 }
              }
              transition={{
                duration: 1,
                delay: i * 0.1,
                ease: [0.2, 0.7, 0.2, 1],
              }}
            >
              <motion.span
                className="text-xs font-semibold tabular-nums"
                style={{ color: tierColors[i] }}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                {tier.count}
              </motion.span>
            </motion.div>
          </div>
          <span className="text-xs text-text-muted tabular-nums w-10 text-right">
            {tier.pct}%
          </span>
        </div>
      ))}
    </div>
  );
}
