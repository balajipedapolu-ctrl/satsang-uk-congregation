import Link from "next/link";
import { EVENT } from "@/lib/event";

export default function FeedbackCTA() {
  return (
    <section className="relative overflow-hidden bg-saffron-50 py-16">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="container-x relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <span className="text-5xl">💬</span>
          <h2 className="font-serif text-3xl font-bold text-maroon-900 sm:text-4xl">
            Share your feedback
          </h2>
          <p className="max-w-xl leading-relaxed text-ink/75">
            Thank you for joining the {EVENT.edition} National Congregation. Tell
            us what you loved, what we could do better, and what you would like to
            see next year. It takes about two minutes.
          </p>
          <Link href="/feedback" className="btn-primary text-base">
            Give feedback
          </Link>
        </div>
      </div>
    </section>
  );
}
