"use client";

import { useEffect, useState } from "react";

/**
 * NHS "What's Your Blood Type?" (WYBT) campaign card, shown at the top of the
 * registration page. Includes a Read-more toggle and a click-to-zoom lightbox.
 */
export default function NHSCampaignCard() {
  const [showMore, setShowMore] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoomOpen]);

  return (
    <>
      <div className="mx-auto mb-10 max-w-xl rounded-2xl border-2 border-red-200 bg-red-50 p-5 text-left shadow-card sm:p-6">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            aria-label="View the NHS poster full size"
            className="group mx-auto block w-56 shrink-0 cursor-zoom-in sm:mx-0 sm:w-48"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/nhs-blood-donation.jpg"
              alt="NHS — What's Your Blood Type? campaign at the Satsang UK event"
              className="w-full rounded-xl bg-white p-1 shadow-soft transition group-hover:opacity-90"
            />
            <span className="mt-1 block text-center text-xs font-semibold text-red-700">
              🔍 Click to zoom
            </span>
          </button>
          <div className="text-sm leading-relaxed text-ink/75">
            <h3 className="font-serif text-lg font-semibold text-red-700">
              🩸 What&rsquo;s Your Blood Type? — the NHS at our event
            </h3>
            <p className="mt-2">
              We are delighted to announce that the NHS has kindly agreed to run
              its &ldquo;What&rsquo;s Your Blood Type?&rdquo; (WYBT) campaign
              during our event on 26th September.
            </p>

            {showMore ? (
              <>
                <p className="mt-2">
                  As part of this initiative, NHS volunteers will be available to
                  engage with attendees, provide information about blood
                  donation, and offer those who are interested the opportunity to
                  register as potential blood donors. This collaboration reflects
                  our shared commitment to promoting community wellbeing, public
                  health, and the spirit of selfless service.
                </p>
                <p className="mt-2">
                  We warmly encourage all attendees of our event to visit the NHS
                  team, learn more about the importance of blood donation, and
                  consider becoming part of this life-saving initiative.
                </p>
              </>
            ) : null}

            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              className="mt-2 font-semibold text-red-700 underline"
            >
              {showMore ? "Show less" : "Read more"}
            </button>

            <div className="mt-3">
              <a
                href="https://www.blood.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-red-700 underline"
              >
                Learn more at blood.co.uk →
              </a>
            </div>
          </div>
        </div>
      </div>

      {zoomOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setZoomOpen(false)}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/nhs-blood-donation.jpg"
            alt="NHS — What's Your Blood Type? campaign"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[95vw] rounded-lg object-contain shadow-2xl"
          />
        </div>
      ) : null}
    </>
  );
}
