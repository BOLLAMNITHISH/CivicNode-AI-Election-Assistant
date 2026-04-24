/**
 * GET /api/election-data
 *
 * Query Parameters:
 *  - state          {string}  Required. Two-letter US state code (e.g. "NY", "CA").
 *  - eventType      {string}  Optional. Filter by type: "deadline" | "voting" | "informational" | "result"
 *  - actionRequired {boolean} Optional. Pass "true" to return only action-required events.
 *  - upcomingOnly   {boolean} Optional. Pass "true" to exclude past events.
 *
 * Successful Response (200):
 *  {
 *    state: "NY",
 *    count: 4,
 *    events: [ ...ElectionEvent[] ]
 *  }
 *
 * Error Responses:
 *  400 — Missing or invalid `state` parameter
 *  400 — Unknown `eventType` value
 *  500 — Unexpected server error
 *
 * Notes:
 *  - NATIONAL-level fallback events are ALWAYS included alongside state events.
 *  - Results are sorted chronologically (earliest first).
 *  - All business logic lives in @/lib/services/election-service.ts
 */

import { NextRequest, NextResponse } from "next/server";
import {
  isValidState,
  normaliseState,
  getEventsForState,
} from "@/lib/services/election-service";
import { rateLimit } from "@/lib/rate-limit";
import type { EventType, ElectionDataResponse, ElectionDataErrorResponse } from "@/types";

const VALID_EVENT_TYPES: EventType[] = [
  "deadline",
  "voting",
  "informational",
  "result",
];

export async function GET(request: NextRequest) {
  try {
    // ── 0. Rate Limiting ────────────────────────────────────────────────
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
    const { success, limit, remaining, reset } = rateLimit(ip, 30, 60000); // 30 requests per minute

    if (!success) {
      const body: ElectionDataErrorResponse = {
        error: "Rate limit exceeded. Please wait a minute before trying again.",
      };
      return NextResponse.json(body, {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      });
    }

    const { searchParams } = new URL(request.url);

    // ── 1. Extract & validate `state` ──────────────────────────────────
    const rawState = searchParams.get("state");

    if (!rawState || rawState.trim() === "") {
      const body: ElectionDataErrorResponse = {
        error: "Missing required query parameter: state",
        details: "Provide a two-letter US state abbreviation.",
        example: "/api/election-data?state=NY",
      };
      return NextResponse.json(body, { status: 400 });
    }

    if (!isValidState(rawState)) {
      const body: ElectionDataErrorResponse = {
        error: `"${rawState}" is not a valid US state code.`,
        details:
          "Must be a two-letter abbreviation for one of the 50 US states (e.g. NY, CA, TX).",
        example: "/api/election-data?state=CA",
      };
      return NextResponse.json(body, { status: 400 });
    }

    const state = normaliseState(rawState);

    // ── 2. Extract & validate optional `eventType` ──────────────────────
    const rawEventType = searchParams.get("eventType");
    let eventType: EventType | undefined;

    if (rawEventType) {
      if (!VALID_EVENT_TYPES.includes(rawEventType as EventType)) {
        const body: ElectionDataErrorResponse = {
          error: `"${rawEventType}" is not a valid eventType.`,
          details: `Valid values are: ${VALID_EVENT_TYPES.join(", ")}.`,
          example: "/api/election-data?state=NY&eventType=deadline",
        };
        return NextResponse.json(body, { status: 400 });
      }
      eventType = rawEventType as EventType;
    }

    // ── 3. Extract optional boolean filters ─────────────────────────────
    const actionRequired =
      searchParams.get("actionRequired") === "true" ? true : undefined;
    const upcomingOnly =
      searchParams.get("upcomingOnly") === "true" ? true : undefined;

    // ── 4. Delegate to service layer ─────────────────────────────────────
    const events = getEventsForState(state, {
      eventType,
      actionRequired,
      upcomingOnly,
    });

    // ── 5. Return response ───────────────────────────────────────────────
    const body: ElectionDataResponse = {
      state,
      count: events.length,
      events,
    };

    return NextResponse.json(body, {
      status: 200,
      headers: {
        // Revalidate every 6 hours — data doesn't change per-request
        "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=3600",
      },
    });
  } catch (err) {
    // Unexpected server error
    console.error("[/api/election-data] Unhandled error:", err);
    const body: ElectionDataErrorResponse = {
      error: "An unexpected server error occurred.",
      details: err instanceof Error ? err.message : "Unknown error",
    };
    return NextResponse.json(body, { status: 500 });
  }
}
