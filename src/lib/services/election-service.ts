/**
 * ElectionService
 *
 * A self-contained TypeScript service that encapsulates all business logic
 * for querying, filtering, and sorting election event data.
 *
 * Design decisions:
 *  - Pure functions only; no side-effects, easy to unit test.
 *  - The API route delegates all logic here, keeping the route thin.
 *  - NATIONAL events are always merged as a baseline fallback.
 *  - Events are sorted chronologically (earliest → latest).
 */

import { ElectionEvent, EventType } from "@/types";
import { MOCK_ELECTION_EVENTS, VALID_STATES } from "@/lib/data/election-events";

// ─────────────────────────────────────────────
//  Validation
// ─────────────────────────────────────────────

/**
 * Returns true if the given string is a recognised US state abbreviation.
 * Accepts mixed-case input; normalisation is done internally.
 */
export function isValidState(state: string): boolean {
  return VALID_STATES.has(state.trim().toUpperCase());
}

/**
 * Normalises a raw state string to the canonical uppercase form.
 * @throws {Error} if the state is invalid.
 */
export function normaliseState(raw: string): string {
  const normalised = raw.trim().toUpperCase();
  if (!VALID_STATES.has(normalised)) {
    throw new Error(
      `"${raw}" is not a valid US state abbreviation. ` +
        `Expected a two-letter code such as "NY", "CA", or "TX".`
    );
  }
  return normalised;
}

// ─────────────────────────────────────────────
//  Core Query
// ─────────────────────────────────────────────

export interface QueryOptions {
  /** Optional: limit results to a specific event type */
  eventType?: EventType;
  /** Optional: only include events that require voter action */
  actionRequired?: boolean;
  /** Optional: exclude events whose date has already passed */
  upcomingOnly?: boolean;
}

/**
 * Returns all ElectionEvents relevant to a given state.
 *
 * Always merges NATIONAL-level events as a fallback baseline, then
 * appends state-specific events, and sorts the combined list
 * chronologically (earliest date first).
 *
 * @param state   - Validated, normalised state code (e.g. "NY")
 * @param options - Optional filters to narrow the result set
 */
export function getEventsForState(
  state: string,
  options: QueryOptions = {}
): ElectionEvent[] {
  const { eventType, actionRequired, upcomingOnly } = options;
  const now = new Date();

  let events = MOCK_ELECTION_EVENTS.filter((event) => {
    // ── 1. Scope filter: must match the state or be a NATIONAL fallback
    if (event.state !== state && event.state !== "NATIONAL") return false;

    // ── 2. Event type filter (optional)
    if (eventType && event.eventType !== eventType) return false;

    // ── 3. Action-required filter (optional)
    if (actionRequired === true && !event.actionRequired) return false;

    // ── 4. Upcoming-only filter (optional)
    if (upcomingOnly === true && new Date(event.date) <= now) return false;

    return true;
  });

  // ── 5. Sort chronologically
  events = events.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return events;
}

// ─────────────────────────────────────────────
//  Convenience Helpers
// ─────────────────────────────────────────────

/**
 * Returns only the deadline events for a state (state-specific + national).
 * Useful for building "urgent actions" UI blocks.
 */
export function getDeadlinesForState(state: string): ElectionEvent[] {
  return getEventsForState(state, { eventType: "deadline" });
}

/**
 * Returns the next single upcoming event for a state.
 * Returns null if no future events are found.
 */
export function getNextEvent(state: string): ElectionEvent | null {
  const upcoming = getEventsForState(state, { upcomingOnly: true });
  return upcoming.length > 0 ? upcoming[0] : null;
}

/**
 * Returns only the NATIONAL fallback events, sorted chronologically.
 * Can be used independently to power a "nationwide calendar" view.
 */
export function getNationalEvents(options: QueryOptions = {}): ElectionEvent[] {
  return getEventsForState("NATIONAL", options);
}
