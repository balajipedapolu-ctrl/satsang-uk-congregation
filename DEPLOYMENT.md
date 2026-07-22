# Deployment Guide — GitHub + Vercel

This guide takes the site from your computer to a live URL on the internet,
step by step. No prior DevOps experience needed. Total time: ~15 minutes.

There are two parts:

1. **GitHub** — stores your code online.
2. **Vercel** — builds and hosts the site, and redeploys it automatically every
   time you push a change to GitHub.

---

## Part 0 — One-time prerequisites

- **Node.js 18.18+** installed — <https://nodejs.org> (LTS installer).
  Verify: `node -v`
- **Git** installed — <https://git-scm.com/downloads>.
  Verify: `git --version`
- A **GitHub account** — <https://github.com/signup>
- A **Vercel account** — <https://vercel.com/signup> (sign up *with GitHub* —
  it makes importing one-click).

Test the build locally first so you know it's healthy:

```bash
npm install
npm run build      # should end with "✓ Compiled successfully"
```

---

## Part 1 — Push the code to GitHub

### 1.1 Create an empty repository on GitHub

1. Go to <https://github.com/new>.
2. **Repository name:** e.g. `satsang-uk-congregation`.
3. Choose **Private** or **Public** (either works with Vercel).
4. **Do NOT** tick "Add a README", ".gitignore" or "license" — the project
   already has these. Leave the repo empty.
5. Click **Create repository**. Copy the HTTPS URL shown, e.g.
   `https://github.com/yourname/satsang-uk-congregation.git`.

### 1.2 Push from your machine

Run these in the project folder (`TESTING STATEMENT`):

```bash
git init
git add .
git commit -m "Initial commit: Satsang UK 19th National Congregation site"
git branch -M main
git remote add origin https://github.com/yourname/satsang-uk-congregation.git
git push -u origin main
```

> **Authentication:** when Git asks for a password, GitHub no longer accepts
> your account password. Use a **Personal Access Token** instead:
> GitHub → *Settings → Developer settings → Personal access tokens →
> Tokens (classic) → Generate new token*, tick **repo**, copy the token and
> paste it as the password. (Or install [GitHub CLI](https://cli.github.com)
> and run `gh auth login`.)

Refresh your GitHub repo page — all the files should now be there.

---

## Part 2 — Deploy on Vercel

### 2.1 Import the project

1. Go to <https://vercel.com/new>.
2. If you signed up with GitHub, your repos appear automatically. Otherwise
   click **Install / Configure GitHub** and grant access to the repo.
3. Find `satsang-uk-congregation` and click **Import**.

### 2.2 Configure (nothing to change!)

Vercel auto-detects Next.js and fills everything in:

| Setting | Value (auto) |
| --- | --- |
| Framework Preset | **Next.js** |
| Build Command | `next build` |
| Output Directory | `.next` |
| Install Command | `npm install` |
| Node.js Version | 20.x (fine; set to 22.x under Settings if you prefer) |

**Environment variables:** none required for the basic site. (Only add
`RESEND_API_KEY` later if you enable confirmation emails — see README.)

### 2.3 Deploy

Click **Deploy**. Wait ~1–2 minutes. You'll get a live URL like:

```
https://satsang-uk-congregation.vercel.app
```

🎉 Your site is live and shareable.

---

## Part 3 — Automatic redeploys (the magic bit)

From now on, whenever you change content and push to GitHub:

```bash
git add .
git commit -m "Update schedule and contact details"
git push
```

Vercel automatically rebuilds and updates the live site within a minute.
Pull requests get their own **preview URL** so you can review changes before
they go live.

---

## Part 4 — Add a custom domain (optional)

To use e.g. `www.satsanguk.org` instead of the `.vercel.app` address:

1. Buy the domain (Namecheap, GoDaddy, Google Domains, etc.).
2. In Vercel: **Project → Settings → Domains → Add**, type your domain.
3. Vercel shows DNS records to add. In your domain registrar's DNS settings:
   - For a root domain (`satsanguk.org`): add an **A record** → `76.76.21.21`.
   - For `www`: add a **CNAME** → `cname.vercel-dns.com`.
4. Wait for DNS to propagate (minutes to a few hours). Vercel issues a free
   HTTPS certificate automatically.

> Tip: update `metadataBase` in `app/layout.tsx` to your real domain once set,
> so social-share previews use the correct URL.

---

## Alternative: deploy with the Vercel CLI (no GitHub UI)

```bash
npm i -g vercel
vercel          # first run: log in + link project → creates a preview
vercel --prod   # promote to production
```

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `git push` rejected / auth failed | Use a Personal Access Token or `gh auth login` (see 1.2). |
| Build fails on Vercel | Run `npm run build` locally to reproduce; fix the reported error, commit, push. |
| Map/QR not showing | They need a browser — check the deployed URL, not a static file open. |
| Changes not appearing | Confirm the `git push` succeeded and check the Vercel **Deployments** tab. |
| Wrong Node version | Vercel → Settings → General → Node.js Version. |
```
