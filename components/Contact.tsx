import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import { CONTACT } from "@/lib/event";

const channels = [
  {
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    icon: <path d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm0 1 8 6 8-6" />,
  },
  {
    label: "Phone",
    value: CONTACT.phone,
    href: `tel:${CONTACT.phone.replace(/\s+/g, "")}`,
    icon: <path d="M4 5a1 1 0 0 1 1-1h3l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v3a1 1 0 0 1-1 1A16 16 0 0 1 4 5Z" />,
  },
  {
    label: "Phone",
    value: CONTACT.phone2,
    href: `tel:${CONTACT.phone2.replace(/\s+/g, "")}`,
    icon: <path d="M4 5a1 1 0 0 1 1-1h3l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v3a1 1 0 0 1-1 1A16 16 0 0 1 4 5Z" />,
  },
  {
    label: "WhatsApp Group",
    value: "Join our community group",
    href: CONTACT.whatsapp,
    external: true,
    icon: <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Zm-3 5c.2 0 .5 0 .7.5l.7 1.6c.1.3 0 .5-.1.7l-.5.6c-.2.2-.2.4-.1.6a6 6 0 0 0 2.9 2.6c.3.1.5.1.7-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.4.4.6 0 1-1 1.8-1.8 1.9-.7 0-1.6.3-4.2-1.4A8 8 0 0 1 7.5 11C6.8 9.7 7 8.8 7.6 8.3 7.9 8 8.5 8 9 8Z" />,
  },
];

export default function Contact() {
  return (
    <section id="contact" className="section bg-gradient-to-b from-saffron-50/60 to-cream">
      <div className="container-x">
        <SectionHeading
          eyebrow="Contact Us"
          title="We would love to hear from you"
          subtitle="Have a question about the congregation, registration or seva? Reach out through any of the channels below."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            {channels.map((c) => (
              <a
                key={c.value}
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noopener noreferrer" : undefined}
                className="card flex items-center gap-4 transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-saffron-100 text-saffron-700">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    {c.icon}
                  </svg>
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-saffron-700">
                    {c.label}
                  </span>
                  <span className="mt-0.5 block font-medium text-maroon-900">
                    {c.value}
                  </span>
                </span>
              </a>
            ))}
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
