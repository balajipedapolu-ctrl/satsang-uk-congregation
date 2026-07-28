"use client";

import { useState } from "react";

type FormState = {
  firstName: string;
  lastName: string;
  mobile: string;
  postcode: string;
  email: string;
  consent: boolean;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  mobile: "",
  postcode: "",
  email: "",
  consent: false,
};

const NHS_URL = "https://www.blood.co.uk";

function localReference() {
  return `BLD19-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

/**
 * Blood-donor interest sign-up, shown after event registration completes.
 *
 * Step 1 — a short form captures who is interested (name, mobile, postcode).
 * Step 2 — only after they submit do we show the NHS poster and the link to
 *          register & book their donation on blood.co.uk.
 *
 * The interest is saved to a "Blood Donors" tab in the same Google Sheet used
 * for registrations, if the webhook is configured.
 */
export default function BloodDonorSignup() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    let ref = localReference();
    try {
      const res = await fetch("/api/blood-donor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.reference) ref = data.reference;
      }
    } catch {
      // Keep the local reference if the API is unreachable.
    }

    setReference(ref);
    setSubmitting(false);
  }

  /* ---------- After sign-up: show the NHS poster + booking link ---------- */
  if (reference) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border-2 border-red-200 bg-red-50 p-5 text-center sm:p-6">
        <span className="text-4xl">🩸</span>
        <h3 className="mt-3 font-serif text-xl font-bold text-red-700">
          Thank you for stepping forward, {form.firstName || "friend"}!
        </h3>
        <p className="mt-2 text-sm text-ink/75">
          Your interest has been noted (ref{" "}
          <span className="font-mono font-semibold text-red-700">
            {reference}
          </span>
          ). One final step — scan the QR code below (or use the button) to
          register and book your first donation with the NHS.
        </p>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/blood.jpeg"
          alt="NHS — What's Your Blood Type? Register to become a blood donor, book your first donation and find out your blood type"
          className="mx-auto mt-5 w-full max-w-sm rounded-xl bg-white p-1 shadow-soft"
        />

        <a
          href={NHS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-6 w-full !bg-red-600 hover:!bg-red-700"
        >
          Register &amp; book at blood.co.uk →
        </a>
        <p className="mt-3 text-xs text-ink/50">
          Opens the official NHS Give Blood website in a new tab. You can also
          find the NHS team at the event on the day.
        </p>
      </div>
    );
  }

  /* ---------- Interest form ---------- */
  return (
    <div className="mx-auto max-w-xl rounded-2xl border-2 border-red-200 bg-red-50 p-5 sm:p-6">
      <div className="text-center">
        <span className="text-4xl">🩸</span>
        <h3 className="mt-3 font-serif text-xl font-bold text-red-700">
          Interested in becoming a blood donor?
        </h3>
        <p className="mt-2 text-sm text-ink/75">
          The NHS is joining us at the event. Register your interest below and
          we&rsquo;ll connect you with their &ldquo;What&rsquo;s Your Blood
          Type?&rdquo; team — one donation can save up to three lives.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bd-first" className="field-label">
              First name <span className="text-red-600">*</span>
            </label>
            <input
              id="bd-first"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="field-input"
              placeholder="First name"
            />
          </div>
          <div>
            <label htmlFor="bd-last" className="field-label">
              Last name <span className="text-red-600">*</span>
            </label>
            <input
              id="bd-last"
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="field-input"
              placeholder="Last name"
            />
          </div>
          <div>
            <label htmlFor="bd-mobile" className="field-label">
              Mobile number <span className="text-red-600">*</span>
            </label>
            <input
              id="bd-mobile"
              type="tel"
              required
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              className="field-input"
              placeholder="+44 …"
            />
          </div>
          <div>
            <label htmlFor="bd-postcode" className="field-label">
              Postal code <span className="text-red-600">*</span>
            </label>
            <input
              id="bd-postcode"
              required
              value={form.postcode}
              onChange={(e) => setForm({ ...form, postcode: e.target.value })}
              className="field-input"
              placeholder="e.g. SM3 8AB"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="bd-email" className="field-label">
              Email (optional)
            </label>
            <input
              id="bd-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="field-input"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-red-200 bg-white/60 p-3">
          <input
            type="checkbox"
            required
            checked={form.consent}
            onChange={(e) => setForm({ ...form, consent: e.target.checked })}
            className="mt-1 h-4 w-4 accent-red-600"
          />
          <span className="text-sm text-ink/80">
            I&rsquo;m 17 or older and happy for the organisers to share my
            details with the NHS blood-donation team so they can contact me.{" "}
            <span className="text-red-600">*</span>
          </span>
        </label>

        <button
          type="submit"
          disabled={submitting || !form.consent}
          className="btn-primary w-full text-base !bg-red-600 hover:!bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Yes, I'm interested →"}
        </button>
      </form>
    </div>
  );
}
