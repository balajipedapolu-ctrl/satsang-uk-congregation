/**
 * "About Sree Sree Thakur Anukulchandra" — a short, respectful introduction to
 * the life the congregation honours. Shown after the About section.
 */
export default function AboutThakur() {
  return (
    <section
      id="thakur"
      className="section bg-gradient-to-b from-cream to-saffron-50/40"
    >
      <div className="container-x">
        <div className="grid items-center gap-10 lg:grid-cols-5 lg:gap-16">
          {/* Portrait */}
          <div className="lg:col-span-2">
            <figure className="mx-auto max-w-xs">
              <div className="overflow-hidden rounded-2xl border border-saffron-100 bg-white p-2 shadow-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/thakur.jpg"
                  alt="Sree Sree Thakur Anukulchandra"
                  className="w-full rounded-xl"
                />
              </div>
              <figcaption className="mt-3 text-center text-sm font-semibold uppercase tracking-[0.15em] text-saffron-700">
                Sree Sree Thakur Anukulchandra
              </figcaption>
            </figure>
          </div>

          {/* Biography */}
          <div className="lg:col-span-3">
            <span className="eyebrow">The life we honour</span>
            <h2 className="mt-4 font-serif text-3xl font-bold text-maroon-900 sm:text-4xl">
              About Sree Sree Thakur Anukulchandra
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-ink/80">
              <p>
                Sree Sree Thakur Anukulchandra (1888&ndash;1969) was a revered
                spiritual teacher and the founder of the Satsang movement. Born
                on 14th September 1888 at Himaitpur, Pabna (in present-day
                Bangladesh), he devoted his life to awakening the divine
                potential within every person.
              </p>
              <p>
                A healer by training and a seer by nature, his teachings blend
                timeless spiritual wisdom with practical guidance for daily
                living &mdash; centred on his message of{" "}
                <strong className="text-maroon-800">
                  &ldquo;Be and Make&rdquo;
                </strong>
                : to grow in character oneself, and to help others grow. He
                inspired countless followers towards a life of love, selfless
                service (seva), self-reliance, and devotion to the ideal.
              </p>
              <p>
                Today, Satsang centres across the world &mdash; including here in
                the United Kingdom &mdash; carry forward his message of universal
                love, fellowship and human excellence. This congregation joyfully
                celebrates his life and the living relevance of his vision.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
