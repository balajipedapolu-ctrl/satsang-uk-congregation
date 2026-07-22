import type { Metadata } from "next";
import Link from "next/link";
import RegistrationForm from "@/components/RegistrationForm";
import { EVENT } from "@/lib/event";

export const metadata: Metadata = {
  title: "Register",
  description: `Register to attend the ${EVENT.title} on ${EVENT.dateLabel} at ${EVENT.venue.name}.`,
};

export default function RegisterPage() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-saffron-50 to-cream pt-[var(--header-height)]">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="container-x relative py-16 sm:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <Link
            href="/"
            className="text-sm font-medium text-saffron-700 hover:underline"
          >
            ← Back to home
          </Link>
          <span className="eyebrow mt-4">Registration</span>
          <h1 className="mt-4 font-serif text-4xl font-bold text-maroon-900 sm:text-5xl">
            Reserve your place
          </h1>
          <p className="mt-4 text-ink/70">
            Join us on{" "}
            <span className="font-semibold text-maroon-800">
              {EVENT.dateLabel}
            </span>{" "}
            at {EVENT.venue.name}. Registration is free — it simply helps us plan
            prasad, seating and seva. You&rsquo;ll receive a reference number and
            QR code on completion.
          </p>
        </div>

        <RegistrationForm />
      </div>
    </section>
  );
}
