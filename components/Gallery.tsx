"use client";

import { useCallback, useEffect, useState } from "react";
import SectionHeading from "@/components/SectionHeading";

type Photo = { src: string; caption: string };

const PHOTOS: Photo[] = [
  { src: "/gallery/national-congregation-full-hall.jpg", caption: "National Congregation" },
  { src: "/gallery/classical-dance-congregation.jpg", caption: "Classical Dance" },
  { src: "/gallery/kirtan-nehru-centre-stage.jpg", caption: "Kirtan on Stage" },
  { src: "/gallery/community-meal-church-hall.jpg", caption: "Community Prasad" },
  { src: "/gallery/congregation-seated.jpg", caption: "Morning Congregation" },
  { src: "/gallery/dance-performance-pimlico.jpg", caption: "Cultural Programme" },
  { src: "/gallery/soup-kitchen-volunteers.jpg", caption: "Seva — Volunteers" },
  { src: "/gallery/kirtan-tabla-congregation.jpg", caption: "Kirtan & Tabla" },
  { src: "/gallery/group-portrait-oxford-conference.jpg", caption: "Group Portrait" },
  { src: "/gallery/congregation-cymbals-floor.jpg", caption: "Congregation Kirtan" },
  { src: "/gallery/meal-service-queue-hall.jpg", caption: "Prasad Service" },
  { src: "/gallery/audience-seated-conference.jpg", caption: "Symposium Audience" },
  { src: "/gallery/volunteers-serving-counter-event.jpg", caption: "Seva — Serving" },
  { src: "/gallery/congregation-women-seated-hall.jpg", caption: "Matrisammelani" },
  { src: "/gallery/shared-meal-village-hall.jpg", caption: "Shared Prasad" },
  { src: "/gallery/group-outdoors.jpg", caption: "Fellowship" },
];

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? null : (i + PHOTOS.length - 1) % PHOTOS.length)),
    [],
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? null : (i + 1) % PHOTOS.length)),
    [],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, prev, next]);

  return (
    <section id="gallery" className="section bg-cream">
      <div className="container-x">
        <SectionHeading
          eyebrow="Gallery & Memories"
          title="Moments from past congregations"
          subtitle="Glimpses of devotion, music, culture, seva and togetherness from our previous gatherings."
        />

        {/* Masonry via CSS columns — handles mixed portrait/landscape nicely */}
        <div className="mt-14 columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
          {PHOTOS.map((p, i) => (
            <figure
              key={p.src}
              onClick={() => setIndex(i)}
              className="group relative mb-3 block cursor-pointer break-inside-avoid overflow-hidden rounded-2xl shadow-card sm:mb-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.caption}
                loading="lazy"
                className="w-full transition duration-500 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3 pt-8 text-sm font-medium text-white opacity-0 transition duration-300 group-hover:opacity-100">
                {p.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-ink/50">
          Have photos or videos to share?{" "}
          <a href="/#contact" className="font-semibold text-saffron-700 underline">
            Get in touch
          </a>{" "}
          and we&rsquo;ll add them to the gallery.
        </p>
      </div>

      {/* Lightbox */}
      {index !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8"
          onClick={close}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
          >
            ✕
          </button>
          <button
            type="button"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-3xl text-white transition hover:bg-white/20 sm:left-6"
          >
            ‹
          </button>
          <figure className="flex max-h-full flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PHOTOS[index].src}
              alt={PHOTOS[index].caption}
              className="max-h-[82vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            />
            <figcaption className="text-sm font-medium text-white/80">
              {PHOTOS[index].caption} · {index + 1} / {PHOTOS.length}
            </figcaption>
          </figure>
          <button
            type="button"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-3xl text-white transition hover:bg-white/20 sm:right-6"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
