"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronRight, CheckCircle, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ElectionStepper } from "@/components/timeline/ElectionStepper";
import { VALID_STATES } from "@/lib/data/election-events";

// ─────────────────────────────────────────────
//  US State name → abbreviation lookup
// ─────────────────────────────────────────────
const STATE_NAMES: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR",
  California: "CA", Colorado: "CO", Connecticut: "CT", Delaware: "DE",
  Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID",
  Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS",
  Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD",
  Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS",
  Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
  "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK",
  Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT",
  Vermont: "VT", Virginia: "VA", Washington: "WA", "West Virginia": "WV",
  Wisconsin: "WI", Wyoming: "WY",
};

const FEATURED_STATES = ["NY", "CA", "TX", "FL", "PA", "OH"];

// ─────────────────────────────────────────────
//  Resolve input → state code
// ─────────────────────────────────────────────
function resolveStateCode(raw: string): string | null {
  const trimmed = raw.trim().toUpperCase();
  if (VALID_STATES.has(trimmed)) return trimmed;

  // Try full state name
  const found = Object.entries(STATE_NAMES).find(
    ([name]) => name.toUpperCase() === raw.trim().toUpperCase()
  );
  if (found) return found[1];

  return null;
}

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [activeState, setActiveState] = useState<string>("NY");
  const [validationError, setValidationError] = useState<string>("");

  const handleSearch = () => {
    const code = resolveStateCode(inputValue);
    if (!code) {
      setValidationError(
        `"${inputValue}" is not a valid US state code or name. Try "NY", "California", etc.`
      );
      return;
    }
    setValidationError("");
    setActiveState(code);
    // Smooth scroll to timeline
    document.getElementById("timeline-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleFeaturedState = (code: string) => {
    setInputValue(code);
    setValidationError("");
    setActiveState(code);
    document.getElementById("timeline-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-500 selection:text-white">

      {/* ── Navigation ── */}
      <header className="absolute top-0 w-full p-6 lg:px-12 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">
            Civic<span className="text-orange-500">Node</span>
          </span>
        </div>
        <nav className="text-sm font-medium text-slate-600 flex gap-6">
          <a href="#timeline-section" className="hover:text-slate-900 transition-colors">Timeline</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Resources</a>
          <a href="#" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
            Voter Login
          </a>
        </nav>
      </header>

      {/* ── Hero ── */}
      <main className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden pt-20 pb-16">

        {/* Background decorative blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-50/50 blur-3xl -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-50/30 blur-3xl -z-10" />

        <div className="max-w-4xl w-full mx-auto text-center px-4">

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-slate-100 border border-slate-200 text-sm font-medium text-slate-700"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            2026 Election Cycle — Data Updated Live
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight"
          >
            Your Vote,{" "}
            <br className="hidden sm:block" />
            Your Voice,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">
              Simplified.
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Demystifying the democratic process. Enter your state to get a personalised
            election timeline with real deadlines, voting windows, and action items.
          </motion.p>

          {/* Search Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="w-full max-w-lg mx-auto space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="state-search-input"
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setValidationError("");
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder='Enter state code or name (e.g. "NY")'
                  className={`w-full pl-11 h-14 text-base rounded-xl border-slate-200 bg-white shadow-sm focus-visible:ring-slate-900 transition-all font-medium ${validationError ? "border-red-300 focus-visible:ring-red-400" : ""}`}
                  maxLength={30}
                  aria-label="State search input"
                  aria-describedby={validationError ? "state-search-error" : undefined}
                />
              </div>
              <Button
                id="state-search-button"
                onClick={handleSearch}
                className="h-14 px-8 text-base font-semibold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
              >
                Get My Timeline
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Validation error */}
            {validationError && (
              <motion.p
                id="state-search-error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 font-medium text-left pl-1"
                role="alert"
              >
                {validationError}
              </motion.p>
            )}

            {/* Quick-pick featured states */}
            <div className="flex items-center gap-2 flex-wrap justify-center pt-1">
              <span className="text-sm text-slate-400 font-medium">Quick pick:</span>
              {FEATURED_STATES.map((code) => (
                <button
                  key={code}
                  id={`quick-pick-${code.toLowerCase()}`}
                  onClick={() => handleFeaturedState(code)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border transition-all
                    ${activeState === code
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900"
                    }`}
                >
                  {code}
                </button>
              ))}
            </div>

            <p className="text-sm text-slate-400 font-medium">
              Secure, impartial, and 100% free for all citizens.
            </p>
          </motion.div>
        </div>
      </main>

      {/* ── Timeline Section ── */}
      <section id="timeline-section" className="py-20 bg-slate-50 border-t border-slate-100 pb-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-slate-900 mb-4"
            >
              Your Personalized Election Timeline
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-slate-600 max-w-xl mx-auto"
            >
              State-specific deadlines, voting windows, and national milestones — all in one place.
              Click any event to see details, countdowns, and direct action links.
            </motion.p>
          </div>

          {/* Live API-driven stepper */}
          <ElectionStepper state={activeState} />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-slate-100 py-8 px-6 text-center">
        <p className="text-sm text-slate-400">
          © 2026 CivicNode · Data sourced from state & federal election authorities ·{" "}
          <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>
        </p>
      </footer>
    </div>
  );
}
