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

interface City {
  city: string;
  state: string;
  count: number;
  median: number;
  high_or_worse: number;
  category_medians?: Record<string, number | null>;
}

export function CityTable({ cities }: { cities: City[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const topCities = cities.slice(0, 12);

  return (
    <div ref={ref} className="overflow-hidden rounded-xl border border-border-subtle">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface-primary/60 text-text-muted text-xs uppercase tracking-wider">
            <th className="text-left px-4 py-3 font-medium">Market</th>
            <th className="text-center px-3 py-3 font-medium">Branches</th>
            <th className="text-center px-3 py-3 font-medium">Median</th>
            <th className="text-center px-3 py-3 font-medium">High+</th>
            <th className="text-left px-3 py-3 font-medium hidden lg:table-cell">
              Score
            </th>
          </tr>
        </thead>
        <tbody>
          {topCities.map((city, i) => (
            <motion.tr
              key={city.city + city.state}
              className="border-t border-border-subtle/50 hover:bg-accent-surface/30 transition-colors duration-150"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.4,
                delay: i * 0.05,
                ease: [0.2, 0.7, 0.2, 1],
              }}
            >
              <td className="px-4 py-3">
                <div className="font-medium text-text-primary">
                  {city.city}
                </div>
                <div className="text-xs text-text-muted">{city.state}</div>
              </td>
              <td className="text-center px-3 py-3 tabular-nums text-text-secondary">
                {city.count}
              </td>
              <td className="text-center px-3 py-3">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tabular-nums"
                  style={{
                    color: getTierColor(city.median),
                    backgroundColor: `${getTierColor(city.median)}15`,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: getTierColor(city.median) }}
                  />
                  {city.median}
                </span>
              </td>
              <td className="text-center px-3 py-3 tabular-nums">
                {city.high_or_worse > 0 ? (
                  <span className="text-q4 font-semibold">
                    {city.high_or_worse}
                  </span>
                ) : (
                  <span className="text-text-muted">0</span>
                )}
              </td>
              <td className="px-3 py-3 hidden lg:table-cell">
                <div className="flex items-center gap-1">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: getTierColor(city.median) }}
                    initial={{ width: 0 }}
                    animate={
                      isInView ? { width: `${city.median}%` } : { width: 0 }
                    }
                    transition={{
                      duration: 0.8,
                      delay: 0.3 + i * 0.05,
                      ease: [0.2, 0.7, 0.2, 1],
                    }}
                  />
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
