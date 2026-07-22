"use client";

import { useState } from "react";

/**
 * Header banner showing the revered figures.
 *
 * Place the image at: public/founders.jpg
 * (Sree Sree Borda, Sree Sree Thakur, Sree Sree Baroma, Sree Sree Acharyadev)
 *
 * Until that file exists the banner hides itself, so the page never shows a
 * broken image.
 */
export default function HeroBanner() {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <figure className="mx-auto mb-10 max-w-4xl animate-fade-up">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/founders.jpg"
        alt="Sree Sree Borda, Sree Sree Thakur Anukulchandra, Sree Sree Baroma and Sree Sree Acharyadev"
        onError={() => setFailed(true)}
        className="w-full rounded-2xl border border-saffron-100 shadow-soft"
      />
    </figure>
  );
}
