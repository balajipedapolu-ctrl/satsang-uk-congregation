import Link from "next/link";
import { CONTACT, EVENT, NAV_LINKS } from "@/lib/event";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-maroon-900 text-cream/80">
      <div className="container-x grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-saffron-600 font-serif text-lg font-bold text-white">
              ॐ
            </span>
            <span className="font-serif text-xl font-bold text-cream">
              {EVENT.organisation}
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
            {EVENT.occasion}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-saffron-300">
            Explore
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition hover:text-cream"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/register" className="transition hover:text-cream">
                Register
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-saffron-300">
            Contact
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                className="transition hover:text-cream"
              >
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}
                className="transition hover:text-cream"
              >
                {CONTACT.phone}
              </a>
            </li>
            <li className="pt-2 text-cream/70">
              {EVENT.venue.name}
              <br />
              {EVENT.venue.address}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream/60 sm:flex-row">
          <p>
            © {year} {EVENT.organisation}. All rights reserved.
          </p>
          <p>Made with devotion for the {EVENT.edition} National Congregation.</p>
        </div>
      </div>
    </footer>
  );
}
