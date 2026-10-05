"use client";

import { useState } from "react";
import Link from "next/link";
import { EVENT, FEEDBACK_AREAS, SCHEDULE } from "@/lib/event";

type AreaKey = keyof typeof FEEDBACK_AREAS;

const ATTENDED_AS = ["Devotee", "Visitor", "Volunteer", "Guest"];
const NEXT_YEAR = ["Yes, definitely", "Maybe", "Not sure yet"];

const initialState = {
  overall: 0,
  attendedAs: "",
  areas: {} as Partial<Record<AreaKey, number>>,
  // Ratings per item of SCHEDULE, keyed by its index
  schedule: {} as Partial<Record<number, number>>,
  enjoyed: "",
  improve: "",
  suggestions: "",
  nextYear: "",
  name: "",
  email: "",
};

type FormState = typeof initialState;

function RatingButtons({
  value,
  onChange,
  label,
  size = "md",
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  size?: "sm" | "md";
}) {
  const dim = size === "md" ? "h-11 w-11 text-base" : "h-9 w-9 text-sm";
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= value;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} out of 5`}
            onClick={() => onChange(value === n ? 0 : n)}
            className={`${dim} rounded-full border font-semibold transition ${
              active
                ? "border-saffron-500 bg-saffron-500 text-white shadow-soft"
                : "border-saffron-200 bg-white text-maroon-800 hover:border-saffron-400"
            }`}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

function ChoiceChips({
  options,
  value,
  onChange,
  label,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = value === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(active ? "" : option)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              active
                ? "border-saffron-500 bg-saffron-500 text-white"
                : "border-saffron-200 bg-white text-ink/80 hover:border-saffron-400"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default function FeedbackForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function setArea(key: AreaKey, n: number) {
    setForm((f) => ({ ...f, areas: { ...f.areas, [key]: n || undefined } }));
  }

  function setSession(index: number, n: number) {
    setForm((f) => ({ ...f, schedule: { ...f.schedule, [index]: n || undefined } }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.overall) {
      setError("Please tap an overall rating first.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setDone(true);
    } catch {
      setError(
        `Something went wrong. Please try again, or email us at ${EVENT.organisation} directly.`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="card mx-auto max-w-xl text-center">
        <span className="text-5xl">🙏</span>
        <h2 className="mt-4 font-serif text-2xl font-bold text-maroon-900">
          Thank you for your feedback
        </h2>
        <p className="mt-2 text-ink/70">
          Your words help us make the next {EVENT.edition} National Congregation
          even more meaningful. Jai Thakur!
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card mx-auto max-w-2xl space-y-8">
      {/* Overall */}
      <div>
        <p className="field-label">
          How would you rate the congregation overall?{" "}
          <span className="text-maroon-500">*</span>
        </p>
        <RatingButtons
          label="Overall rating"
          value={form.overall}
          onChange={(overall) => setForm({ ...form, overall })}
        />
        <p className="mt-2 text-xs text-ink/50">
          1 = poor · 5 = excellent. Tap again to clear.
        </p>
      </div>

      <div>
        <p className="field-label">I attended as a</p>
        <ChoiceChips
          label="Attended as"
          options={ATTENDED_AS}
          value={form.attendedAs}
          onChange={(attendedAs) => setForm({ ...form, attendedAs })}
        />
      </div>

      {/* Per-area ratings */}
      <div>
        <div className="divide-y divide-saffron-100 rounded-2xl border border-saffron-100 bg-cream/60">
          {(Object.keys(FEEDBACK_AREAS) as AreaKey[]).map((key) => (
            <div
              key={key}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="font-medium text-maroon-900">
                {FEEDBACK_AREAS[key]}
              </span>
              <RatingButtons
                size="sm"
                label={FEEDBACK_AREAS[key]}
                value={form.areas[key] ?? 0}
                onChange={(n) => setArea(key, n)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Per-session ratings from the Schedule of the day */}
      <div>
        <p className="field-label">Rate each part of the day</p>
        <div className="divide-y divide-saffron-100 rounded-2xl border border-saffron-100 bg-cream/60">
          {SCHEDULE.map((item, i) => (
            <div
              key={`${item.start}-${item.title}`}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-sm font-medium text-maroon-900">
                <span className="font-mono text-xs text-saffron-700">
                  {item.start} – {item.end}
                </span>
                <span className="block">{item.title}</span>
              </span>
              <RatingButtons
                size="sm"
                label={item.title}
                value={form.schedule[i] ?? 0}
                onChange={(n) => setSession(i, n)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Open questions */}
      <div>
        <label htmlFor="enjoyed" className="field-label">
          What did you enjoy most?
        </label>
        <textarea
          id="enjoyed"
          rows={3}
          value={form.enjoyed}
          onChange={(e) => setForm({ ...form, enjoyed: e.target.value })}
          className="field-input"
          placeholder="The kirtan, the symposium, the prasad…"
        />
      </div>

      <div>
        <label htmlFor="improve" className="field-label">
          What could we do better?
        </label>
        <textarea
          id="improve"
          rows={3}
          value={form.improve}
          onChange={(e) => setForm({ ...form, improve: e.target.value })}
          className="field-input"
          placeholder="Anything that could have run more smoothly"
        />
      </div>

      <div>
        <label htmlFor="suggestions" className="field-label">
          Suggestions for next year
        </label>
        <textarea
          id="suggestions"
          rows={3}
          value={form.suggestions}
          onChange={(e) => setForm({ ...form, suggestions: e.target.value })}
          className="field-input"
          placeholder="Ideas, speakers, activities, or anything else"
        />
      </div>

      <div>
        <p className="field-label">Would you join us again next year?</p>
        <ChoiceChips
          label="Join us next year"
          options={NEXT_YEAR}
          value={form.nextYear}
          onChange={(nextYear) => setForm({ ...form, nextYear })}
        />
      </div>

      {/* Optional contact */}
      <div className="rounded-2xl border border-saffron-100 bg-cream/60 p-5">
        <p className="font-medium text-maroon-900">
          Would you like us to reply? <span className="font-normal text-ink/60">(optional)</span>
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fb-name" className="field-label">
              Name
            </label>
            <input
              id="fb-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="field-input"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="fb-email" className="field-label">
              Email
            </label>
            <input
              id="fb-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="field-input"
              placeholder="you@example.com"
            />
          </div>
        </div>
      </div>

      {error ? (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full text-base disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send feedback"}
      </button>

      <p className="text-center text-xs text-ink/50">
        Your feedback is shared only with the {EVENT.organisation} organising team.
      </p>
    </form>
  );
}
