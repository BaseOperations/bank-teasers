"use client";

import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { useState } from "react";

const bankNames: Record<string, string> = {
  bmo: "BMO",
  "citizens-bank": "Citizens Bank",
  "columbia-bank": "Columbia Bank",
  "fifth-third": "Fifth Third Bank",
  "first-citizens": "First Citizens Bank & Trust",
  chase: "Chase",
  keybank: "KeyBank",
  pnc: "PNC Bank",
  pinnacle: "Pinnacle Bank",
  regions: "Regions Bank",
  "td-bank": "TD Bank",
  truist: "Truist",
  "us-bank": "U.S. Bank",
  "wells-fargo": "Wells Fargo",
  woodforest: "Woodforest National Bank",
};

export default function ViewPage() {
  const params = useParams();
  const bankSlug = params.bank as string;
  const bankName = bankNames[bankSlug] || bankSlug;
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-surface-primary min-h-screen">
      {/* Top bar */}
      <motion.header
        className="flex items-center justify-between px-5 h-12 border-b border-border-subtle bg-surface-primary/90 backdrop-blur-md shrink-0 z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
            <span className="text-on-accent font-bold text-[8px] tracking-tight">
              BO
            </span>
          </div>
          <div className="w-px h-4 bg-border-subtle" />
          <span className="text-xs font-medium text-text-tertiary">
            {bankName} Portfolio Analysis
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-muted uppercase tracking-wider font-medium">
            Confidential
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        </div>
      </motion.header>

      {/* Loading overlay */}
      {!iframeLoaded && (
        <div className="absolute inset-0 top-12 flex items-center justify-center bg-surface-primary z-[5]">
          <div className="flex flex-col items-center gap-4">
            <motion.div
              className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="text-sm text-text-tertiary">
              Loading analysis
            </span>
          </div>
        </div>
      )}

      {/* Original teaser HTML in iframe */}
      <motion.iframe
        src={`/teasers/${bankSlug}/index.html`}
        className="flex-1 w-full border-0"
        title={`${bankName} Portfolio Analysis`}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        onLoad={() => setIframeLoaded(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: iframeLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}
