"use client";

import { useState } from "react";
import Image from "next/image";
import DonationForm from "@/components/DonationForm";
import { DONATION_URL, DONATION_QR } from "@/lib/event";

/**
 * Two-step donation flow.
 *
 * Step 1 — the visitor pays via SumUp (button) or by scanning the QR code.
 * Step 2 — only AFTER they've gone to the payment page (or confirmed they paid
 *          another way) does the tracking form unlock, so we don't record
 *          donations that were never actually paid.
 *
 * Note: a SumUp payment link gives no automatic callback, so this gate ensures
 * the payment step was taken; it can't verify the payment truly succeeded.
 */
export default function DonateFlow() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <>
      {/* Step 1 — payment */}
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.18em] text-saffron-700">
          Step 1 · Make your donation
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Online / card */}
          <div className="card flex flex-col items-center text-center">
            <span className="text-4xl">💳</span>
            <h2 className="mt-3 font-serif text-xl font-bold text-maroon-900">
              Give online
            </h2>
            <p className="mt-2 text-sm text-ink/70">
              Pay securely by debit or credit card through our SumUp page. It only
              takes a moment.
            </p>
            <a
              href={DONATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setUnlocked(true)}
              className="btn-primary mt-5 w-full"
            >
              Donate securely with SumUp
            </a>
            <p className="mt-3 text-xs text-ink/50">
              You&rsquo;ll be redirected to SumUp&rsquo;s secure payment page.
            </p>
          </div>

          {/* QR code */}
          <div className="card flex flex-col items-center text-center">
            <span className="text-4xl">📱</span>
            <h2 className="mt-3 font-serif text-xl font-bold text-maroon-900">
              Scan to pay
            </h2>
            <p className="mt-2 text-sm text-ink/70">
              Open your phone camera and scan the code below to go straight to the
              payment page.
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
        </div>
      </div>

      {/* Step 2 — tracking form (locked until payment step is taken) */}
      <div className="mx-auto mt-16 max-w-2xl">
        <p className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.18em] text-saffron-700">
          Step 2 · Let us know about your donation
        </p>

        {unlocked ? (
          <>
            <p className="mb-8 text-center text-ink/70">
              Thank you for paying! Please fill in a few quick details so we can
              acknowledge your contribution and keep our records accurate.
            </p>
            <DonationForm />
          </>
        ) : (
          <div className="card mx-auto max-w-xl text-center">
            <span className="text-4xl">🔒</span>
            <h3 className="mt-3 font-serif text-xl font-bold text-maroon-900">
              Please complete your payment first
            </h3>
            <p className="mt-2 text-sm text-ink/70">
              This form unlocks once you&rsquo;ve made your donation using the
              SumUp button or QR code above. This helps us keep our records
              accurate.
            </p>
            <button
              type="button"
              onClick={() => setUnlocked(true)}
              className="btn-secondary mt-6"
            >
              I&rsquo;ve completed my payment
            </button>
          </div>
        )}
      </div>
    </>
  );
}
