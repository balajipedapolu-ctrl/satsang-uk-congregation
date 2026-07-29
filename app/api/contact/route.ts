import { NextResponse } from "next/server";

/**
 * Handles general contact-form enquiries.
 *
 * Saves each message to a "Messages" tab in the same Google Sheet used for
 * registrations, if the webhook (GOOGLE_SHEETS_WEBHOOK_URL) is configured.
 * If it isn't set, the form still works — it just won't persist the message.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const message = String(body?.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }

    const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "message", name, email, message }),
        });
      } catch (err) {
        // Don't block the visitor if the sheet is unreachable — just log it.
        console.error("Could not save contact message to Google Sheet:", err);
      }
    } else {
      console.warn(
        "GOOGLE_SHEETS_WEBHOOK_URL is not set — contact message was not saved.",
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
