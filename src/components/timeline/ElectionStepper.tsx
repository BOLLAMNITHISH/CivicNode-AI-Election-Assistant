"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  UserPlus,
  MapPin,
  Landmark,
  Mail,
  Info,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Globe,
  Loader2,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ElectionEvent, ElectionDataResponse, ElectionDataErrorResponse, EventType } from "@/types";

// ─────────────────────────────────────────────
//  Icon mapping by eventType
// ─────────────────────────────────────────────
const EVENT_TYPE_ICONS: Record<EventType, React.ElementType> = {
  deadline: AlertTriangle,
  voting: Landmark,
  informational: Info,
  result: CheckCircle2,
};

const EVENT_TYPE_COLORS: Record<EventType, { bg: string; border: string; text: string; badge: string }> = {
  deadline: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    badge: "bg-red-100 text-red-700 border-red-200",
  },
  voting: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  informational: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
  },
  result: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
  },
};

// ─────────────────────────────────────────────
//  Countdown Timer
// ─────────────────────────────────────────────
const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const updateTimer = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }
      setTimeLeft({
        d: Math.floor(diff / 86_400_000),
        h: Math.floor((diff % 86_400_000) / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1_000),
      });
    };
    updateTimer();
    const id = setInterval(updateTimer, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!timeLeft)
    return <div className="text-sm text-slate-400 animate-pulse">Calculating…</div>;

  const isPast = timeLeft.d === 0 && timeLeft.h === 0 && timeLeft.m === 0 && timeLeft.s === 0;

  if (isPast)
    return (
      <span className="inline-flex items-center gap-1.5 text-slate-500 text-sm font-medium">
        <AlertTriangle className="w-4 h-4 text-slate-400" /> Event passed
      </span>
    );

  const units = [
    { label: "Days", value: timeLeft.d },
    { label: "Hrs", value: timeLeft.h },
    { label: "Min", value: timeLeft.m },
    { label: "Sec", value: timeLeft.s },
  ];

  return (
    <div className="flex items-center gap-3 mt-4 p-3 bg-slate-50 border border-slate-100 rounded-xl">
      <Clock className="w-5 h-5 text-orange-500 flex-shrink-0" />
      <div className="flex gap-4">
        {units.map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center min-w-[32px]">
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
//  Skeleton Loading State
// ─────────────────────────────────────────────
const StepSkeleton = () => (
  <div className="flex items-start gap-5 animate-pulse">
    <div className="mt-1 w-12 h-12 rounded-full bg-slate-200 flex-shrink-0" />
    <div className="flex-grow rounded-2xl border border-slate-100 bg-slate-50 p-5 space-y-3">
      <div className="h-5 bg-slate-200 rounded w-2/3" />
      <div className="h-3.5 bg-slate-100 rounded w-1/3" />
    </div>
  </div>
);

// ─────────────────────────────────────────────
//  Single Event Card
// ─────────────────────────────────────────────
interface EventCardProps {
  event: ElectionEvent;
  index: number;
  isLast: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, index, isLast, isExpanded, onToggle }) => {
  const Icon = EVENT_TYPE_ICONS[event.eventType] ?? CalendarDays;
  const colors = EVENT_TYPE_COLORS[event.eventType];
  const isNational = event.state === "NATIONAL";

  const formattedDate = new Date(event.date).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      className="relative"
    >
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-6 top-[52px] bottom-[-24px] w-0.5 bg-slate-100 z-0" />
      )}

      <div className="flex items-start gap-4 sm:gap-5 relative z-10">
        {/* Icon button */}
        <button
          onClick={onToggle}
          aria-expanded={isExpanded}
          aria-controls={`event-content-${event.id}`}
          className={`mt-1 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400
            ${isExpanded
              ? `${colors.bg} ${colors.border} ${colors.text} shadow-sm`
              : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
            }`}
        >
          <Icon className="w-5 h-5" />
        </button>

        {/* Card */}
        <motion.div
          layout
          className={`flex-grow rounded-2xl border transition-all duration-300 overflow-hidden
            ${isExpanded
              ? "border-slate-200 bg-white shadow-lg shadow-slate-100/60"
              : "border-transparent hover:bg-slate-50/80"
            }`}
        >
          {/* Header */}
          <div
            role="button"
            tabIndex={0}
            onClick={onToggle}
            onKeyDown={(e) => e.key === "Enter" && onToggle()}
            className="px-5 py-4 cursor-pointer select-none flex items-start justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className={`font-bold text-base sm:text-lg transition-colors leading-snug ${isExpanded ? "text-slate-900" : "text-slate-700"}`}>
                  {event.title}
                </h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${colors.badge} whitespace-nowrap`}>
                  {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                </span>
                {isNational && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border bg-slate-100 text-slate-500 border-slate-200 whitespace-nowrap">
                    <Globe className="w-3 h-3" /> National
                  </span>
                )}
                {event.actionRequired && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border bg-orange-50 text-orange-600 border-orange-200 whitespace-nowrap">
                    <AlertTriangle className="w-3 h-3" /> Action Required
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-slate-400">{formattedDate}</p>
            </div>

            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 mt-1"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>

          {/* Expanded body */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                id={`event-content-${event.id}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
              >
                <div className="px-5 pb-6 pt-3 border-t border-slate-100 space-y-5">
                  {/* Description */}
                  <p className="text-slate-600 leading-relaxed text-sm">{event.description}</p>

                  {/* Action items */}
                  {event.actionItems && event.actionItems.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">
                        Action Items
                      </h4>
                      {event.actionItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-3 group">
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded border-2 border-slate-200 flex-shrink-0 group-hover:border-orange-400 transition-colors" />
                            <span className="text-sm font-medium text-slate-700">{item.label}</span>
                          </div>
                          {item.href && (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 text-xs font-semibold rounded-lg bg-white gap-1.5 flex-shrink-0")}
                            >
                              Open <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Source link */}
                  {event.metadata?.sourceUrl && (
                    <a
                      href={event.metadata.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-orange-500 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Official Source
                    </a>
                  )}

                  {/* Tags */}
                  {event.metadata?.tags && event.metadata.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {event.metadata.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Countdown */}
                  <CountdownTimer targetDate={event.date} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
//  Main Stepper — API-driven
// ─────────────────────────────────────────────
interface ElectionStepperProps {
  /** Two-letter US state code, e.g. "NY". If undefined, shows national fallback. */
  state?: string;
}

type FetchStatus = "idle" | "loading" | "success" | "error";

export function ElectionStepper({ state }: ElectionStepperProps) {
  const [events, setEvents] = useState<ElectionEvent[]>([]);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchEvents = useCallback(async (stateCode: string) => {
    setStatus("loading");
    setErrorMsg("");
    setEvents([]);
    setExpandedId(null);

    try {
      const params = new URLSearchParams({ state: stateCode });
      const res = await fetch(`/api/election-data?${params.toString()}`);
      const data: ElectionDataResponse | ElectionDataErrorResponse = await res.json();

      if (!res.ok) {
        const err = data as ElectionDataErrorResponse;
        throw new Error(err.details ?? err.error ?? "Unknown error from API");
      }

      const success = data as ElectionDataResponse;
      setEvents(success.events);
      setStatus("success");

      // Auto-expand the first upcoming event
      const now = Date.now();
      const firstUpcoming = success.events.find((e) => new Date(e.date).getTime() > now);
      setExpandedId(firstUpcoming?.id ?? success.events[0]?.id ?? null);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to load election data.");
      setStatus("error");
    }
  }, []);

  // Fetch whenever the state prop changes
  useEffect(() => {
    if (state && state.trim().length === 2) {
      fetchEvents(state.toUpperCase());
    } else {
      // Show national fallback when no state is selected
      fetchEvents("NY"); // default demo state
    }
  }, [state, fetchEvents]);

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  // ── Loading ──
  if (status === "loading") {
    return (
      <div className="w-full max-w-3xl mx-auto py-8 px-4 space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <StepSkeleton key={i} />
        ))}
      </div>
    );
  }

  // ── Error ──
  if (status === "error") {
    return (
      <div className="w-full max-w-3xl mx-auto py-8 px-4">
        <div className="flex flex-col items-center gap-4 text-center p-8 rounded-2xl bg-red-50 border border-red-100">
          <AlertTriangle className="w-10 h-10 text-red-400" />
          <div>
            <p className="font-bold text-red-700 text-lg">Could not load election data</p>
            <p className="text-red-500 text-sm mt-1">{errorMsg}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchEvents(state ?? "NY")}
            className="rounded-xl text-sm"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // ── Empty ──
  if (status === "success" && events.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto py-8 px-4">
        <div className="flex flex-col items-center gap-3 text-center p-10 rounded-2xl bg-slate-50 border border-slate-100">
          <CalendarDays className="w-10 h-10 text-slate-300" />
          <p className="font-semibold text-slate-500">No events found for {state}</p>
          <p className="text-slate-400 text-sm">Try a different state or check back later.</p>
        </div>
      </div>
    );
  }

  // ── Success ──
  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 font-sans">
      {/* Result header */}
      {status === "success" && state && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
              Showing results for
            </p>
            <p className="text-2xl font-extrabold text-slate-900">{state.toUpperCase()}</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-sm font-semibold border border-slate-200">
            {events.length} event{events.length !== 1 ? "s" : ""}
          </span>
        </motion.div>
      )}

      <div className="space-y-6">
        {events.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            index={index}
            isLast={index === events.length - 1}
            isExpanded={expandedId === event.id}
            onToggle={() => toggle(event.id)}
          />
        ))}
      </div>
    </div>
  );
}
