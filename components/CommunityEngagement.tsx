import SectionHeading from "@/components/SectionHeading";
import { COMMUNITY_PARTNERS } from "@/lib/event";

/**
 * Local organisations collaborating with this year's congregation. Add new
 * entries to COMMUNITY_PARTNERS in lib/event.ts as further partnerships are
 * confirmed — no changes needed here.
 */
export default function CommunityEngagement() {
  if (COMMUNITY_PARTNERS.length === 0) return null;

  return (
    <section
      id="community"
      className="section bg-gradient-to-b from-cream to-emerald-50/40"
    >
      <div className="container-x">
        <SectionHeading
          eyebrow="Community Engagement"
          title="Collaborating with local organisations"
          subtitle="Alongside our congregation, we're proud to partner with community groups whose work reflects our shared values of service and care."
        />

        <div className="mx-auto mt-14 max-w-3xl space-y-6">
          {COMMUNITY_PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="card flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left"
            >
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                {partner.icon}
              </span>
              <div>
                <h3 className="font-serif text-xl font-bold text-maroon-900">
                  Collaboration with {partner.name}
                </h3>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.1em] text-emerald-700">
                  {partner.summary}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">
                  {partner.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
