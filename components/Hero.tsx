import Link from "next/link";
import { EVENT } from "@/lib/event";
import Countdown from "@/components/Countdown";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-saffron-50 via-cream to-cream pt-[var(--header-height)]">
      {/* decorative glow + texture */}
      <div className="pointer-events-none absolute inset-0 bg-saffron-radial" />
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-saffron-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-maroon-200/30 blur-3xl" />

      <div className="container-x relative py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <span className="eyebrow">
            {EVENT.dateLabel} · {EVENT.venue.name}
          </span>

          <h1 className="mt-6 font-serif text-4xl font-bold leading-tight text-maroon-900 sm:text-5xl md:text-6xl">
            {EVENT.title}
          </h1>

          <p className="mt-4 text-lg font-medium text-saffron-800 sm:text-xl">
            {EVENT.occasion}
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink/75">
            Whether you are seeking spiritual inspiration, practical guidance for
            everyday life, a welcoming community, or simply a unique cultural and
            community experience, our {EVENT.edition} National Congregation offers
            something meaningful for everyone. We warmly invite you, your family,
            and your friends to join us for a day of inspiration, music,
            meditation, learning, service, and fellowship.{" "}
            <span className="font-semibold text-maroon-800">
              Everyone is welcome.
            </span>
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register" className="btn-primary w-full sm:w-auto">
              Register Now
            </Link>
            <Link href="/#schedule" className="btn-secondary w-full sm:w-auto">
              View Schedule
            </Link>
          </div>
        </div>

        {/* Countdown */}
        <div className="mt-14 flex flex-col items-center gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-saffron-700">
            Counting down to the congregation
          </p>
          <Countdown />
        </div>
      </div>
    </section>
  );
}
