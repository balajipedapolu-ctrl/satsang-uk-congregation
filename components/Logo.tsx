"use client";

import { useState } from "react";

type Props = {
  /** Sizing classes for the badge, e.g. "h-10 w-10". */
  className?: string;
  /** "badge" = emblem inside a white circle; "plain" = bare image (watermarks). */
  variant?: "badge" | "plain";
  /** Extra classes for the <img> when variant="plain". */
  imgClassName?: string;
};

/**
 * Satsang emblem logo. Reads the image from public/logo.png.
 * Falls back to the ॐ glyph (badge) or nothing (plain) if the file is absent.
 */
export default function Logo({
  className = "h-10 w-10",
  variant = "badge",
  imgClassName,
}: Props) {
  const [failed, setFailed] = useState(false);

  if (variant === "plain") {
    if (failed) return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/logo.png"
        alt=""
        aria-hidden
        onError={() => setFailed(true)}
        className={imgClassName ?? className}
      />
    );
  }

  return (
    <span
      className={`flex items-center justify-center overflow-hidden rounded-full bg-white shadow-soft ${className}`}
    >
      {failed ? (
        <span className="font-serif text-lg font-bold text-saffron-700">ॐ</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logo.png"
          alt="Satsang emblem"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain p-[2px]"
        />
      )}
    </span>
  );
}
