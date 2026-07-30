import { THAKUR_QUOTE } from "@/lib/event";

/**
 * A quote card featuring a teaching of Sree Sree Thakur Anukulchandra,
 * shown just below the hero as an opening inspiration. Matches the soft
 * cream/white gradient card style used for the guiding quote in About.
 */
export default function QuoteBand() {
  return (
    <section className="bg-cream py-14 sm:py-20">
      <div className="container-x">
        <figure className="card mx-auto max-w-3xl bg-gradient-to-br from-white to-saffron-50">
          <div className="font-serif text-6xl leading-none text-saffron-300">
            &ldquo;
          </div>
          <blockquote className="-mt-4 font-serif text-2xl font-medium leading-relaxed text-maroon-900 sm:text-3xl">
            {THAKUR_QUOTE.text}
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            <span className="h-px w-10 bg-saffron-400" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-saffron-700">
              {THAKUR_QUOTE.author}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
