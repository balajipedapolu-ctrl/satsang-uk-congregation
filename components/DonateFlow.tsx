"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DONATION_URL, DONATION_QR } from "@/lib/event";

type FormState = {
  name: string;
  email: string;
  phone: string;
  amount: string;
  method: string;
  message: string;
  receipt: string;
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
  receipt: "",
  confirmedPaid: false,
};

const METHODS = [
  "SumUp (card / online)",
  "QR code scan",
  "Bank transfer",
  "Cash",
  "Other",
];

function localReference() {
  return `DON19-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

/**
 * Two-layer donation flow.
 *
 * Layer 1 — the donor fills in their details (name, amount, contact…).
 * Layer 2 — only then does the payment gate (SumUp button + QR code) appear,
 *           where they pay and confirm. Nothing is saved until they confirm
 *           payment, so we don't record donations that were never paid.
 */
export default function DonateFlow() {
  const [phase, setPhase] = useState<"details" | "pay">("details");
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Confirmation | null>(null);

  function handleContinue(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPhase("pay");
    // Bring the payment section into view.
    setTimeout(() => {
      document
        .getElementById("payment-gate")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  async function handleRecord(e: React.FormEvent<HTMLFormElement>) {
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
      // Keep the local reference if the API is unreachable.
    }

    setResult({ reference, name: form.name, amount: form.amount });
    setSubmitting(false);
  }

  /* ---------- Thank-you ---------- */
  if (result) {
    return (
      <div className="card mx-auto max-w-xl text-center">
        <span className="text-5xl">🙏</span>
        <h2 className="mt-4 font-serif text-2xl font-bold text-maroon-900">
          Thank you for your contribution!
        </h2>
        <p className="mt-2 text-ink/70">
          We&rsquo;ve recorded your donation,{" "}
          {result.name.split(" ")[0] || "friend"}. Your generosity helps make the
          congregation possible.
        </p>

        <div className="mt-6 rounded-2xl bg-cream p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-saffron-700">
            Your reference number
          </p>
          <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-maroon-900">
            {result.reference}
          </p>
          <p className="mt-3 text-sm text-ink/60">
            Please keep this reference for your records. Your donation of{" "}
            <span className="font-semibold text-maroon-800">
              £{result.amount}
            </span>{" "}
            has been noted.
          </p>
        </div>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setForm(initialState);
              setPhase("details");
            }}
            className="btn-secondary"
          >
            Make another donation
          </button>
          <Link href="/" className="btn-primary">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* ---------- Layer 1: details ---------- */}
      <p className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.18em] text-saffron-700">
        Step 1 · Your details
      </p>

      <form onSubmit={handleContinue} className="card space-y-5">
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
              disabled={phase === "pay"}
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
              disabled={phase === "pay"}
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
              disabled={phase === "pay"}
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
              disabled={phase === "pay"}
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
              disabled={phase === "pay"}
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
              disabled={phase === "pay"}
            />
          </div>
        </div>

        {phase === "details" ? (
          <button type="submit" className="btn-primary w-full text-base">
            Continue to payment →
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setPhase("details")}
            className="text-sm font-medium text-saffron-700 hover:underline"
          >
            ← Edit my details
          </button>
        )}
      </form>

      {/* ---------- Layer 2: payment gate (revealed after step 1) ---------- */}
      {phase === "pay" ? (
        <div id="payment-gate" className="mt-16 scroll-mt-24">
          <p className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.18em] text-saffron-700">
            Step 2 · Make your payment
          </p>

          <div className="mb-8 rounded-2xl border-2 border-saffron-200 bg-saffron-50 p-5 text-center">
            <p className="text-ink/80">
              Please pay your donation of{" "}
              <span className="font-serif text-2xl font-bold text-maroon-900">
                £{form.amount || "—"}
              </span>{" "}
              using either option below.
            </p>
          </div>

          <div className="mx-auto max-w-md">
            {form.method === "QR code scan" ? (
              /* QR code */
              <div className="card flex flex-col items-center text-center">
                <span className="text-4xl">📱</span>
                <h3 className="mt-3 font-serif text-xl font-bold text-maroon-900">
                  Scan to pay
                </h3>
                <p className="mt-2 text-sm text-ink/70">
                  Open your phone camera and scan this code to pay.
                </p>
                <div className="mt-5 rounded-2xl bg-white p-4 shadow-card">
                  <Image
                    src={DONATION_QR}
                    alt="Scan this QR code to donate via SumUp"
                    width={200}
                    height={200}
                    className="h-48 w-48"
                  />
                </div>
              </div>
            ) : form.method === "SumUp (card / online)" ? (
              /* Online / card via SumUp gateway */
              <div className="card flex flex-col items-center text-center">
                <span className="text-4xl">💳</span>
                <h3 className="mt-3 font-serif text-xl font-bold text-maroon-900">
                  Give online
                </h3>
                <p className="mt-2 text-sm text-ink/70">
                  Pay securely by debit or credit card through our SumUp page.
                </p>
                <a
                  href={DONATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-5 w-full"
                >
                  Donate securely with SumUp
                </a>
                <p className="mt-3 text-xs text-ink/50">
                  Opens SumUp&rsquo;s secure payment page in a new tab.
                </p>
              </div>
            ) : (
              /* Offline methods: bank transfer / cash / other */
              <div className="card flex flex-col items-center text-center">
                <span className="text-4xl">
                  {form.method === "Cash" ? "💷" : "🏦"}
                </span>
                <h3 className="mt-3 font-serif text-xl font-bold text-maroon-900">
                  {form.method}
                </h3>
                <p className="mt-2 text-sm text-ink/70">
                  Please complete your {form.method.toLowerCase()} of{" "}
                  <span className="font-semibold text-maroon-800">
                    £{form.amount || "—"}
                  </span>
                  . If you&rsquo;d prefer to pay by card instead, you can go back
                  and choose &ldquo;SumUp (card / online)&rdquo; or
                  &ldquo;QR code scan&rdquo;.
                </p>
              </div>
            )}
          </div>

          {/* Confirm payment + record */}
          <form onSubmit={handleRecord} className="card mt-8 space-y-5">
            <div>
              <label htmlFor="d-receipt" className="field-label">
                SumUp receipt / transaction number
              </label>
              <input
                id="d-receipt"
                value={form.receipt}
                onChange={(e) => setForm({ ...form, receipt: e.target.value })}
                className="field-input"
                placeholder="From your SumUp receipt (helps us match your payment)"
              />
              <p className="mt-1 text-xs text-ink/50">
                Optional but very helpful — it lets us match your gift to the
                payment. You&rsquo;ll find it on the SumUp confirmation screen or
                receipt email.
              </p>
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
                I confirm I have completed my payment of £{form.amount || "—"}{" "}
                (via the SumUp button, QR code or another method).{" "}
                <span className="text-maroon-500">*</span>
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
              Your record is saved only after you confirm payment. Payment is
              processed securely by SumUp.
            </p>
          </form>
        </div>
      ) : null}
    </div>
  );
}
