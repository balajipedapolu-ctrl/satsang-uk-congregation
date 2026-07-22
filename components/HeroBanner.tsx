"use client";

import { useEffect, useState } from "react";

/**
 * Header banner showing the revered figures.
 *
 * Place the image at: public/founders.jpg
 * (Sree Sree Borda, Sree Sree Thakur, Sree Sree Baroma, Sree Sree Acharyadev)
 *
 * We probe the image on mount and only render the banner if it loads, so a
 * missing file shows nothing (never a broken image).
 */
export default function HeroBanner() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setReady(true);
    img.onerror = () => setReady(false);
    img.src = "/founders.jpg";
  }, []);

  if (!ready) return null;

  return (
    <figure className="mx-auto mb-10 max-w-4xl animate-fade-up">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/founders.jpg"
        alt="Sree Sree Borda, Sree Sree Thakur Anukulchandra, Sree Sree Baroma and Sree Sree Acharyadev"
        className="w-full rounded-2xl border border-saffron-100 shadow-soft"
      />
    </figure>
  );
}
