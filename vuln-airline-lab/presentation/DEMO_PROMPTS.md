# 🎤 Presentation Demo — Powerful Prompts (Claude + Burp Suite MCP)

Copy-paste these live while presenting. They assume Claude is connected to the
**Burp Suite MCP Server** (PortSwigger's official Burp extension) and the target
is the SkyHaven lab at `http://localhost:8000`.

> Always state the authorization out loud first: *"This is an authorized test of
> a lab system I own, running on localhost."*

---

## 0. Setup (say this once)
```
You are an authorized web-application penetration tester with explicit
permission to test http://localhost:8000 (an isolated lab I own). You have
the Burp Suite MCP tools available. Operate only against that host. Keep a
running findings log with evidence and CVSS v3.1 scores.
```

## 1. Recon & attack surface  →  *"map it"*
```
Using the Burp MCP tools, review the proxy history and actively crawl
http://localhost:8000. Enumerate every route, parameter, form and cookie.
Build a target map, and for each input hypothesise the most likely
vulnerability class (SQLi, XSS, IDOR, auth, access control, injection).
Return a prioritised attack plan as a table. Do NOT exploit yet.
```

## 2. Autonomous exploitation  →  *"work the plan"*  ⭐ the wow moment
```
Execute the attack plan autonomously. For each candidate:
  1. craft a payload,
  2. send it via Burp Repeater through the MCP,
  3. read the response and confirm or reject the finding,
  4. capture the request/response as evidence.
Chain issues where possible — e.g. decode the session cookie, forge
role=admin, and confirm access to /admin. Continue until the plan is
exhausted, then summarise confirmed findings with CVSS scores.
```

## 3. Targeted one-liners (great for a fast live demo)
```
Test the /login endpoint for SQL injection auth bypass and prove it with a
working payload and the resulting response.
```
```
Decode the `session` cookie, show me why it's insecure, forge an admin
session, and use it to read /admin — paste the evidence.
```
```
Walk the /booking?id= parameter from 1 to 10 and tell me if it's an IDOR.
List any bookings that belong to other users.
```
```
The admin diagnostics tool runs ping. Determine whether the host field is
command-injectable and, if so, demonstrate safe proof (e.g. `id`).
```

## 4. Reporting  →  *"write it up"*
```
Compile all confirmed findings into a professional penetration-test report:
executive summary, a risk-rated findings table, per-finding reproduction
steps with request/response evidence, business impact, and remediation.
Group by OWASP Top 10 (2025) and export as Markdown.
```

## 5. Remediation & retest (the customer-value close)
```
For the three critical findings, give secure code fixes (parameterised
queries, signed server-side sessions, subprocess without a shell) and a
retest checklist I can run after the dev team ships the patch.
```

---

### Why this lands with a customer
- **Plain English in, real Burp traffic out** — no scripting.
- **Agentic loop** — Claude reads each response and adapts the next request.
- **Chaining** — it strings weaknesses together the way a real attacker would.
- **Evidence + CVSS + fixes** — an auditable report, not just noise.
- **Human-in-the-loop** — you approve scope and review every finding.
