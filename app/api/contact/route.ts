import { NextResponse } from "next/server";

/**
 * Handles general contact-form enquiries.
 * Validates the payload and returns success. To deliver these messages to your
 * inbox, wire in an email provider (see README) where indicated below.
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

    // --- Optional: forward the enquiry to your inbox -----------------------
    // See README ("Enabling confirmation emails") for a Resend example.
    // -----------------------------------------------------------------------

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
