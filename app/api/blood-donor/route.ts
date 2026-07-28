import { NextResponse } from "next/server";

/**
 * Records interest in NHS blood donation, captured after event registration.
 *
 * Saves the person's details to a "Blood Donors" tab in the same Google Sheet
 * used for registrations, if the webhook is configured. If it isn't set, the
 * form still works — it just won't persist the data.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const firstName = String(body?.firstName ?? "").trim();
    const lastName = String(body?.lastName ?? "").trim();
    const mobile = String(body?.mobile ?? "").trim();
    const postcode = String(body?.postcode ?? "").trim();

    if (!firstName || !lastName || !mobile || !postcode) {
      return NextResponse.json(
        { error: "First name, last name, mobile and postcode are required." },
        { status: 400 },
      );
    }

    const reference = `BLD19-${Math.random()
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
            type: "blood-donor",
            reference,
            firstName,
            lastName,
            mobile,
            postcode,
            email: String(body?.email ?? ""),
            consent: Boolean(body?.consent),
          }),
        });
      } catch (err) {
        // Don't block the visitor if the sheet is unreachable — just log it.
        console.error("Could not save blood-donor interest to Google Sheet:", err);
      }
    } else {
      console.warn(
        "GOOGLE_SHEETS_WEBHOOK_URL is not set — blood-donor interest was not saved.",
      );
    }

    return NextResponse.json({ reference });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
