# ✈️ SkyHaven Airways — Intentionally Vulnerable Airline Web App

A professional-looking dummy airline website built as a **hands-on pentesting
lab**, in the spirit of OWASP Juice Shop / DVWA / WebGoat. It renders like a
real carrier's booking site (hero search, fare cards, bookings, SkyMiles,
admin console) but is seeded with a dozen deliberate, documented
vulnerabilities.

> ⚠️ **Authorized security education / practice only.** Everything here is
> insecure on purpose. Keep it on `localhost`. **Do not** deploy it publicly or
> reuse the code in production.

## Requirements
- Python **3.8+** (uses only the standard library — no `pip install` needed).

## Run
```bash
cd vuln-airline-lab
python3 server.py
# open http://localhost:8000
```
The server binds to `127.0.0.1` only, and the SQLite database is rebuilt on
every start, so you always get a clean lab. Stop with `Ctrl+C`.

## What's in it
- **Home / search** — hero flight-search widget, featured fares.
- **Book Flights** (`/flights`) — live search + booking.
- **Manage Booking** (`/manage`) — retrieve a trip by **PNR + last name**
  (e.g. `SKH7F2A9` / `Walker`); download boarding pass.
- **Deals** (`/deals`) — full fare list.
- **Contact & Reviews** (`/contact`) — message board.
- **Auth** (`/login`, `/register`) — sessions & SkyMiles.
- **My Account** (`/account`) — bookings, boarding-pass downloads.
- **Admin Console** (`/admin`) — user table, messages, network diagnostics.
- **API** (`/api/users`) — JSON user endpoint.

## The vulnerabilities (summary)
Full walkthrough + payloads: **[VULNERABILITIES.md](VULNERABILITIES.md)**.

| # | Class | Location |
|---|-------|----------|
| 1–2 | SQL injection (UNION exfiltration) | flight search |
| 3 | Reflected XSS | flight search |
| 4 | Stored XSS | contact / reviews |
| 5 | Auth bypass via SQLi | login |
| 6 | IDOR | `/booking?id=` |
| 7 | Forgeable session (no signature) | session cookie |
| 8 | Sensitive data exposure + plaintext passwords | `/api/users` |
| 9 | Path traversal / LFI | boarding-pass download |
| 10 | Privilege escalation | admin via cookie role |
| 11 | OS command injection (RCE) | admin diagnostics |
| 12 | Verbose errors, missing headers, no CSRF | app-wide |
| 13 | SQL injection (last-name bypass) | Manage Booking / PNR lookup |

Maps to the **OWASP Top 10** (A01, A02, A03, A05, A07). Great for practicing
Burp Suite, `sqlmap`, manual injection, and writing up findings.

## Quick demo account
`guest` / `guest` — or just forge an admin session (see #7).

## Files
- `server.py` — the app + intentional vulns (inline `VULN #` comments).
- `theme.py` — shared HTML layout and CSS (the "professional" look).
- `VULNERABILITIES.md` — instructor answer key with exploit payloads.
- `skyhaven.db` — SQLite DB (auto-generated, git-ignored).
