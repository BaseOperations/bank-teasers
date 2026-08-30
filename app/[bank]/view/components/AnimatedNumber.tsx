"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

export function AnimatedNumber({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 1.2,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    const end = start + duration * 1000;

    function tick() {
      const now = performance.now();
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(eased * value);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      {suffix}
    </span>
  );
}
