# Satsang UK — 19th National Congregation Website

A modern, mobile-first website for the **19th Satsang National Congregation**,
celebrating the **139th Birth Anniversary of Sree Sree Thakur Anukulchandra**.

Built with **Next.js 15 (App Router)**, **React 19**, **TypeScript** and
**Tailwind CSS**.

---

## ✨ Features

- **Landing page** with hero, welcome message and clear call-to-action buttons
- **Live countdown** to the event date
- **About** — history, theme and a guiding quote
- **Event details** with an embedded Google Map and full schedule timeline
- **Registration page** — name, contact, location, attendees + seva/volunteering,
  producing a **reference number and QR code** on completion
- **Travel & accommodation** — air / rail / road, recommended route, hotels
- **Gallery** placeholders (ready for real photos & videos)
- **Contact** — email, phone, WhatsApp and an enquiry form
- **Donation** call-to-action
- Fully **responsive** and easy to share in WhatsApp groups

---

## 🚀 Quick start (run it locally)

> **Prerequisite:** Node.js 18.18+ (Node 20 or 24 LTS recommended).
> Check with `node -v`. If Node isn't installed, get it from
> <https://nodejs.org> (choose the LTS installer for macOS/Windows).

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
# → open http://localhost:3000

# 3. Build for production (optional, to verify)
npm run build
npm start
```

---

## 🗂 Project structure

```
app/
  layout.tsx          # Root layout, fonts, <Navbar/> + <Footer/>
  page.tsx            # Landing page (composes all sections)
  globals.css         # Tailwind + design tokens
  icon.svg            # Favicon
  register/page.tsx   # Registration page
  api/
    register/route.ts # Registration endpoint (returns reference number)
    contact/route.ts  # Contact endpoint
components/           # Navbar, Hero, Countdown, About, EventDetails,
                      # Schedule, Travel, Gallery, DonationCTA, Contact,
                      # RegistrationForm, ContactForm, Footer, SectionHeading
lib/
  event.ts            # ⭐ ALL editable content lives here
```

---

## ✏️ Editing content

**Almost everything you'll want to change is in [`lib/event.ts`](lib/event.ts):**

| What | Where |
| --- | --- |
| Date, time, venue, dress code | `EVENT` |
| Countdown target | `EVENT.startsAtISO` |
| Email / phone / WhatsApp link | `CONTACT` |
| Donation link | `DONATION_URL` |
| Full schedule | `SCHEDULE` |
| Seva/volunteering options | `SEVA_OPTIONS` |

### Adding gallery photos & videos

1. Put images in `public/gallery/` (e.g. `1.jpg`, `2.jpg`).
2. In `components/Gallery.tsx`, replace the placeholder tiles with
   `<img src="/gallery/1.jpg" alt="…" className="h-full w-full object-cover" />`.
3. For videos, swap a placeholder for a YouTube/Vimeo `<iframe>`.

---

## 📧 Enabling confirmation emails (optional)

Registration currently returns a **reference number + QR code** instantly (no
email is sent). To send a real confirmation email:

1. Create a free account at [Resend](https://resend.com) and get an API key.
2. `npm install resend`
3. In **Vercel → Project → Settings → Environment Variables**, add
   `RESEND_API_KEY`.
4. Uncomment the Resend block in
   [`app/api/register/route.ts`](app/api/register/route.ts).

The same approach works for the contact form in `app/api/contact/route.ts`.

---

## ☁️ Deploying to GitHub + Vercel

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for a full step-by-step guide.

Short version:

```bash
# 1. Create a repo on github.com, then:
git init
git add .
git commit -m "Initial commit: Satsang UK 19th National Congregation site"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then go to [vercel.com](https://vercel.com) → **Add New… → Project** →
**Import** your GitHub repo → **Deploy**. Vercel auto-detects Next.js — no
configuration required. Every future `git push` redeploys automatically.

---

## 📝 Notes

- The guiding quote in `components/About.tsx` and the suggested hotels in
  `components/Travel.tsx` are placeholders — please confirm/replace before
  publishing.
- Contact details in `lib/event.ts` (email, phone, WhatsApp) are placeholders.
```
