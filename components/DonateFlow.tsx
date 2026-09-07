"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PhoneField from "@/components/PhoneField";
import { DONATION_URL, DONATION_QR } from "@/lib/event";

type FormState = {
  name: string;
  email: string;
  phone: string;
  amount: string;
  method: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  amount: "",
  method: "SumUp (card / online)",
  message: "",
};

const METHODS = ["SumUp (card / online)", "QR code scan"];

/**
 * Two-layer donation flow.
 *
 * Layer 1 — the donor fills in their details (name, amount, contact…), which
 *           is saved immediately so we have a record even if payment isn't
 *           completed.
 * Layer 2 — the payment gate (SumUp button + QR code) then appears for them
 *           to complete their donation.
 */
export default function DonateFlow() {
  const [phase, setPhase] = useState<"details" | "pay">("details");
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const startedSentRef = useRef(false);

  async function handleContinue(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Record the donor's details once per donation attempt, before they even
    // reach the payment page — so we have a record of their intent even if
    // they never complete payment. Going back via "Edit my details" and
    // continuing again shouldn't create a duplicate row.
    if (!startedSentRef.current) {
      setSubmitting(true);
      try {
        await fetch("/api/donate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, stage: "started" }),
        });
        startedSentRef.current = true;
      } catch {
        // Don't block the donor if the sheet is unreachable.
      }
      setSubmitting(false);
    }

    setPhase("pay");
    // Bring the payment section into view.
    setTimeout(() => {
      document
        .getElementById("payment-gate")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
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

          <PhoneField
            key={formKey}
            id="d-phone"
            label="Contact number"
            disabled={phase === "pay"}
            value={form.phone}
            onChange={(phone) => setForm({ ...form, phone })}
          />

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
              placeholder="e.g. 10"
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
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full text-base disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving your details…" : "Continue to payment →"}
          </button>
        ) : null}
      </form>

      {/* ---------- Layer 2: payment gate (revealed after step 1) ---------- */}
      {phase === "pay" ? (
        <div id="payment-gate" className="mt-16 scroll-mt-24">
          <p className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.18em] text-saffron-700">
            Step 2 · Make your payment
          </p>

          <div className="mb-6 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-800">
            ✅ Your details have been saved to our records. Now please
            complete your payment below via SumUp.
          </div>

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
            ) : (
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
            )}
          </div>

          <div className="mx-auto mt-8 max-w-md rounded-2xl bg-cream p-6 text-center">
            <span className="text-3xl">🙏</span>
            <p className="mt-2 font-serif text-lg font-semibold text-maroon-900">
              Thank you for your generosity
            </p>
            <p className="mt-1 text-sm text-ink/70">
              Your details have already been saved — there&rsquo;s nothing
              more you need to do here once your payment is complete.
            </p>
            <Link href="/" className="btn-primary mt-5 inline-block">
              Back to home
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
