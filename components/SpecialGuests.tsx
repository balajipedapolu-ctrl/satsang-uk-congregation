import SectionHeading from "@/components/SectionHeading";
import { GUESTS } from "@/lib/event";

/**
 * This year's confirmed special guests (chief guest, symposium speakers…).
 * Add new entries to GUESTS in lib/event.ts as further confirmations arrive
 * — no changes needed here.
 */
export default function SpecialGuests() {
  if (GUESTS.length === 0) return null;

  return (
    <section id="guests" className="section bg-cream">
      <div className="container-x">
        <SectionHeading
          eyebrow="This Year's Congregation"
          title="Distinguished Guests"
          subtitle="We are honoured to welcome the following guests to join us this year. More names will be added here as further confirmations come in."
        />

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-2">
          {GUESTS.map((guest) => (
            <div
              key={guest.name}
              className="card flex flex-col items-center text-center"
            >
              <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-saffron-100 bg-saffron-50 shadow-soft">
                {guest.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={guest.photo}
                    alt={guest.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center font-serif text-3xl font-bold text-saffron-600">
                    {guest.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                )}
              </div>

              <span className="mt-4 inline-block rounded-full bg-saffron-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-saffron-700">
                {guest.badge}
              </span>
              <h3 className="mt-3 font-serif text-xl font-bold text-maroon-900">
                {guest.name}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/70">
                {guest.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
