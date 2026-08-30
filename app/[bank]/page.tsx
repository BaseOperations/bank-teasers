"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

const bankMeta: Record<string, { name: string; tagline: string }> = {
  bmo: { name: "BMO", tagline: "988 branches scored across 23 states" },
  "citizens-bank": {
    name: "Citizens Bank",
    tagline: "Branch portfolio threat analysis",
  },
  "columbia-bank": {
    name: "Columbia Bank",
    tagline: "Branch portfolio threat analysis",
  },
  "fifth-third": {
    name: "Fifth Third Bank",
    tagline: "Branch portfolio threat analysis",
  },
  "first-citizens": {
    name: "First Citizens Bank & Trust",
    tagline: "Branch portfolio threat analysis",
  },
  chase: {
    name: "Chase",
    tagline: "Branch portfolio threat analysis",
  },
  keybank: {
    name: "KeyBank",
    tagline: "Branch portfolio threat analysis",
  },
  pnc: {
    name: "PNC Bank",
    tagline: "Branch portfolio threat analysis",
  },
  pinnacle: {
    name: "Pinnacle Bank",
    tagline: "Branch portfolio threat analysis",
  },
  regions: {
    name: "Regions Bank",
    tagline: "1,256 branches scored across 15 states",
  },
  "td-bank": {
    name: "TD Bank",
    tagline: "Branch portfolio threat analysis",
  },
  truist: {
    name: "Truist",
    tagline: "Branch portfolio threat analysis",
  },
  "us-bank": {
    name: "U.S. Bank",
    tagline: "Branch portfolio threat analysis",
  },
  "wells-fargo": {
    name: "Wells Fargo",
    tagline: "Branch portfolio threat analysis",
  },
  woodforest: {
    name: "Woodforest National Bank",
    tagline: "Branch portfolio threat analysis",
  },
};

const quintileColors = ["#78C6F5", "#6A93E7", "#676DD8", "#9151B9", "#BD268E"];

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #fafafa 1px, transparent 0)",
          backgroundSize: "32px 32px",
          animation: "grid-drift 20s linear infinite",
        }}
      />
      {/* Gradient orbs using quintile colors */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[150px]"
        style={{
          background: `radial-gradient(circle, ${quintileColors[0]}08 0%, transparent 70%)`,
          top: "-10%",
          right: "-5%",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{
          background: `radial-gradient(circle, ${quintileColors[3]}0A 0%, transparent 70%)`,
          bottom: "-15%",
          left: "-10%",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      {/* Accent glow top-left */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full blur-[100px] opacity-[0.04]"
        style={{
          background:
            "radial-gradient(circle, #FDD835 0%, transparent 70%)",
          top: "20%",
          left: "30%",
        }}
      />
    </div>
  );
}

function ScoreBar() {
  return (
    <motion.div
      className="flex gap-[2px] h-1 w-full max-w-[200px] rounded-full overflow-hidden"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 1.2, delay: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
      style={{ transformOrigin: "left" }}
    >
      {quintileColors.map((color, i) => (
        <div
          key={i}
          className="flex-1 h-full"
          style={{ backgroundColor: color }}
        />
      ))}
    </motion.div>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function AuthPage() {
  const params = useParams();
  const router = useRouter();
  const bankSlug = params.bank as string;
  const meta = bankMeta[bankSlug] || {
    name: bankSlug,
    tagline: "Portfolio threat analysis",
  };

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 600);
    return () => clearTimeout(timer);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bank: bankSlug, password }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push(`/${bankSlug}/view`), 800);
      } else {
        const data = await res.json();
        setError(data.error || "Invalid access code");
        setPassword("");
        inputRef.current?.focus();
      }
    } catch {
      setError("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex bg-surface-primary relative min-h-screen overflow-hidden">
      <GridBackground />

      <div className="relative z-10 flex flex-1 items-center justify-center px-6 lg:px-0">
        <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Brand + context */}
          <motion.div
            className="space-y-8 lg:pr-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {/* BO mark */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-on-accent font-bold text-xs tracking-tight">
                  BO
                </span>
              </div>
              <span className="text-sm font-medium text-text-tertiary tracking-wide uppercase">
                Base Operations
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-text-primary leading-[1.1] tracking-tight">
                BaseScore
                <br />
                <span className="text-text-tertiary">Portfolio Teaser</span>
              </h1>
            </motion.div>

            {/* Bank badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <div className="h-10 flex items-center px-4 py-2 rounded-lg bg-surface-elevated border border-border-subtle">
                <img
                  src={`/teasers/${bankSlug}/logo.png`}
                  alt={`${meta.name} logo`}
                  className="max-h-7 max-w-[140px] object-contain"
                  width={140}
                  height={28}
                />
              </div>
              <span className="text-sm text-text-muted">{meta.tagline}</span>
            </motion.div>

            {/* Score bar */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <ScoreBar />
              <div className="flex justify-between max-w-[200px]">
                <span className="text-[10px] text-text-muted font-medium">
                  Very Low
                </span>
                <span className="text-[10px] text-text-muted font-medium">
                  Critical
                </span>
              </div>
            </motion.div>

            {/* Stat pills */}
            <motion.div
              className="flex flex-wrap gap-3 pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {[
                "25,000+ data sources",
                "250M+ mapped incidents",
                "0.1mi resolution",
              ].map((stat) => (
                <span
                  key={stat}
                  className="text-xs text-text-tertiary px-3 py-1.5 rounded-full border border-border-subtle bg-surface-elevated/50"
                >
                  {stat}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Auth card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.2, 0.7, 0.2, 1],
            }}
          >
            <div className="relative">
              {/* Card glow */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-border-subtle via-transparent to-transparent" />

              <div className="relative rounded-2xl bg-surface-secondary/80 backdrop-blur-xl border border-border-subtle p-8 lg:p-10">
                {/* Card header */}
                <motion.div
                  className="space-y-2 mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="flex items-center gap-2 text-text-tertiary mb-4">
                    <LockIcon />
                    <span className="text-xs font-medium uppercase tracking-widest">
                      Protected Analysis
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-text-primary">
                    Enter your access code
                  </h2>
                  <p className="text-sm text-text-tertiary leading-relaxed">
                    This analysis was prepared exclusively for {meta.name}.
                    Enter the code from your email to continue.
                  </p>
                </motion.div>

                {/* Form */}
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="relative">
                    <label htmlFor="access-code" className="sr-only">
                      Access code
                    </label>
                    <input
                      ref={inputRef}
                      id="access-code"
                      type="password"
                      name="password"
                      autoComplete="off"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="Access code"
                      className={`w-full h-13 px-4 rounded-xl bg-surface-primary/80 border text-text-primary placeholder:text-text-muted text-sm font-medium
                        focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40
                        transition-all duration-200
                        ${error ? "border-red-500/50 ring-1 ring-red-500/20" : "border-border-subtle hover:border-text-muted/40"}`}
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -5, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -5, height: 0 }}
                        className="text-sm text-red-400 flex items-center gap-1.5"
                        role="alert"
                        aria-live="polite"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={loading || !password.trim()}
                    className={`w-full h-13 rounded-xl font-semibold text-sm
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-secondary
                      disabled:opacity-30 disabled:cursor-not-allowed
                      transition-all duration-200
                      ${
                        success
                          ? "bg-green-500 text-white"
                          : "bg-accent text-on-accent hover:brightness-110 active:scale-[0.98]"
                      }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    {success ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          aria-hidden="true"
                        >
                          <motion.polyline
                            points="20 6 9 17 4 12"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.4 }}
                          />
                        </motion.svg>
                        Access granted
                      </span>
                    ) : loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          className="block w-4 h-4 border-2 border-on-accent/30 border-t-on-accent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Verifying
                      </span>
                    ) : (
                      "Unlock Analysis"
                    )}
                  </motion.button>
                </motion.form>

                {/* Footer inside card */}
                <motion.div
                  className="mt-6 pt-5 border-t border-border-subtle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    This report contains proprietary BaseScore data.
                    Distribution outside {meta.name} is not authorized.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
