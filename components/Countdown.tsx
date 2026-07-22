"use client";

import { useEffect, useState } from "react";
import { EVENT } from "@/lib/event";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(target: number): TimeLeft {
  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

const UNITS: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

export default function Countdown({ dark = false }: { dark?: boolean }) {
  const target = new Date(EVENT.startsAtISO).getTime();
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);
    setTime(getTimeLeft(target));
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const finished =
    mounted &&
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0;

  if (finished) {
    return (
      <p
        className={`text-lg font-semibold ${
          dark ? "text-cream" : "text-maroon-800"
        }`}
      >
        🙏 The congregation has begun. Welcome!
      </p>
    );
  }

  return (
    <div className="flex items-stretch gap-3 sm:gap-4">
      {UNITS.map((unit) => (
        <div
          key={unit.key}
          className={`flex min-w-[64px] flex-col items-center rounded-2xl px-3 py-3 sm:min-w-[84px] sm:py-4 ${
            dark
              ? "bg-white/10 text-cream backdrop-blur"
              : "bg-white text-maroon-900 shadow-card"
          }`}
        >
          <span className="font-serif text-2xl font-bold tabular-nums sm:text-4xl">
            {mounted ? String(time[unit.key]).padStart(2, "0") : "--"}
          </span>
          <span
            className={`mt-1 text-[10px] font-semibold uppercase tracking-widest sm:text-xs ${
              dark ? "text-cream/70" : "text-saffron-700"
            }`}
          >
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
