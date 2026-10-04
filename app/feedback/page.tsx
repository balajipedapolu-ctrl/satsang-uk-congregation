import type { Metadata } from "next";
import Link from "next/link";
import FeedbackForm from "@/components/FeedbackForm";
import { EVENT } from "@/lib/event";

export const metadata: Metadata = {
  title: "Feedback",
  description: `Share your feedback on the ${EVENT.title} held on ${EVENT.dateLabel} at ${EVENT.venue.name}.`,
};

const STRIP = [
  { src: "/gallery/facebook-congregation-singing.jpg", alt: "Congregation singing together" },
  { src: "/gallery/facebook-beatificus-band.jpg", alt: "BEATIFICUS band performing" },
  { src: "/gallery/facebook-altar-darshan.jpg", alt: "Altar with garlands and flowers" },
];

export default function FeedbackPage() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-saffron-50 to-cream pt-[var(--header-height)]">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="container-x relative py-16 sm:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <Link
            href="/"
            className="text-sm font-medium text-saffron-700 hover:underline"
          >
            ← Back to home
          </Link>
          <span className="eyebrow mt-4">Feedback</span>
          <h1 className="mt-4 font-serif text-4xl font-bold text-maroon-900 sm:text-5xl">
            How was your utsav?
          </h1>
          <p className="mt-4 text-ink/70">
            Thank you for being part of the {EVENT.edition} National Congregation
            on{" "}
            <span className="font-semibold text-maroon-800">
              {EVENT.dateLabel}
            </span>
            . It takes about two minutes, and every answer helps us plan the
            next congregation.
          </p>
        </div>

        <div className="mx-auto mb-12 grid max-w-3xl grid-cols-3 gap-3 sm:gap-4">
          {STRIP.map((photo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="aspect-square w-full rounded-2xl object-cover shadow-card"
            />
          ))}
        </div>

        <FeedbackForm />
      </div>
    </section>
  );
}
