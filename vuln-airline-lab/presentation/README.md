# 🎤 Presentation Kit — Agentic AI Pentesting Demo

Everything you need to show a customer how **Claude + Burp Suite MCP** performs
an autonomous penetration test against the SkyHaven Airways demo app.

## Files
| File | What it is | How to use it |
|------|------------|---------------|
| `SkyHaven_Agentic_Pentest.pptx` | **5-slide executive deck** | Open in PowerPoint / Keynote; present |
| `DEMO_PROMPTS.md` | **Powerful copy-paste prompts** | Paste live into Claude during the demo |
| `PENTEST_REPORT.html` | **Sample "output" report** | Double-click to open in a browser; show as the result |
| `SkyHaven_Pentest_Report.pdf` | **PDF version of the report** | Hand to the customer as the deliverable |
| `VIDEO_TUTORIAL_SCRIPT.md` | **5–10 min video tutorial script** | Record with QuickTime/OBS; narration + prompts + timecodes |
| `SkyHaven_Tutorial.mp4` | **Narrated overview video (~1:47)** | Double-click to play in any video player |
| `video/` | Video build kit (slides, narration, encoder) | Run `video/build_video.sh` to rebuild the MP4 |
| `generate_deck.js` | Deck generator (Node) | Re-run to tweak slides |

## Suggested 10-minute flow
1. **Slide 1** — set the scene: authorized, isolated lab; agentic approach.
2. **Slide 2** — explain the pipeline (Claude → MCP → Burp → target) and the loop.
3. **Slide 3** — the wow: read the two powerful prompts aloud.
4. **Slide 4** — *Scanner vs Claude*: the four things automated scanners can't
   do (business logic, chaining, IDOR/access-control, triage) that Claude can.
5. **Live demo** — paste prompts from `DEMO_PROMPTS.md` and let Claude work
   (or, if you don't want a live run, walk through `PENTEST_REPORT.html`).
6. **Slide 5** — results: 13 findings, 3 critical, ~90% time saved.
7. **Close** — open `PENTEST_REPORT.html` full-screen as the deliverable.

## Live-demo prerequisites (only if running it live)
- Burp Suite with the official **MCP Server** extension enabled.
- Claude connected to that Burp MCP server.
- The SkyHaven lab running: `python3 ../server.py` → `http://localhost:8000`.
- Say the authorization statement out loud before you start.

> No live tooling? The deck + report stand on their own — the report already
> contains real findings confirmed against this exact app.

## Regenerate the deck
```bash
export PATH="$HOME/.local/nodejs/node-v24.18.0-darwin-arm64/bin:$PATH"
node generate_deck.js
```

*Prepared by Balaji Pedapolu.*
