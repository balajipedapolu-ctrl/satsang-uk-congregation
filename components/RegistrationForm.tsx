"use client";

import { useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import PhoneField from "@/components/PhoneField";
import { EVENT, SEVA_OPTIONS } from "@/lib/event";

type FormState = {
  name: string;
  email: string;
  phone: string;
  location: string;
  postcode: string;
  attendees: string;
  travelMode: string;
  wantsToVolunteer: boolean;
  seva: string[];
  bloodDonorInterest: boolean;
  whatsappInterest: boolean;
};

type Confirmation = {
  reference: string;
  name: string;
  attendees: string;
  seva: string[];
  bloodDonorInterest: boolean;
  whatsappInterest: boolean;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  location: "",
  postcode: "",
  attendees: "",
  travelMode: "",
  wantsToVolunteer: false,
  seva: [],
  bloodDonorInterest: false,
  whatsappInterest: false,
};

const TRAVEL_OPTIONS = ["Own Car", "Public Transport"];

// Client-side fallback reference generator (used if the API is unavailable).
function localReference() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SUK19-${rand}`;
}

export default function RegistrationForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Confirmation | null>(null);
  const [formKey, setFormKey] = useState(0);

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
      bloodDonorInterest: form.bloodDonorInterest,
      whatsappInterest: form.whatsappInterest,
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

        {result.seva.length > 0 ? (
          <p className="mt-4 text-sm text-ink/70">
            🙏 Thank you for offering seva:{" "}
            <span className="font-medium text-maroon-800">
              {result.seva.join(", ")}
            </span>
          </p>
        ) : null}

        {result.bloodDonorInterest ? (
          <div className="mt-6 rounded-2xl border-2 border-red-200 bg-red-50 p-5">
            <p className="font-serif text-lg font-semibold text-red-700">
              🩸 Thank you for your interest in blood donation!
            </p>
            <p className="mt-1 text-sm text-ink/75">
              The NHS team will be at the event to help you register and find out
              your blood type.
            </p>
          </div>
        ) : null}

        {result.whatsappInterest ? (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border-2 border-[#25D366]/30 bg-[#25D366]/10 p-5 text-left">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.05-1.36A10 10 0 1 0 12 2Zm0 18.2a8.16 8.16 0 0 1-4.17-1.14l-.3-.18-3.1.84.83-3.02-.2-.31A8.2 8.2 0 1 1 12 20.2Zm4.5-6.13c-.24-.12-1.45-.72-1.67-.8-.22-.08-.39-.12-.55.12-.16.24-.63.8-.78.96-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.44-1.34-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
              </svg>
            </span>
            <div>
              <p className="font-serif text-lg font-semibold text-[#1a7a45]">
                Thanks for joining the WhatsApp group!
              </p>
              <p className="mt-1 text-sm text-ink/75">
                We&rsquo;ll add you using the mobile number you shared, so keep
                an eye out for the invite closer to the day.
              </p>
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setForm(initialState);
              setFormKey((k) => k + 1);
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
    <div className="mx-auto max-w-xl">
      <div className="mb-6 text-center">
        <h2 className="font-serif text-2xl font-bold text-maroon-900 sm:text-3xl">
          Who&rsquo;s joining the utsav?
        </h2>
        <p className="mt-2 text-ink/70">
          Please share a few details of everyone coming along. It helps us
          prepare prasad, seating and a warm welcome for all.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
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

        <PhoneField
          key={formKey}
          id="phone"
          label="Contact number"
          required
          value={form.phone}
          onChange={(phone) => setForm({ ...form, phone })}
        />

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
          <label htmlFor="postcode" className="field-label">
            Postcode <span className="text-maroon-500">*</span>
          </label>
          <input
            id="postcode"
            required
            value={form.postcode}
            onChange={(e) => setForm({ ...form, postcode: e.target.value })}
            className="field-input"
            placeholder="e.g. SM3 8AB"
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
              setForm({ ...form, attendees: e.target.value })
            }
            className="field-input"
            placeholder="e.g. 2"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="travelMode" className="field-label">
            Are you travelling by?
          </label>
          <select
            id="travelMode"
            value={form.travelMode}
            onChange={(e) => setForm({ ...form, travelMode: e.target.value })}
            className="field-input"
          >
            <option value="">Select an option</option>
            {TRAVEL_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
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

      {/* NHS blood-donor interest */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={form.bloodDonorInterest}
            onChange={(e) =>
              setForm({ ...form, bloodDonorInterest: e.target.checked })
            }
            className="mt-1 h-4 w-4 accent-red-600"
          />
          <span>
            <span className="font-medium text-maroon-900">
              🩸 I&rsquo;m interested in becoming an NHS blood donor
            </span>
            <span className="mt-0.5 block text-sm text-ink/60">
              The NHS &ldquo;What&rsquo;s Your Blood Type?&rdquo; team will be at
              the event. Tick this and they&rsquo;ll help you register and find
              out your blood type on the day.
            </span>
          </span>
        </label>
      </div>

      {/* WhatsApp group interest */}
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 p-4">
        <input
          type="checkbox"
          checked={form.whatsappInterest}
          onChange={(e) =>
            setForm({ ...form, whatsappInterest: e.target.checked })
          }
          className="mt-1 h-4 w-4 accent-[#25D366]"
        />
        <span className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.05-1.36A10 10 0 1 0 12 2Zm0 18.2a8.16 8.16 0 0 1-4.17-1.14l-.3-.18-3.1.84.83-3.02-.2-.31A8.2 8.2 0 1 1 12 20.2Zm4.5-6.13c-.24-.12-1.45-.72-1.67-.8-.22-.08-.39-.12-.55.12-.16.24-.63.8-.78.96-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.44-1.34-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
            </svg>
          </span>
          <span>
            <span className="font-medium text-maroon-900">
              I&rsquo;d like to join the event WhatsApp group
            </span>
            <span className="mt-0.5 block text-sm text-ink/60">
              Get reminders, updates and connect with fellow attendees.
              We&rsquo;ll add you using the mobile number above.
            </span>
          </span>
        </span>
      </label>

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
    </div>
  );
}
