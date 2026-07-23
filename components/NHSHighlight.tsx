import NHSCampaignCard from "@/components/NHSCampaignCard";

/**
 * Prominent home-page highlight for the NHS "What's Your Blood Type?" campaign,
 * placed right after the hero. Reuses NHSCampaignCard (read-more + zoom).
 */
export default function NHSHighlight() {
  return (
    <section
      id="nhs"
      className="relative overflow-hidden bg-gradient-to-b from-cream to-saffron-50/40 py-14 sm:py-20"
    >
      <div className="container-x">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <span className="inline-block rounded-full bg-red-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
            New this year · with the NHS
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-maroon-900 sm:text-4xl">
            A life-saving initiative you can be part of
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink/70">
            We are proud to partner with the NHS at this year&rsquo;s
            congregation. Please take a moment to learn about their campaign.
          </p>
        </div>

        <NHSCampaignCard />
      </div>
    </section>
  );
}
