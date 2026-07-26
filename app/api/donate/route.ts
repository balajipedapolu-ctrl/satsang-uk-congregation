import { NextResponse } from "next/server";

/**
 * Records a self-reported donation so the organising team can track who
 * contributed and how much.
 *
 * The actual payment happens on SumUp; this endpoint just logs the donor's
 * details into the same Google Sheet used for registrations (on a separate
 * "Donations" tab), if the webhook is configured.
 *
 * To enable saving, set GOOGLE_SHEETS_WEBHOOK_URL and use the updated Apps
 * Script from GOOGLE_SHEETS_SETUP.md (it routes donations to their own tab).
 * If it isn't set, the form still works — it just won't persist the data.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body?.name ?? "").trim();
    const amount = String(body?.amount ?? "").trim();

    if (!name || !amount) {
      return NextResponse.json(
        { error: "Name and amount are required." },
        { status: 400 },
      );
    }

    const reference = `DON19-${Math.random()
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
            type: "donation",
            reference,
            name,
            email: String(body?.email ?? ""),
            phone: String(body?.phone ?? ""),
            amount,
            method: String(body?.method ?? ""),
            receipt: String(body?.receipt ?? ""),
            message: String(body?.message ?? ""),
          }),
        });
      } catch (err) {
        // Don't block the donor if the sheet is unreachable — just log it.
        console.error("Could not save donation to Google Sheet:", err);
      }
    } else {
      console.warn(
        "GOOGLE_SHEETS_WEBHOOK_URL is not set — donation was not saved.",
      );
    }

    return NextResponse.json({ reference });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
