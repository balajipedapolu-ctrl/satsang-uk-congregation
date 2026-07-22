import SectionHeading from "@/components/SectionHeading";
import { EVENT } from "@/lib/event";

export default function About() {
  return (
    <section id="about" className="section bg-cream">
      <div className="container-x">
        <SectionHeading
          eyebrow="About the Congregation"
          title="A cherished annual gathering of devotion & fellowship"
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-5 text-ink/80">
            <h3 className="font-serif text-2xl font-semibold text-maroon-800">
              Our journey
            </h3>
            <p className="leading-relaxed">
              For nearly two decades, {EVENT.organisation} has come together each
              year to celebrate the life and message of Sree Sree Thakur
              Anukulchandra. What began as a small circle of devotees has grown
              into a national congregation that welcomes families, friends, and
              seekers from every corner of the United Kingdom.
            </p>
            <p className="leading-relaxed">
              Each congregation is a day of prayer, music, learning, seva
              (selfless service) and shared prasad — a living expression of the
              ideal of <em>&ldquo;Be and Make&rdquo;</em>: to grow in character
              ourselves and to help others grow.
            </p>

            <h3 className="pt-4 font-serif text-2xl font-semibold text-maroon-800">
              Theme of the {EVENT.edition} Congregation
            </h3>
            <p className="leading-relaxed">
              This year we reflect on{" "}
              <strong className="text-maroon-800">
                &ldquo;Being and Becoming&rdquo;
              </strong>{" "}
              — Sree Sree Thakur Anukulchandra&rsquo;s philosophy of human
              excellence and sustainable living. Through congregation, symposium,
              and cultural programme, we explore how timeless spiritual principles
              can guide a purposeful, balanced and service-minded life today.
            </p>
          </div>

          {/* Guiding quote */}
          <div className="relative">
            <figure className="card h-full bg-gradient-to-br from-white to-saffron-50">
              <div className="font-serif text-6xl leading-none text-saffron-300">
                &ldquo;
              </div>
              {/* TODO: Confirm the exact wording/attribution before publishing. */}
              <blockquote className="-mt-4 font-serif text-2xl font-medium leading-relaxed text-maroon-900">
                Love ye one another. Be and make — grow yourself, and help
                everyone around you to grow.
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="h-px w-10 bg-saffron-400" />
                <span className="text-sm font-semibold uppercase tracking-[0.15em] text-saffron-700">
                  Sree Sree Thakur Anukulchandra
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
