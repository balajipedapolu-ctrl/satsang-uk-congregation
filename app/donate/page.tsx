import type { Metadata } from "next";
import Link from "next/link";
import DonateFlow from "@/components/DonateFlow";
import { EVENT } from "@/lib/event";

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

        {/* Two-step flow: pay first, then the tracking form unlocks */}
        <DonateFlow />
      </div>
    </section>
  );
}
