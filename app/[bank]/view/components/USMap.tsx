"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";

const tierColors = ["#78C6F5", "#6A93E7", "#676DD8", "#9151B9", "#BD268E"];

function getTierColor(median: number): string {
  if (median < 30) return tierColors[0];
  if (median < 50) return tierColors[1];
  if (median < 70) return tierColors[2];
  if (median < 90) return tierColors[3];
  return tierColors[4];
}

function getTierName(median: number): string {
  if (median < 30) return "Very Low";
  if (median < 50) return "Low";
  if (median < 70) return "Medium";
  if (median < 90) return "High";
  return "Critical";
}

// Simple equirectangular projection for continental US
function project(
  lat: number,
  lon: number,
  width: number,
  height: number
): { x: number; y: number } {
  const lonMin = -125;
  const lonMax = -66;
  const latMin = 24;
  const latMax = 50;

  const x = ((lon - lonMin) / (lonMax - lonMin)) * width;
  const y = ((latMax - lat) / (latMax - latMin)) * height;
  return { x, y };
}

interface City {
  city: string;
  state: string;
  count: number;
  median: number;
  high_or_worse: number;
  lat: number;
  lon: number;
}

// Simplified US outline path (continental US)
const US_OUTLINE =
  "M 48 12 L 60 8 L 75 10 L 85 8 L 100 5 L 115 8 L 130 6 L 145 10 L 155 8 L 168 12 L 178 10 L 188 14 L 195 12 L 205 16 L 215 14 L 225 18 L 232 16 L 240 20 L 248 18 L 252 22 L 260 24 L 265 22 L 270 26 L 278 28 L 275 35 L 280 40 L 278 48 L 282 55 L 276 60 L 280 68 L 275 75 L 270 72 L 265 78 L 258 82 L 252 80 L 245 85 L 238 82 L 230 88 L 225 85 L 218 90 L 212 88 L 205 92 L 198 90 L 190 95 L 182 92 L 175 96 L 168 94 L 162 98 L 155 96 L 148 100 L 140 98 L 132 95 L 125 98 L 118 95 L 110 98 L 105 92 L 98 95 L 90 92 L 82 95 L 75 90 L 68 92 L 60 88 L 52 85 L 45 88 L 38 82 L 30 80 L 22 75 L 18 68 L 15 60 L 12 52 L 15 45 L 12 38 L 18 30 L 22 22 L 28 18 L 35 15 L 42 14 Z";

export function USMap({ cities }: { cities: City[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredCity, setHoveredCity] = useState<City | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const W = 600;
  const H = 380;

  return (
    <div ref={ref} className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ filter: "drop-shadow(0 0 40px rgba(103,109,216,0.08))" }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        }}
      >
        {/* Grid lines */}
        <defs>
          <pattern
            id="grid"
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 30 0 L 0 0 0 30"
              fill="none"
              stroke="#505967"
              strokeWidth="0.3"
              opacity="0.2"
            />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" opacity="0.5" />

        {/* State borders hint (simplified dots) */}
        {[...Array(40)].map((_, i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={50 + Math.random() * 500}
            cy={20 + Math.random() * 340}
            r="0.5"
            fill="#505967"
            opacity="0.15"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.15 } : {}}
            transition={{ delay: i * 0.02 }}
          />
        ))}

        {/* City dots */}
        {cities.map((city, i) => {
          const pos = project(city.lat, city.lon, W, H);
          const r = Math.max(4, Math.min(18, Math.sqrt(city.count) * 3.5));
          const color = getTierColor(city.median);

          return (
            <g key={city.city + city.state}>
              {/* Glow */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={r + 6}
                fill={color}
                opacity={0}
                initial={{ opacity: 0, scale: 0 }}
                animate={
                  isInView
                    ? {
                        opacity: [0, 0.15, 0.08],
                        scale: 1,
                      }
                    : {}
                }
                transition={{
                  duration: 2,
                  delay: 0.5 + i * 0.05,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
              />

              {/* Main dot */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                fill={color}
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.3"
                cursor="pointer"
                onMouseEnter={() => setHoveredCity(city)}
                onMouseLeave={() => setHoveredCity(null)}
                initial={{ r: 0, opacity: 0 }}
                animate={isInView ? { r, opacity: 0.85 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + i * 0.04,
                  ease: [0.2, 0.7, 0.2, 1],
                }}
                whileHover={{ opacity: 1, scale: 1.3 }}
              />

              {/* City label for larger dots */}
              {city.count >= 8 && (
                <motion.text
                  x={pos.x}
                  y={pos.y - r - 5}
                  textAnchor="middle"
                  fill="#BFC4CC"
                  fontSize="9"
                  fontWeight="500"
                  fontFamily="Space Grotesk, sans-serif"
                  initial={{ opacity: 0, y: pos.y - r }}
                  animate={isInView ? { opacity: 0.8, y: pos.y - r - 5 } : {}}
                  transition={{ delay: 0.8 + i * 0.04, duration: 0.5 }}
                >
                  {city.city}
                </motion.text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredCity && (
        <motion.div
          className="absolute pointer-events-none z-20 bg-surface-secondary/95 backdrop-blur-sm border border-border-subtle rounded-lg px-3 py-2 shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
          style={{
            left: Math.min(mousePos.x + 12, 280),
            top: mousePos.y - 10,
          }}
        >
          <div className="text-sm font-semibold text-text-primary">
            {hoveredCity.city}, {hoveredCity.state}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getTierColor(hoveredCity.median) }}
            />
            <span className="text-xs text-text-secondary tabular-nums">
              Median {hoveredCity.median} ({getTierName(hoveredCity.median)})
            </span>
          </div>
          <div className="text-xs text-text-muted mt-0.5">
            {hoveredCity.count} branches
            {hoveredCity.high_or_worse > 0 &&
              ` · ${hoveredCity.high_or_worse} High`}
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <motion.div
        className="flex items-center gap-4 mt-4 justify-center"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.5 }}
      >
        {["Very Low", "Low", "Medium", "High", "Critical"].map((name, i) => (
          <div key={name} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: tierColors[i] }}
            />
            <span className="text-[10px] text-text-muted">{name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
