import SectionHeading from "@/components/SectionHeading";
import { EVENT } from "@/lib/event";

const mapsEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(
  EVENT.venue.mapsQuery,
)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  EVENT.venue.mapsQuery,
)}`;

const facts = [
  {
    label: "Date",
    value: EVENT.dateLabel,
    icon: (
      <path d="M8 2v3M16 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
    ),
  },
  {
    label: "Time",
    value: EVENT.timeLabel,
    icon: <path d="M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />,
  },
  {
    label: "Venue",
    value: `${EVENT.venue.name}, ${EVENT.venue.address}`,
    icon: (
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    ),
  },
  {
    label: "Dress code",
    value: EVENT.dressCode,
    icon: (
      <path d="M12 3l3 3 5 2-3 3v10H7V11L4 8l5-2 3-3Zm0 0v3" />
    ),
  },
];

export default function EventDetails() {
  return (
    <section id="event" className="section bg-gradient-to-b from-saffron-50/60 to-cream">
      <div className="container-x">
        <SectionHeading
          eyebrow="Event Details"
          title="Everything you need to plan your day"
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Fact cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {facts.map((fact) => (
              <div key={fact.label} className="card flex flex-col gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-saffron-100 text-saffron-700">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    {fact.icon}
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-saffron-700">
                    {fact.label}
                  </p>
                  <p className="mt-1 font-medium leading-snug text-maroon-900">
                    {fact.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="overflow-hidden rounded-2xl border border-saffron-100 shadow-card">
            <iframe
              title={`Map to ${EVENT.venue.name}`}
              src={mapsEmbed}
              className="h-72 w-full lg:h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl bg-maroon-800 px-6 py-5 text-cream sm:flex-row">
          <p className="text-center text-sm sm:text-left">
            <span className="font-semibold">Participation:</span> {EVENT.dressCode}{" "}
            All are welcome to take part in the prayers, symposium and cultural
            programme.
          </p>
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary shrink-0"
          >
            Get Directions
          </a>
        </div>
      </div>
    </section>
  );
}
