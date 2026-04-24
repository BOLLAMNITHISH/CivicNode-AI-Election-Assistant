// ─────────────────────────────────────────────
//  Election Data — Core Type Definitions
//  Schema Version: 2.0
// ─────────────────────────────────────────────

/**
 * The category of an election event.
 * - "deadline"      → Time-sensitive action required (registration, mail-in request, etc.)
 * - "voting"        → An active window when votes can be cast
 * - "informational" → Background context, awareness campaigns, mailed materials
 * - "result"        → Post-election, result-related milestones
 */
export type EventType = "deadline" | "voting" | "informational" | "result";

/**
 * The scope of an election event.
 * - "NATIONAL" → Applies to all US citizens regardless of state
 * - A two-letter state code (e.g. "NY", "CA") → State-specific event
 */
export type EventScope = "NATIONAL" | string;

/**
 * A single actionable item associated with an election step.
 * Links the voter to an external resource or internal page.
 */
export interface ActionItem {
  id: string;
  label: string;
  href?: string; // optional external/internal link
}

/**
 * Core schema for an ElectionEvent.
 *
 * Required fields:
 *   id, state, eventType, date, title, description
 *
 * Optional fields:
 *   actionRequired, actionItems, metadata
 */
export interface ElectionEvent {
  /** Unique identifier (e.g. "nat-1", "ny-reg-deadline") */
  id: string;

  /** Two-letter state abbreviation or "NATIONAL" */
  state: EventScope;

  /** The category of this event */
  eventType: EventType;

  /**
   * ISO 8601 date-time string.
   * Always store in UTC, display in local timezone on the client.
   * @example "2026-10-24T23:59:59Z"
   */
  date: string;

  /** Short human-readable headline for the event */
  title: string;

  /** Full descriptive text explaining the event and its impact on voters */
  description: string;

  /**
   * If true, the voter must take a concrete action before this date.
   * Used to visually flag urgent steps in the UI.
   */
  actionRequired?: boolean;

  /** List of links / tasks the voter should complete for this event */
  actionItems?: ActionItem[];

  /** Additional structured metadata for filtering and analytics */
  metadata?: {
    /** Official source URL for verification */
    sourceUrl?: string;
    /** Whether this event affects mail-in / absentee voters specifically */
    affectsMailIn?: boolean;
    /** Whether this event affects in-person voters specifically */
    affectsInPerson?: boolean;
    /** Tags for future categorization/search */
    tags?: string[];
  };
}

// ─────────────────────────────────────────────
//  API Response Shape
// ─────────────────────────────────────────────

/** Successful response from GET /api/election-data */
export interface ElectionDataResponse {
  /** The normalized, uppercase state code that was queried */
  state: string;
  /** Total number of events returned */
  count: number;
  /** Sorted list of ElectionEvents (chronological, earliest first) */
  events: ElectionEvent[];
}

/** Error response from GET /api/election-data */
export interface ElectionDataErrorResponse {
  error: string;
  details?: string;
  example?: string;
}
