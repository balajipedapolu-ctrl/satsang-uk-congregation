type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: Props) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl text-left"
      }
    >
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="mt-4 font-serif text-3xl font-bold text-maroon-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-base leading-relaxed text-ink/70">{subtitle}</p>
      ) : null}
      <div
        className={`mt-6 h-1 w-16 rounded-full bg-saffron-500 ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}
