"use client";

import { useState } from "react";
import Link from "next/link";

type FormState = {
  name: string;
  email: string;
  phone: string;
  amount: string;
  method: string;
  message: string;
  confirmedPaid: boolean;
};

type Confirmation = {
  reference: string;
  name: string;
  amount: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  amount: "",
  method: "SumUp (card / online)",
  message: "",
  confirmedPaid: false,
};

const METHODS = [
  "SumUp (card / online)",
  "QR code scan",
  "Bank transfer",
  "Cash",
  "Other",
];

// Client-side fallback reference (used if the API is unavailable).
function localReference() {
  return `DON19-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export default function DonationForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Confirmation | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    let reference = localReference();
    try {
      const res = await fetch("/api/donate", {
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

    setResult({ reference, name: form.name, amount: form.amount });
    setSubmitting(false);
  }

  if (result) {
    return (
      <div className="card mx-auto max-w-xl text-center">
        <span className="text-5xl">🙏</span>
        <h2 className="mt-4 font-serif text-2xl font-bold text-maroon-900">
          Thank you for your contribution!
        </h2>
        <p className="mt-2 text-ink/70">
          We&rsquo;ve recorded your donation, {result.name.split(" ")[0] || "friend"}
          . Your generosity helps make the congregation possible.
        </p>

        <div className="mt-6 rounded-2xl bg-cream p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-saffron-700">
            Your reference number
          </p>
          <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-maroon-900">
            {result.reference}
          </p>
          <p className="mt-3 text-sm text-ink/60">
            Please keep this reference. If you haven&rsquo;t paid yet, use the
            SumUp button or QR code above to complete your donation of{" "}
            <span className="font-semibold text-maroon-800">
              £{result.amount}
            </span>
            .
          </p>
        </div>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setForm(initialState);
            }}
            className="btn-secondary"
          >
            Record another donation
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
          <label htmlFor="d-name" className="field-label">
            Full name <span className="text-maroon-500">*</span>
          </label>
          <input
            id="d-name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="field-input"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label htmlFor="d-email" className="field-label">
            Email
          </label>
          <input
            id="d-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="field-input"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="d-phone" className="field-label">
            Contact number
          </label>
          <input
            id="d-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="field-input"
            placeholder="+44 …"
          />
        </div>

        <div>
          <label htmlFor="d-amount" className="field-label">
            Amount (£) <span className="text-maroon-500">*</span>
          </label>
          <input
            id="d-amount"
            type="number"
            min={1}
            step="1"
            required
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="field-input"
            placeholder="e.g. 50"
          />
        </div>

        <div>
          <label htmlFor="d-method" className="field-label">
            Payment method
          </label>
          <select
            id="d-method"
            value={form.method}
            onChange={(e) => setForm({ ...form, method: e.target.value })}
            className="field-input"
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="d-message" className="field-label">
            Message / dedication (optional)
          </label>
          <textarea
            id="d-message"
            rows={3}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="field-input"
            placeholder="Anything you'd like us to know"
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-saffron-100 bg-cream/60 p-4">
        <input
          type="checkbox"
          required
          checked={form.confirmedPaid}
          onChange={(e) =>
            setForm({ ...form, confirmedPaid: e.target.checked })
          }
          className="mt-1 h-4 w-4 accent-saffron-600"
        />
        <span className="text-sm text-ink/80">
          I confirm I have completed my payment (via the SumUp button, QR code or
          another method). <span className="text-maroon-500">*</span>
        </span>
      </label>

      <button
        type="submit"
        disabled={submitting || !form.confirmedPaid}
        className="btn-primary w-full text-base disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Saving…" : "Record my donation"}
      </button>

      <p className="text-center text-xs text-ink/50">
        This form is only to help us acknowledge and track contributions. Your
        payment is processed securely by SumUp.
      </p>
    </form>
  );
}
