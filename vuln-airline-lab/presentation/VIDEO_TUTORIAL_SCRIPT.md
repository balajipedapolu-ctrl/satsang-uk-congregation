# 🎬 Video Tutorial Script — Agentic Pentesting with Claude + Burp Suite MCP

**Working title:** *"Hack an Airline with One Prompt — Claude + Burp Suite MCP"*
**Runtime:** ~8 min (flex 5–10). **Format:** screen recording + voiceover.
**Presenter:** Balaji Pedapolu.
**Target app:** SkyHaven Airways lab — `http://localhost:8000` (authorized, isolated).

> ⚠️ Open the video with the authorization disclaimer on screen. Everything is a
> lab you own on localhost. This keeps it ethical and credible for customers.

---

## 🎥 Before you record — production checklist

| Item | Recommendation |
|------|----------------|
| Recorder | **QuickTime** (File ▸ New Screen Recording) or **OBS Studio** (free) |
| Resolution | 1920×1080, 30 fps |
| Layout | Claude window left ~55%, Burp Suite right ~45% (or full-screen and cut between) |
| Font size | Bump Claude + Burp + browser zoom to ~125% so text is legible on video |
| Audio | External/USB mic; record voiceover separately and lay it over the screen capture |
| Windows to prep | 1) Claude (with Burp MCP connected) 2) Burp Suite 3) Browser at SkyHaven 4) the finished `SkyHaven_Pentest_Report.pdf` |
| Do a dry run | Run all prompts once so responses are warm and you know the timing |

**Windows to have open, in tab order:** Browser (SkyHaven) → Burp Suite → Claude.

---

## 🗺️ Scene map (timecodes)

| # | Time | Scene | On screen |
|---|------|-------|-----------|
| 1 | 0:00–0:30 | Hook | SkyHaven site + title card |
| 2 | 0:30–1:40 | What is MCP + Burp MCP | Simple diagram slide |
| 3 | 1:40–2:40 | Connect Burp to Claude | Burp Extensions + Claude MCP config |
| 4 | 2:40–3:20 | Meet the target | Browser tour of SkyHaven |
| 5 | 3:20–4:40 | Prompt 1 — Recon | Claude typing, Burp proxy history |
| 6 | 4:40–6:40 | Prompt 2 — Exploit | Claude + Burp Repeater, live findings |
| 7 | 6:40–7:40 | Prompt 3 — PDF report | Report being generated + PDF |
| 8 | 7:40–8:00 | Recap + outro | Scanner-vs-Claude slide + CTA |

---

## 🎙️ Full script (narration + actions)

### SCENE 1 — Hook · 0:00–0:30
**SCREEN:** SkyHaven homepage, slowly scrolling. Title card fades in:
*"Agentic Pentesting — Claude + Burp Suite MCP."*
**LOWER-THIRD:** `Balaji Pedapolu · Authorized lab demo`
**NARRATION:**
> "This is SkyHaven Airways — a normal-looking booking site. In the next few
> minutes I'll run a full penetration test against it without writing a single
> script. I'll just *talk* to Claude, and Claude will drive Burp Suite through
> something called MCP — find the bugs, chain them, and hand me a PDF report.
> Everything here is a lab I own, running on my own machine."

### SCENE 2 — What is MCP + Burp MCP · 0:30–1:40
**SCREEN:** Simple diagram (use Slide 2 of the deck):
`Claude → MCP → Burp Suite → SkyHaven App`.
**NARRATION:**
> "Quick overview. MCP — the Model Context Protocol — is a standard way to give
> an AI model real tools instead of just chat. Burp Suite, the industry-standard
> web-security proxy, ships an official MCP Server. Turn it on, and Claude gets
> *hands* inside Burp: it can read the proxy history, replay requests in
> Repeater, fuzz with Intruder, and run scans.
> So the division of labour is simple: **Claude is the brain — it reasons,
> plans, and decides what to try. Burp is the hands — it sends the real
> traffic.** That combination is what makes this agentic, not just autocomplete."
**ON-SCREEN CAPTION:** `MCP = tools for the model · Burp = the hands · Claude = the brain`

### SCENE 3 — Connect Burp to Claude · 1:40–2:40
**SCREEN:** Burp Suite → **Extensions ▸ BApp Store**, highlight **"MCP Server"**,
click **Install**; then the extension tab showing the server **running** with its
local URL. Cut to the Claude MCP config.
**NARRATION:**
> "Connecting them is a two-step, one-time setup. In Burp, open the BApp Store
> and install the **MCP Server** extension — it starts a local server that
> exposes Burp's tools. Then point Claude at it by adding that server to your MCP
> configuration. Save, restart, and Claude now lists the Burp tools as
> available. That's it — the plumbing is done."
**ON-SCREEN CALLOUT (config snippet):**
```jsonc
// Claude MCP config — add the Burp MCP server
{
  "mcpServers": {
    "burp": { "url": "http://127.0.0.1:9876/sse" }   // URL shown in Burp's MCP tab
  }
}
```
> *(Tip: exact URL/port is displayed in Burp's MCP Server tab — copy it from there.)*

### SCENE 4 — Meet the target · 2:40–3:20
**SCREEN:** Browser tour of SkyHaven: home, **Book Flights**, **Manage Booking**
(PNR + last name), the login page.
**NARRATION:**
> "Here's our target. It behaves like a real airline: search flights, book,
> manage a booking with a PNR and last name, sign in. To an automated scanner
> it's just a set of forms. Let's see what Claude makes of it."

### SCENE 5 — Prompt 1: Recon · 3:20–4:40
**SCREEN:** Claude window. Type and send **Prompt 1** (below). As Claude works,
cut to Burp's **Proxy ▸ HTTP history** filling with requests, then back to
Claude's attack-plan table.
**PROMPT (type this live):**
```
You are an authorized pentester testing http://localhost:8000 (my isolated lab).
Using the Burp MCP tools, review the proxy history and crawl the site. Enumerate
every route, parameter, form and cookie, then return a prioritised attack plan —
one row per input with its most likely vulnerability class. Do not exploit yet.
```
**NARRATION:**
> "First, reconnaissance. I tell Claude — in plain English — to map the site
> using Burp. Watch Burp's HTTP history fill up as Claude crawls. Seconds later
> it hands back a prioritised attack plan: the login form flagged for SQL
> injection, the booking lookup for logic flaws, the session cookie for tampering.
> It didn't just list endpoints — it *reasoned* about what each one is likely
> vulnerable to."

### SCENE 6 — Prompt 2: Autonomous exploitation · 4:40–6:40  ⭐
**SCREEN:** Send **Prompt 2**. Split-screen: Claude narrating its steps on the
left, Burp **Repeater** showing the actual request/response on the right.
Highlight 2–3 confirmations: (a) SQLi login bypass `admin'--` → 302 to /account;
(b) decode session cookie → forge `role:admin` → open `/admin`; (c) command
injection `127.0.0.1; id`.
**PROMPT (type this live):**
```
Now work the plan autonomously. For each candidate: craft a payload, send it via
Burp Repeater through MCP, read the response, and confirm or reject the finding
with evidence. Chain issues where possible — decode the session cookie, forge an
admin role, and reach /admin. Keep a findings log with CVSS scores.
```
**NARRATION:**
> "Now the fun part — I let it loose. Claude crafts a payload, fires it through
> Burp's Repeater, reads the response, and decides what's real. Here it bypasses
> the login with a classic SQL-injection payload — no password needed. Then it
> does something a scanner simply can't: it *chains*. It decodes the session
> cookie, notices there's no signature, forges an admin role, and walks straight
> into the admin console. And finally — full remote code execution through the
> diagnostics tool. Every finding is confirmed with a real request and response,
> and scored. This is the difference between pattern-matching and reasoning."
**ON-SCREEN CAPTION during chaining:** `Scanner tests inputs in isolation — Claude chains them.`

### SCENE 7 — Prompt 3: PDF report · 6:40–7:40
**SCREEN:** Send **Prompt 3**. Show the report being written, then open
**`SkyHaven_Pentest_Report.pdf`** and scroll: cover, executive summary, CVSS
table, a detailed finding with evidence, remediation.
**PROMPT (type this live):**
```
Compile all confirmed findings into a professional penetration-test report:
executive summary, a risk-rated CVSS table, per-finding reproduction steps with
request/response evidence, business impact, and remediation. Group by OWASP Top
10 (2025) and give it to me as a polished PDF.
```
**NARRATION:**
> "One more sentence and I get the deliverable: a professional PDF report.
> Executive summary for the business, a CVSS-scored findings table, step-by-step
> reproduction with the exact requests, and developer-ready fixes — grouped by
> the OWASP Top 10. What used to take a consultant days to write up, produced in
> a single sitting, with a human reviewing every line."

### SCENE 8 — Recap + outro · 7:40–8:00
**SCREEN:** Slide 4 (Scanner-vs-Claude comparison), then title card with credit.
**NARRATION:**
> "So — automated scanners are fast, but blind to logic. Claude adds the
> reasoning: business-logic flaws, multi-step chains, access-control bugs, and
> clean triage — and it uses Burp to prove all of it. One prompt to test, one
> prompt to report. Thanks for watching — I'm Balaji Pedapolu."
**END CARD:** `SkyHaven Airways · Agentic Pentesting Demo · Balaji Pedapolu`

---

## 📝 Teleprompter (clean voiceover only)
> 1. This is SkyHaven Airways — a normal-looking booking site. In the next few minutes I'll pentest it without writing a single script — just by talking to Claude, which drives Burp Suite through MCP.
> 2. MCP is a standard way to give an AI real tools. Burp ships an official MCP server, so Claude gets hands inside Burp — proxy, Repeater, Intruder, scanner. Claude is the brain; Burp is the hands.
> 3. Setup is one-time: install Burp's MCP Server extension, then add that server to Claude's MCP config. Now Claude can use Burp's tools.
> 4. Here's the target — books flights, manages bookings, has a login. To a scanner it's just forms.
> 5. First, recon: I ask Claude to map the site with Burp and return a prioritised attack plan. Watch Burp's history fill up — then it reasons about what each input is likely vulnerable to.
> 6. Now I let it loose. It crafts payloads, fires them through Repeater, and confirms each finding. It bypasses login with SQL injection, forges the session cookie to become admin, and gets remote code execution — chaining bugs the way a real attacker would.
> 7. One more prompt, and I get a professional PDF report: executive summary, CVSS table, reproduction steps, and fixes, grouped by OWASP Top 10.
> 8. Scanners are fast but blind to logic. Claude adds the reasoning and uses Burp to prove it. One prompt to test, one to report. I'm Balaji Pedapolu — thanks for watching.

---

## 🎞️ Editing notes
- **Cut on action:** every time you press Enter on a prompt, cut to Burp so the viewer sees real traffic — this is what sells it.
- **Zoom/highlight** the key line in each response (the `302`, the decoded cookie, the `uid=...` from `id`).
- **Captions:** burn in the on-screen captions above; ~40% of viewers watch muted.
- **Keep it moving:** if a prompt takes 30s to run, speed-ramp (4–8×) with a "thinking…" caption.
- **Music:** subtle, low tension bed under narration; drop it out for the "wow" chain in Scene 6.
- **Thumbnail:** SkyHaven logo + big red "PWNED IN ONE PROMPT" + Burp/Claude logos.

## Assets you already have
- `SkyHaven_Agentic_Pentest.pptx` — pull Slides 2 & 4 as diagram inserts.
- `DEMO_PROMPTS.md` — the exact prompts (also embedded above).
- `SkyHaven_Pentest_Report.pdf` / `PENTEST_REPORT.html` — the Scene-7 deliverable.
- The running app — `python3 ../server.py`.
