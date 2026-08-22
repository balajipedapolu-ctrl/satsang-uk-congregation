import type { Metadata } from "next";
import Link from "next/link";
import Publications from "@/components/Publications";
import { EVENT } from "@/lib/event";

export const metadata: Metadata = {
  title: "Publications",
  description: `Books and reading material from ${EVENT.organisation} on the life and philosophy of Sree Sree Thakur Anukulchandra.`,
};

export default function PublicationsPage() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-saffron-50 to-cream pt-[var(--header-height)]">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="container-x relative pt-10">
        <Link
          href="/"
          className="text-sm font-medium text-saffron-700 hover:underline"
        >
          ← Back to home
        </Link>
      </div>
      <Publications />
    </section>
  );
}
