import Link from "next/link";
import { CONTACT, EVENT, NAV_LINKS } from "@/lib/event";
import Logo from "@/components/Logo";

const iconClass = "h-4 w-4 shrink-0 text-saffron-300";

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
    >
      {children}
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-maroon-900 text-cream/80">
      {/* subtle top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-saffron-400/50 to-transparent" />

      <div className="container-x grid gap-10 py-16 md:grid-cols-12">
        {/* Brand */}
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <Logo className="h-12 w-12" />
            <span className="font-serif text-xl font-bold leading-tight text-cream">
              {EVENT.organisation}
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">
            {EVENT.occasion}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cream/10 px-3 py-1.5 font-medium text-cream/90">
              <Icon>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </Icon>
              {EVENT.dateLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cream/10 px-3 py-1.5 font-medium text-cream/90">
              <Icon>
                <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11Z" />
                <circle cx="12" cy="10" r="2.5" />
              </Icon>
              {EVENT.venue.name}
            </span>
          </div>

          <Link
            href="/register"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-saffron-500 px-5 py-2.5 text-sm font-semibold text-maroon-950 shadow-sm transition hover:bg-saffron-400"
          >
            Register Now
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        {/* Explore */}
        <div className="md:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-300">
            Explore
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-cream/70 transition hover:text-cream"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/register"
                className="text-cream/70 transition hover:text-cream"
              >
                Register
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="md:col-span-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-300">
            Get in touch
          </h3>
          <ul className="mt-5 space-y-3.5 text-sm">
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-3 text-cream/70 transition hover:text-cream"
              >
                <Icon>
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </Icon>
                <span className="break-all">{CONTACT.email}</span>
              </a>
            </li>
            <li>
              <a
                href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-3 text-cream/70 transition hover:text-cream"
              >
                <Icon>
                  <path d="M4 5a1 1 0 0 1 1-1h3l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v3a1 1 0 0 1-1 1A16 16 0 0 1 4 5Z" />
                </Icon>
                {CONTACT.phone}
              </a>
            </li>
            <li>
              <a
                href={`tel:${CONTACT.phone2.replace(/\s+/g, "")}`}
                className="flex items-center gap-3 text-cream/70 transition hover:text-cream"
              >
                <Icon>
                  <path d="M4 5a1 1 0 0 1 1-1h3l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v3a1 1 0 0 1-1 1A16 16 0 0 1 4 5Z" />
                </Icon>
                {CONTACT.phone2}
              </a>
            </li>
            <li className="flex items-start gap-3 pt-1 text-cream/60">
              <Icon>
                <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11Z" />
                <circle cx="12" cy="10" r="2.5" />
              </Icon>
              <span>
                {EVENT.venue.name}
                <br />
                {EVENT.venue.address}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream/55 sm:flex-row">
          <p>
            © {year} {EVENT.organisation}. All rights reserved.
          </p>
          <p>Made with devotion for the {EVENT.edition} National Congregation.</p>
        </div>
      </div>
    </footer>
  );
}
