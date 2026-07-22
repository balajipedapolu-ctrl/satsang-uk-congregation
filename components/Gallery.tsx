import SectionHeading from "@/components/SectionHeading";
import Logo from "@/components/Logo";

/**
 * Placeholder gallery. To use real media:
 *   1. Drop images into /public/gallery (e.g. 1.jpg, 2.jpg ...).
 *   2. Replace the `tiles` below with <img src="/gallery/1.jpg" ... /> or
 *      next/image, and swap the video placeholders for YouTube/Vimeo <iframe>s.
 */

const tiles = [
  { span: "sm:col-span-2 sm:row-span-2", gradient: "from-saffron-300 to-maroon-500", label: "Morning Congregation" },
  { span: "", gradient: "from-saffron-200 to-saffron-500", label: "Prayer & Prasad" },
  { span: "", gradient: "from-maroon-300 to-maroon-600", label: "Cultural Programme" },
  { span: "", gradient: "from-saffron-400 to-maroon-500", label: "Seva in Action" },
  { span: "", gradient: "from-maroon-200 to-saffron-500", label: "Fellowship" },
];

export default function Gallery() {
  return (
    <section id="gallery" className="section bg-cream">
      <div className="container-x">
        <SectionHeading
          eyebrow="Gallery & Memories"
          title="Moments from past congregations"
          subtitle="Glimpses of devotion, culture and togetherness from our previous gatherings."
        />

        <div className="mt-14 grid auto-rows-[150px] grid-cols-2 gap-4 sm:auto-rows-[180px] lg:grid-cols-4">
          {tiles.map((tile, i) => (
            <figure
              key={i}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${tile.gradient} ${tile.span} shadow-card`}
            >
              <div className="dot-grid absolute inset-0 opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center transition group-hover:scale-110">
                <Logo
                  variant="plain"
                  imgClassName="h-24 w-24 opacity-25 brightness-0 invert"
                />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                <span className="text-sm font-semibold text-white">
                  {tile.label}
                </span>
              </figcaption>
            </figure>
          ))}

          {/* Video placeholders */}
          {["Congregation Highlights", "Cultural Evening"].map((label) => (
            <figure
              key={label}
              className="group relative flex items-center justify-center overflow-hidden rounded-2xl border border-saffron-200 bg-maroon-900 shadow-card"
            >
              <div className="dot-grid absolute inset-0 opacity-10" />
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-maroon-800 shadow-soft transition group-hover:scale-110">
                <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-6 w-6">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <figcaption className="absolute inset-x-0 bottom-0 p-4 text-sm font-semibold text-white">
                {label}
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-ink/50">
          Have photos or videos to share?{" "}
          <a href="/#contact" className="font-semibold text-saffron-700 underline">
            Get in touch
          </a>{" "}
          and we&rsquo;ll add them to the gallery.
        </p>
      </div>
    </section>
  );
}
