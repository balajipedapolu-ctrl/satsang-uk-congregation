import { NextResponse } from "next/server";
import { FEEDBACK_AREAS } from "@/lib/event";

/**
 * Handles post-event feedback from attendees.
 *
 * Saves each response to a "Feedback" tab in the same Google Sheet used for
 * registrations, if the webhook (GOOGLE_SHEETS_WEBHOOK_URL) is configured.
 * If it isn't set, the form still works — it just won't persist the response.
 */

const MAX_TEXT = 2000;

function rating(value: unknown): string {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? String(n) : "";
}

function text(value: unknown): string {
  return String(value ?? "").trim().slice(0, MAX_TEXT);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const overall = rating(body?.overall);
    if (!overall) {
      return NextResponse.json(
        { error: "Please give an overall rating from 1 to 5." },
        { status: 400 },
      );
    }

    const areas = body?.areas && typeof body.areas === "object" ? body.areas : {};
    const areaRatings = Object.fromEntries(
      Object.keys(FEEDBACK_AREAS).map((key) => [key, rating(areas[key])]),
    );

    const payload = {
      type: "feedback",
      overall,
      attendedAs: text(body?.attendedAs),
      areas: areaRatings,
      enjoyed: text(body?.enjoyed),
      improve: text(body?.improve),
      suggestions: text(body?.suggestions),
      nextYear: text(body?.nextYear),
      name: text(body?.name),
      email: text(body?.email),
    };

    const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        // Don't block the visitor if the sheet is unreachable — just log it.
        console.error("Could not save feedback to Google Sheet:", err);
      }
    } else {
      console.warn(
        "GOOGLE_SHEETS_WEBHOOK_URL is not set — feedback was not saved.",
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
