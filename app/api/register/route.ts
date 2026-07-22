import { NextResponse } from "next/server";

/**
 * Handles congregation registrations.
 *
 * Right now it validates the payload and returns a unique reference number,
 * which the client turns into a QR code. To actually deliver a confirmation
 * email (and/or persist registrations), wire in a provider below — see README
 * ("Enabling confirmation emails").
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

    // --- Optional: send a confirmation email -------------------------------
    // 1. `npm install resend`
    // 2. Add RESEND_API_KEY in your environment / Vercel project settings.
    // 3. Uncomment:
    //
    // import { Resend } from "resend";
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "Satsang UK <noreply@satsanguk.org>",
    //   to: email,
    //   subject: `Registration confirmed — ${reference}`,
    //   text: `Namaskar ${name},\n\nYour registration is confirmed.\nReference: ${reference}\n\nSee you at the congregation!`,
    // });
    // -----------------------------------------------------------------------

    return NextResponse.json({ reference });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
