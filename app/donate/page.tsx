import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import DonationForm from "@/components/DonationForm";
import { DONATION_URL, DONATION_QR, EVENT } from "@/lib/event";

export const metadata: Metadata = {
  title: "Donate",
  description: `Support the ${EVENT.title}. Contribute securely online or by scanning our QR code.`,
};

export default function DonatePage() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-saffron-50 to-cream pt-[var(--header-height)]">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="container-x relative py-16 sm:py-20">
        {/* Heading */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <Link
            href="/"
            className="text-sm font-medium text-saffron-700 hover:underline"
          >
            ← Back to home
          </Link>
          <span className="eyebrow mt-4">Donate</span>
          <h1 className="mt-4 font-serif text-4xl font-bold text-maroon-900 sm:text-5xl">
            Support the Congregation
          </h1>
          <p className="mt-4 text-ink/70">
            Your generous contribution helps us welcome families, prepare prasad
            and organise a memorable {EVENT.edition} National Congregation. Every
            offering, big or small, is received with heartfelt gratitude. 🙏
          </p>
        </div>

        {/* Two ways to give */}
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
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

        {/* Tracking form */}
        <div className="mx-auto mt-16 max-w-2xl">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-2xl font-bold text-maroon-900 sm:text-3xl">
              Let us know about your donation
            </h2>
            <p className="mt-3 text-ink/70">
              After paying (or if you&rsquo;ve given another way), please fill in a
              few quick details so we can acknowledge your contribution and keep
              our records accurate.
            </p>
          </div>

          <DonationForm />
        </div>
      </div>
    </section>
  );
}
