"use client";

import { useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { EVENT, SEVA_OPTIONS } from "@/lib/event";

type FormState = {
  name: string;
  email: string;
  phone: string;
  location: string;
  attendees: number;
  wantsToVolunteer: boolean;
  seva: string[];
};

type Confirmation = {
  reference: string;
  name: string;
  attendees: number;
  seva: string[];
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  location: "",
  attendees: 1,
  wantsToVolunteer: false,
  seva: [],
};

// Client-side fallback reference generator (used if the API is unavailable).
function localReference() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SUK19-${rand}`;
}

export default function RegistrationForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Confirmation | null>(null);

  function toggleSeva(option: string) {
    setForm((f) => ({
      ...f,
      seva: f.seva.includes(option)
        ? f.seva.filter((s) => s !== option)
        : [...f.seva, option],
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    let reference = localReference();
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.reference) reference = data.reference;
      }
    } catch {
      // Keep the locally generated reference if the API call fails.
    }

    setResult({
      reference,
      name: form.name,
      attendees: form.attendees,
      seva: form.wantsToVolunteer ? form.seva : [],
    });
    setSubmitting(false);
  }

  if (result) {
    const qrValue = [
      `${EVENT.organisation} — ${EVENT.edition} National Congregation`,
      `Ref: ${result.reference}`,
      `Name: ${result.name}`,
      `Attendees: ${result.attendees}`,
      `Date: ${EVENT.dateLabel}`,
    ].join("\n");

    return (
      <div className="card mx-auto max-w-xl text-center">
        <span className="text-5xl">✅</span>
        <h2 className="mt-4 font-serif text-2xl font-bold text-maroon-900">
          Registration confirmed!
        </h2>
        <p className="mt-2 text-ink/70">
          Thank you, {result.name.split(" ")[0] || "friend"}. We look forward to
          welcoming you and your party of {result.attendees}.
        </p>

        <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl bg-cream p-6">
          <div className="rounded-xl bg-white p-4 shadow-card">
            <QRCodeSVG value={qrValue} size={168} fgColor="#7c2d22" level="M" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-saffron-700">
              Your reference number
            </p>
            <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-maroon-900">
              {result.reference}
            </p>
          </div>
          <p className="text-sm text-ink/60">
            Please save this QR code and reference number, and show it at the
            welcome desk on arrival. A confirmation email will follow shortly.
          </p>
        </div>

        {/* NHS "What's Your Blood Type?" (WYBT) campaign */}
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-left">
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/nhs-blood-donation.jpg"
              alt="NHS — What's Your Blood Type? campaign at the Satsang UK event"
              className="mx-auto w-40 shrink-0 rounded-lg shadow-card sm:mx-0"
            />
            <div className="space-y-2 text-sm leading-relaxed text-ink/75">
              <h3 className="font-serif text-lg font-semibold text-red-700">
                🩸 What&rsquo;s Your Blood Type? — the NHS at our event
              </h3>
              <p>
                We are delighted to announce that the NHS has kindly agreed to
                run its &ldquo;What&rsquo;s Your Blood Type?&rdquo; (WYBT)
                campaign during our event on 26th September.
              </p>
              <p>
                As part of this initiative, NHS volunteers will be available to
                engage with attendees, provide information about blood donation,
                and offer those who are interested the opportunity to register
                as potential blood donors. This collaboration reflects our
                shared commitment to promoting community wellbeing, public
                health, and the spirit of selfless service.
              </p>
              <p>
                We warmly encourage all attendees of our event to visit the NHS
                team, learn more about the importance of blood donation, and
                consider becoming part of this life-saving initiative.
              </p>
              <a
                href="https://www.blood.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block pt-1 font-semibold text-red-700 underline"
              >
                Learn more at blood.co.uk →
              </a>
            </div>
          </div>
        </div>

        {result.seva.length > 0 ? (
          <p className="mt-4 text-sm text-ink/70">
            🙏 Thank you for offering seva:{" "}
            <span className="font-medium text-maroon-800">
              {result.seva.join(", ")}
            </span>
          </p>
        ) : null}

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setForm(initialState);
            }}
            className="btn-secondary"
          >
            Register another attendee
          </button>
          <Link href="/" className="btn-primary">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card mx-auto max-w-xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="field-label">
            Full name <span className="text-maroon-500">*</span>
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="field-input"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="field-label">
            Email <span className="text-maroon-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="field-input"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="field-label">
            Contact number <span className="text-maroon-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="field-input"
            placeholder="+44 …"
          />
        </div>

        <div>
          <label htmlFor="location" className="field-label">
            Location / City <span className="text-maroon-500">*</span>
          </label>
          <input
            id="location"
            required
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="field-input"
            placeholder="e.g. London"
          />
        </div>

        <div>
          <label htmlFor="attendees" className="field-label">
            Number of attendees <span className="text-maroon-500">*</span>
          </label>
          <input
            id="attendees"
            type="number"
            min={1}
            max={50}
            required
            value={form.attendees}
            onChange={(e) =>
              setForm({
                ...form,
                attendees: Math.max(1, Number(e.target.value) || 1),
              })
            }
            className="field-input"
          />
        </div>
      </div>

      {/* Seva / volunteering */}
      <div className="rounded-xl border border-saffron-100 bg-cream/60 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={form.wantsToVolunteer}
            onChange={(e) =>
              setForm({ ...form, wantsToVolunteer: e.target.checked })
            }
            className="mt-1 h-4 w-4 accent-saffron-600"
          />
          <span>
            <span className="font-medium text-maroon-900">
              I would like to volunteer / offer seva
            </span>
            <span className="mt-0.5 block text-sm text-ink/60">
              Help make the congregation a success — every hand is appreciated.
            </span>
          </span>
        </label>

        {form.wantsToVolunteer ? (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {SEVA_OPTIONS.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm shadow-sm"
              >
                <input
                  type="checkbox"
                  checked={form.seva.includes(option)}
                  onChange={() => toggleSeva(option)}
                  className="h-4 w-4 accent-saffron-600"
                />
                <span className="text-ink/80">{option}</span>
              </label>
            ))}
          </div>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full text-base disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Complete Registration"}
      </button>

      <p className="text-center text-xs text-ink/50">
        By registering you agree to receive event-related communication from{" "}
        {EVENT.organisation}. We never share your details.
      </p>
    </form>
  );
}
