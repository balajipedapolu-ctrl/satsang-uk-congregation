#!/usr/bin/env python3
"""Generate 1280x720 HTML slides + narration text for the MP4 tutorial."""
import json, os

OUT = os.path.dirname(os.path.abspath(__file__))

NAVY="#0a2540"; NAVY2="#06192e"; GOLD="#e6b34d"; MUTED="#a9c2dc"; WHITE="#ffffff"
GREEN="#3fb57a"; RED="#d64545"

BASE = """<!doctype html><html><head><meta charset='utf-8'><style>
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1280px;height:720px;overflow:hidden;
 font-family:'Helvetica Neue',Arial,sans-serif;background:{navy};color:#fff}}
.slide{{width:1280px;height:720px;position:relative;padding:70px 84px;
 background:radial-gradient(1200px 600px at 85% -10%,rgba(230,179,77,.16),transparent 60%),
 linear-gradient(120deg,{navy2} 0%,{navy} 55%,#12324f 100%)}}
.kick{{color:{gold};font-weight:800;letter-spacing:6px;font-size:20px;text-transform:uppercase}}
.brand{{position:absolute;top:70px;right:84px;color:{muted};font-size:19px;font-weight:600}}
.brand b{{color:#fff}}
h1{{font-size:76px;font-weight:800;line-height:1.05;margin-top:22px;letter-spacing:-1px}}
h1 .g{{color:{gold}}}
h2{{font-size:56px;font-weight:800;margin-top:14px}}
.sub{{font-size:30px;color:{muted};margin-top:26px;max-width:1000px;line-height:1.45}}
.foot{{position:absolute;left:84px;bottom:56px;color:{muted};font-size:22px}}
.foot b{{color:#fff}}
.tag{{display:inline-block;background:#3a1414;color:#ffb4b4;border:1px solid #6b2020;
 padding:8px 18px;border-radius:8px;font-size:18px;font-weight:700;margin-top:20px}}
.chain{{display:flex;align-items:center;gap:14px;margin-top:60px;flex-wrap:wrap}}
.node{{background:#12324f;border:2px solid #1e3f5e;border-radius:16px;padding:24px 26px;
 min-width:210px;text-align:center}}
.node.g{{background:{gold};border-color:{gold};color:#3a2a00}}
.node .t{{font-size:30px;font-weight:800}}
.node .d{{font-size:18px;color:{muted};margin-top:6px}}
.node.g .d{{color:#5a4300}}
.arw{{color:{gold};font-size:44px;font-weight:800}}
.term{{margin-top:44px;background:{navy2};border:2px solid #1e3f5e;border-radius:16px;
 padding:30px 34px;font-family:'Courier New',monospace;font-size:26px;line-height:1.5;
 color:#cfe7d6;max-width:1060px}}
.term .p{{color:{gold}}}
.dots{{margin-bottom:16px}}
.dots span{{display:inline-block;width:16px;height:16px;border-radius:50%;margin-right:10px}}
.rows{{margin-top:44px}}
.row{{display:flex;align-items:center;gap:22px;margin-bottom:22px;font-size:28px}}
.bad,.good{{width:44px;height:44px;border-radius:50%;display:inline-grid;place-items:center;
 font-weight:800;font-size:26px;color:#fff;flex:0 0 auto}}
.bad{{background:{red}}}.good{{background:{green}}}
.row .cap{{font-weight:700;min-width:520px}}
.row .cl{{color:{gold};font-weight:700}}
.big{{display:flex;gap:40px;margin-top:56px}}
.stat{{background:#12324f;border:2px solid #1e3f5e;border-radius:18px;padding:30px 40px;text-align:center}}
.stat .n{{font-size:80px;font-weight:800;color:{gold}}}
.stat.r .n{{color:{red}}}
.stat .l{{font-size:22px;color:{muted};margin-top:6px}}
.progress{{position:absolute;bottom:0;left:0;height:8px;background:{gold}}}
</style></head><body><div class='slide'>{body}
<div class='progress' style='width:{pw}px'></div></div></body></html>"""

BRAND = "<div class='brand'>✈ <b>SkyHaven Airways</b> · Security Lab</div>"

def foot():
    return "<div class='foot'>Presented by <b>Balaji Pedapolu</b></div>"

slides = []

# 1 — hook
slides.append(dict(narr=
 "This is SkyHaven Airways. In the next few minutes, I'll run a full penetration "
 "test on this airline website, without writing a single line of code. I'll just "
 "talk to Claude, and Claude will drive Burp Suite through M C P.",
 body=f"{BRAND}<span class='kick'>Agentic Pentesting Tutorial</span>"
 f"<h1>Hack an Airline<br>with <span class='g'>One Prompt</span></h1>"
 f"<div class='sub'>Claude + Burp Suite MCP versus the SkyHaven Airways platform.</div>"
 f"<div class='tag'>CONFIDENTIAL · AUTHORIZED LOCALHOST LAB</div>{foot()}"))

# 2 — what is MCP
slides.append(dict(narr=
 "First, the overview. M C P, the Model Context Protocol, gives Claude real tools "
 "instead of just chat. Burp Suite ships an official M C P server, so Claude gets "
 "hands inside Burp: the proxy, repeater, and scanner. Claude is the brain. Burp is the hands.",
 body=f"{BRAND}<span class='kick'>How it works</span>"
 f"<h2>Claude thinks. Burp acts.</h2>"
 f"<div class='chain'>"
 f"<div class='node'><div class='t'>Claude</div><div class='d'>reasoning &amp; planning</div></div>"
 f"<div class='arw'>→</div>"
 f"<div class='node g'><div class='t'>MCP</div><div class='d'>secure tool bridge</div></div>"
 f"<div class='arw'>→</div>"
 f"<div class='node'><div class='t'>Burp Suite</div><div class='d'>proxy · repeater · scanner</div></div>"
 f"<div class='arw'>→</div>"
 f"<div class='node'><div class='t'>Target</div><div class='d'>SkyHaven site</div></div>"
 f"</div>{foot()}"))

# 3 — connect
slides.append(dict(narr=
 "Setup is a one time job. In Burp, install the M C P Server extension from the "
 "B-App store. Then add that server to Claude's M C P configuration. Save, restart, "
 "and Claude can now drive Burp.",
 body=f"{BRAND}<span class='kick'>One-time setup</span>"
 f"<h2>Connect Burp to Claude</h2>"
 f"<div class='term'><div class='dots'><span style='background:#d64545'></span>"
 f"<span style='background:#e6b34d'></span><span style='background:#3fb57a'></span></div>"
 f"<span class='p'>1</span> Burp ▸ Extensions ▸ install <b>MCP Server</b><br>"
 f"<span class='p'>2</span> Add to Claude config:<br>"
 f"&nbsp;&nbsp;\"burp\": {{ \"url\": \"http://127.0.0.1:9876/sse\" }}<br>"
 f"<span class='p'>3</span> Restart → Burp tools now available</div>{foot()}"))

# 4 — recon
slides.append(dict(narr=
 "Now, reconnaissance. I ask Claude, in plain English, to map the site using Burp "
 "and return a prioritized attack plan. Watch Burp's history fill up. Claude reasons "
 "about what each input is likely vulnerable to.",
 body=f"{BRAND}<span class='kick'>Prompt 1 · Recon</span>"
 f"<h2>Map the attack surface</h2>"
 f"<div class='term'><span class='p'>&gt;</span> Using the Burp MCP tools, crawl "
 f"http://localhost:8000,<br>enumerate every route, parameter and cookie, and<br>"
 f"return a prioritised attack plan. Don't exploit yet.</div>{foot()}"))

# 5 — exploit
slides.append(dict(narr=
 "Then I let it loose. Claude crafts payloads, fires them through Burp's repeater, "
 "and confirms each finding with evidence. It bypasses the login with SQL injection, "
 "forges the session cookie to become admin, and gets remote code execution, "
 "chaining bugs the way a real attacker would.",
 body=f"{BRAND}<span class='kick'>Prompt 2 · Autonomous Exploit</span>"
 f"<h2>Claude works the plan</h2>"
 f"<div class='rows' style='margin-top:34px'>"
 f"<div class='row'><span class='good'>✓</span><span class='cap'>SQL injection login bypass</span>"
 f"<span class='cl'>admin'-- → logged in</span></div>"
 f"<div class='row'><span class='good'>✓</span><span class='cap'>Forge session cookie → admin</span>"
 f"<span class='cl'>role:admin → /admin</span></div>"
 f"<div class='row'><span class='good'>✓</span><span class='cap'>OS command injection → RCE</span>"
 f"<span class='cl'>127.0.0.1; id</span></div></div>{foot()}"))

# 6 — scanner vs claude
slides.append(dict(narr=
 "This is what automated scanners cannot do. Business logic flaws. Multi step "
 "chaining. Access control bugs. And clean triage of real findings. Claude reasons "
 "about all of it, and uses Burp to prove it.",
 body=f"{BRAND}<span class='kick'>Why agentic wins</span>"
 f"<h2>Where scanners stop</h2>"
 f"<div class='rows'>"
 f"<div class='row'><span class='bad'>✕</span><span class='cap'>Business-logic flaws</span>"
 f"<span class='good'>✓</span><span class='cl'>Claude reasons about intent</span></div>"
 f"<div class='row'><span class='bad'>✕</span><span class='cap'>Multi-step exploit chains</span>"
 f"<span class='good'>✓</span><span class='cl'>chains end-to-end</span></div>"
 f"<div class='row'><span class='bad'>✕</span><span class='cap'>Access control / IDOR</span>"
 f"<span class='good'>✓</span><span class='cl'>knows who owns what</span></div>"
 f"<div class='row'><span class='bad'>✕</span><span class='cap'>False-positive triage</span>"
 f"<span class='good'>✓</span><span class='cl'>confirms with evidence</span></div></div>{foot()}"))

# 7 — report + outro
slides.append(dict(narr=
 "One more prompt, and Claude writes a full P D F report: executive summary, C V S S "
 "scores, reproduction steps, and fixes. Thirteen findings, three critical, in minutes. "
 "One prompt to test, one prompt to report. Developed by Balaji Pedapolu. Thanks for watching.",
 body=f"{BRAND}<span class='kick'>Prompt 3 · The Deliverable</span>"
 f"<h2>A professional PDF report</h2>"
 f"<div class='big'>"
 f"<div class='stat'><div class='n'>13</div><div class='l'>findings</div></div>"
 f"<div class='stat r'><div class='n'>3</div><div class='l'>critical</div></div>"
 f"<div class='stat'><div class='n'>~90%</div><div class='l'>time saved</div></div></div>"
 f"<div class='sub' style='margin-top:40px'>One prompt to test. One prompt to report.</div>"
 f"{foot()}"))

n = len(slides)
narr = []
for i, s in enumerate(slides):
    pw = int(1280 * (i + 1) / n)
    html = BASE.format(navy=NAVY, navy2=NAVY2, gold=GOLD, muted=MUTED, red=RED,
                       green=GREEN, body=s["body"], pw=pw)
    with open(os.path.join(OUT, f"slide{i+1}.html"), "w") as f:
        f.write(html)
    narr.append(s["narr"])

with open(os.path.join(OUT, "narration.json"), "w") as f:
    json.dump(narr, f, indent=2)
print(f"Wrote {n} slides + narration.json")
