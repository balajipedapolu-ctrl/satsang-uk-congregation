import SectionHeading from "@/components/SectionHeading";
import { CONTACT, PUBLICATIONS } from "@/lib/event";

export default function Publications() {
  return (
    <section className="section bg-cream">
      <div className="container-x">
        <SectionHeading
          eyebrow="Publications"
          title="SUK Publications"
          subtitle="Books and reading material to help you learn more about Sree Sree Thakur Anukulchandra's life and philosophy."
        />

        <div className="mt-14 space-y-10">
          {PUBLICATIONS.map((pub) => (
            <div
              key={pub.title}
              className="card grid gap-8 sm:p-8 lg:grid-cols-5 lg:gap-12"
            >
              {/* Cover */}
              <div className="lg:col-span-2">
                <div className="mx-auto flex aspect-[2/3] max-w-[220px] flex-col justify-between rounded-xl border border-saffron-100 bg-gradient-to-b from-maroon-800 to-maroon-900 p-5 text-center text-cream shadow-soft">
                  <p className="font-serif text-lg font-bold uppercase leading-snug tracking-wide">
                    {pub.title}
                  </p>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-saffron-300/70">
                    <span className="font-serif text-2xl text-saffron-300">
                      ॐ
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-cream/70">{pub.author}</p>
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-saffron-300">
                      Satsang UK
                    </p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="lg:col-span-3">
                <h3 className="font-serif text-2xl font-semibold text-maroon-800">
                  {pub.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-saffron-700">
                  By {pub.author} &middot; Compiled by {pub.compiler}
                </p>

                <div className="mt-5 space-y-4 leading-relaxed text-ink/80">
                  {pub.description.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                <p className="mt-5 leading-relaxed text-ink/80">
                  If you are interested in collecting a copy of this book,
                  please contact us at{" "}
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="font-semibold text-saffron-700 underline"
                  >
                    {CONTACT.email}
                  </a>
                  .
                </p>

                <p className="mt-3 text-sm text-ink/60">{pub.availability}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
