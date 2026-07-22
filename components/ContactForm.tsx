"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError("Something went wrong. Please email us directly.");
    }
  }

  if (status === "success") {
    return (
      <div className="card flex flex-col items-center gap-3 text-center">
        <span className="text-4xl">🙏</span>
        <h3 className="font-serif text-xl font-semibold text-maroon-900">
          Thank you for reaching out!
        </h3>
        <p className="text-sm text-ink/70">
          We&rsquo;ve received your message and will get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-secondary mt-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div>
        <label htmlFor="c-name" className="field-label">
          Your name
        </label>
        <input
          id="c-name"
          name="name"
          required
          className="field-input"
          placeholder="Full name"
        />
      </div>
      <div>
        <label htmlFor="c-email" className="field-label">
          Email
        </label>
        <input
          id="c-email"
          name="email"
          type="email"
          required
          className="field-input"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="c-message" className="field-label">
          Message
        </label>
        <textarea
          id="c-message"
          name="message"
          required
          rows={4}
          className="field-input resize-none"
          placeholder="How can we help?"
        />
      </div>

      {status === "error" ? (
        <p className="text-sm font-medium text-maroon-600">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
