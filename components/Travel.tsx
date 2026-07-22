import SectionHeading from "@/components/SectionHeading";
import { EVENT } from "@/lib/event";

const options = [
  {
    title: "By Rail",
    icon: <path d="M4 15V5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Zm0-5h16M8 6h8M7.5 21 6 18m10.5 3L18 18M9 15h.01M15 15h.01" />,
    items: [
      "Cheam Station is the nearest — about a 10–15 minute walk to the venue.",
      "Sutton and Ewell East stations are also within easy reach by bus or taxi.",
      "Southern & Thameslink services connect from central London.",
    ],
  },
  {
    title: "By Air",
    icon: <path d="M10.5 2.5 12 2l1.5.5.5 6 6.5 3.8.5 1.7-7 .5-1 5 1.5 1v1.5L12 22l-3-2.5V18l1.5-1-1-5-7-.5.5-1.7L9.5 6l1-3.5Z" />,
    items: [
      "London Heathrow (LHR) — approx. 45–60 min by road.",
      "London Gatwick (LGW) — approx. 30–40 min by road.",
      "Both airports connect to Sutton/Cheam by rail and coach.",
    ],
  },
  {
    title: "By Bus & Road",
    icon: <path d="M4 16V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10M4 16h16M4 16v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2m10 0v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2M7 8h10M7 12h4" />,
    items: [
      "Local bus routes serve Cheam & Sutton from surrounding areas.",
      "Ample residential parking nearby — please park considerately.",
      "Taxis and ride-share drop-offs are available at the venue gate.",
    ],
  },
];

const hotels = [
  { name: "Premier Inn London Sutton", note: "~2 miles · budget-friendly" },
  { name: "Holiday Inn London – Sutton", note: "~2 miles · full service" },
  { name: "Travelodge Sutton", note: "~2 miles · budget" },
  { name: "Local guest houses & B&Bs", note: "Cheam & Ewell village" },
];

export default function Travel() {
  return (
    <section id="travel" className="section bg-gradient-to-b from-cream to-saffron-50/60">
      <div className="container-x">
        <SectionHeading
          eyebrow="Travel & Accommodation"
          title="Getting to the congregation"
          subtitle={`${EVENT.venue.name}, ${EVENT.venue.address}`}
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {options.map((opt) => (
            <div key={opt.title} className="card">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-saffron-100 text-saffron-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  {opt.icon}
                </svg>
              </span>
              <h3 className="mt-4 font-serif text-xl font-semibold text-maroon-900">
                {opt.title}
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink/75">
                {opt.items.map((it) => (
                  <li key={it} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron-400" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Recommended route */}
        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <div className="rounded-2xl bg-maroon-800 p-7 text-cream lg:col-span-3">
            <h3 className="font-serif text-xl font-semibold text-white">
              Recommended route from Central London
            </h3>
            <ol className="mt-5 space-y-4">
              {[
                "Take the Victoria, Northern, District or Circle Line to Victoria, Blackfriars, St Pancras International or London Bridge.",
                "Change to a Southern or Thameslink train to Cheam Station.",
                "Walk approximately 10–15 minutes to Nonsuch High School for Girls, Ewell Road, Cheam, Sutton, SM3 8AB.",
              ].map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-saffron-500 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-cream/90">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-sm italic text-cream/60">
              This route is recommended for guests travelling from central London
              because it combines direct National Rail services to Cheam with a
              straightforward walk to the venue.
            </p>
          </div>

          {/* Accommodation */}
          <div className="card lg:col-span-2">
            <h3 className="font-serif text-xl font-semibold text-maroon-900">
              Where to stay
            </h3>
            <p className="mt-2 text-sm text-ink/60">
              A few nearby options for guests travelling from afar:
            </p>
            <ul className="mt-4 space-y-3">
              {hotels.map((h) => (
                <li
                  key={h.name}
                  className="flex items-start justify-between gap-3 border-b border-saffron-100 pb-3 last:border-0"
                >
                  <span className="font-medium text-maroon-900">{h.name}</span>
                  <span className="shrink-0 text-xs text-ink/50">{h.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
