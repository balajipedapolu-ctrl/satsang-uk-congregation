import { THAKUR_QUOTE } from "@/lib/event";

/**
 * A full-width quote band featuring a teaching of Sree Sree Thakur
 * Anukulchandra. Shown just below the hero as an opening inspiration.
 */
export default function QuoteBand() {
  return (
    <section className="relative overflow-hidden bg-maroon-900 py-16 sm:py-20">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-10" />
      <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-saffron-500/20 blur-3xl" />

      <div className="container-x relative">
        <figure className="mx-auto max-w-3xl text-center">
          <span
            aria-hidden
            className="block font-serif text-6xl leading-none text-saffron-400/70"
          >
            &ldquo;
          </span>
          <blockquote className="-mt-3 font-serif text-2xl italic leading-relaxed text-cream sm:text-3xl">
            {THAKUR_QUOTE.text}
          </blockquote>
          <figcaption className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-saffron-300">
            &mdash; {THAKUR_QUOTE.author}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
