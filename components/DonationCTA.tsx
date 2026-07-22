import { DONATION_URL, EVENT } from "@/lib/event";

export default function DonationCTA() {
  return (
    <section className="relative overflow-hidden bg-maroon-900 py-16">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-10" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-saffron-500/20 blur-3xl" />

      <div className="container-x relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <span className="text-5xl">🪔</span>
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            Support the Congregation
          </h2>
          <p className="max-w-xl leading-relaxed text-cream/80">
            Your generous contribution helps us welcome families, prepare prasad,
            and organise a memorable {EVENT.edition} National Congregation. Every
            offering, big or small, is received with gratitude.
          </p>
          <a
            href={DONATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-base"
          >
            Donate / Contribute
          </a>
          <p className="text-xs text-cream/50">
            You will be redirected to our secure donation page.
          </p>
        </div>
      </div>
    </section>
  );
}
