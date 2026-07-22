import { NextResponse } from "next/server";

/**
 * Handles congregation registrations.
 *
 * 1. Validates the payload
 * 2. Generates a unique reference number (used for the QR code)
 * 3. Saves the registration into a Google Sheet, if the webhook is configured
 *
 * To enable saving, set the environment variable GOOGLE_SHEETS_WEBHOOK_URL to
 * the URL of a Google Apps Script Web App (see GOOGLE_SHEETS_SETUP.md).
 * If it isn't set, the site still works — it just won't persist the data.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 },
      );
    }

    const reference = `SUK19-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;

    const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference,
            name,
            email,
            phone: String(body?.phone ?? ""),
            location: String(body?.location ?? ""),
            attendees: body?.attendees ?? "",
            wantsToVolunteer: Boolean(body?.wantsToVolunteer),
            seva: Array.isArray(body?.seva) ? body.seva : [],
          }),
        });
      } catch (err) {
        // Don't block the visitor if the sheet is unreachable — just log it.
        console.error("Could not save registration to Google Sheet:", err);
      }
    } else {
      console.warn(
        "GOOGLE_SHEETS_WEBHOOK_URL is not set — registration was not saved.",
      );
    }

    return NextResponse.json({ reference });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
