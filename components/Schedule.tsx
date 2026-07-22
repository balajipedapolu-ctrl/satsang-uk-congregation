import SectionHeading from "@/components/SectionHeading";
import { SCHEDULE } from "@/lib/event";

export default function Schedule() {
  return (
    <section id="schedule" className="section bg-cream">
      <div className="container-x">
        <SectionHeading
          eyebrow="Programme"
          title="Schedule of the day"
          subtitle="A full day of prayer, reflection, learning, culture and shared prasad — from the early morning Ghoshana to the evening congregation and dinner."
        />

        <div className="mx-auto mt-14 max-w-3xl">
          <ol className="relative border-l-2 border-saffron-200">
            {SCHEDULE.map((item, i) => (
              <li key={i} className="mb-8 ml-6 last:mb-0">
                <span className="absolute -left-[9px] mt-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-saffron-500 bg-cream">
                  <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
                </span>
                <div className="rounded-2xl border border-saffron-100 bg-white p-5 shadow-card transition hover:border-saffron-300 hover:shadow-soft">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                    <span className="inline-flex shrink-0 items-center rounded-full bg-saffron-100 px-3 py-1 font-mono text-sm font-semibold text-saffron-800">
                      {item.start} – {item.end}
                    </span>
                    <div>
                      <h3 className="font-serif text-lg font-semibold leading-snug text-maroon-900">
                        {item.title}
                      </h3>
                      {item.note ? (
                        <p className="mt-0.5 text-sm italic text-ink/60">
                          {item.note}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-ink/50">
          Timings are indicative and may be adjusted slightly on the day.
        </p>
      </div>
    </section>
  );
}
