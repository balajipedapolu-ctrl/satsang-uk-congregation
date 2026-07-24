// Agentic AI Pentesting — 4-slide executive deck
// Claude + Burp Suite MCP vs. the SkyHaven Airways demo app.
const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.layout = "LAYOUT_WIDE"; // 13.33 x 7.5

// ---- palette (SkyHaven navy/gold + security signal colors) ----
const NAVY   = "0A2540";
const NAVY2  = "06192E";
const CARD   = "12324F";
const GOLD   = "E6B34D";
const GOLDD  = "C8952F";
const ICE    = "F5F8FC";
const WHITE  = "FFFFFF";
const MUTED  = "A9C2DC";
const SLATE  = "5B6B7B";
const LINE   = "E3E9F0";
const CRIT   = "D64545";
const HIGH   = "E8873B";
const MED    = "E6B34D";
const LOW    = "4C9AD6";

const HF = "Cambria";        // header serif (safe list)
const BF = "Calibri";        // body sans (safe list)
const MONO = "Courier New";  // prompt / code

const W = 13.33, H = 7.5;
const newShadow = () => ({ type: "outer", color: "0A2540", opacity: 0.28, blur: 10, offset: 3, angle: 90 });

// ============================================================= SLIDE 1
(() => {
  const s = p.addSlide();
  s.background = { color: NAVY };
  // motif: translucent gold rings top-right
  s.addShape("oval", { x: 9.4, y: -2.1, w: 6.4, h: 6.4, fill: { color: GOLD, transparency: 88 }, line: { type: "none" } });
  s.addShape("oval", { x: 10.7, y: -0.9, w: 3.9, h: 3.9, fill: { color: GOLD, transparency: 80 }, line: { type: "none" } });

  // brand line
  s.addText([
    { text: "✈  ", options: { color: GOLD } },
    { text: "SKYHAVEN AIRWAYS", options: { color: WHITE, bold: true } },
    { text: "   |   SECURITY ASSESSMENT", options: { color: MUTED } },
  ], { x: 0.7, y: 0.6, w: 10, h: 0.4, fontFace: BF, fontSize: 13, charSpacing: 2 });

  // confidential tag
  s.addShape("roundRect", { x: 0.7, y: 1.55, w: 3.05, h: 0.44, rectRadius: 0.22, fill: { color: "3A1414" }, line: { color: "6B2020", width: 1 } });
  s.addText("CONFIDENTIAL  ·  AUTHORIZED LAB TEST", { x: 0.7, y: 1.55, w: 3.05, h: 0.44, align: "center", color: "FFB4B4", fontFace: BF, fontSize: 10.5, bold: true });

  s.addText("Agentic AI\nPenetration Testing", {
    x: 0.65, y: 2.2, w: 9.6, h: 2.2, fontFace: HF, fontSize: 52, bold: true, color: WHITE, lineSpacing: 52,
  });
  s.addText([
    { text: "Autonomous security testing with ", options: { color: MUTED } },
    { text: "Claude", options: { color: GOLD, bold: true } },
    { text: "  +  ", options: { color: MUTED } },
    { text: "Burp Suite MCP", options: { color: GOLD, bold: true } },
  ], { x: 0.7, y: 4.45, w: 11, h: 0.5, fontFace: BF, fontSize: 21 });

  s.addText("One prompt drives reconnaissance, exploitation and reporting — a live demo against the SkyHaven Airways platform.",
    { x: 0.7, y: 5.15, w: 8.6, h: 0.8, fontFace: BF, fontSize: 14.5, color: "CBD9E8" });

  // bottom presenter bar
  s.addShape("line", { x: 0.72, y: 6.55, w: 11.9, h: 0, line: { color: "1E3F5E", width: 1 } });
  s.addText([
    { text: "Presented by ", options: { color: MUTED } },
    { text: "Balaji Pedapolu", options: { color: WHITE, bold: true } },
  ], { x: 0.7, y: 6.7, w: 7, h: 0.4, fontFace: BF, fontSize: 14 });
  s.addText("SkyHaven Airways · IATA SH · 2026", { x: 6.5, y: 6.7, w: 6.1, h: 0.4, align: "right", color: MUTED, fontFace: BF, fontSize: 12 });

  s.addNotes("Title slide. Frame: this is a demonstration of agentic AI penetration testing — Claude driving Burp Suite through the Model Context Protocol against our intentionally vulnerable SkyHaven Airways lab. Stress it's authorized, isolated (localhost), and repeatable.");
})();

// ============================================================= SLIDE 2
(() => {
  const s = p.addSlide();
  s.background = { color: ICE };
  s.addText("How Agentic Pentesting Works", { x: 0.7, y: 0.55, w: 12, h: 0.7, fontFace: HF, fontSize: 34, bold: true, color: NAVY });
  s.addText("Claude acts as the tester; the Model Context Protocol (MCP) gives it hands inside Burp Suite to drive real traffic against the target.",
    { x: 0.72, y: 1.28, w: 11.8, h: 0.5, fontFace: BF, fontSize: 14.5, color: SLATE });

  // architecture chain: 4 nodes
  const chain = [
    { t: "Claude", d: "Reasoning agent\n& planner", c: NAVY, tc: WHITE },
    { t: "MCP", d: "Tool protocol\n(secure bridge)", c: GOLD, tc: NAVY2 },
    { t: "Burp Suite", d: "Proxy · Repeater\nScanner · Intruder", c: NAVY, tc: WHITE },
    { t: "SkyHaven App", d: "Target website\n(localhost:8000)", c: CARD, tc: WHITE },
  ];
  const nx = 0.7, ny = 2.15, nw = 2.72, nh = 1.55, gap = 0.42;
  chain.forEach((n, i) => {
    const x = nx + i * (nw + gap);
    s.addShape("roundRect", { x, y: ny, w: nw, h: nh, rectRadius: 0.1, fill: { color: n.c }, line: { type: "none" }, shadow: newShadow() });
    s.addText(n.t, { x, y: ny + 0.28, w: nw, h: 0.5, align: "center", fontFace: HF, fontSize: 19, bold: true, color: n.tc });
    s.addText(n.d, { x, y: ny + 0.8, w: nw, h: 0.6, align: "center", fontFace: BF, fontSize: 11.5, color: (n.tc === WHITE ? MUTED : NAVY2) });
    if (i < chain.length - 1) {
      s.addText("→", { x: x + nw - 0.02, y: ny + 0.35, w: gap + 0.04, h: 0.8, align: "center", fontFace: BF, fontSize: 26, bold: true, color: GOLDD });
    }
  });

  // the autonomous loop
  s.addText("The autonomous loop", { x: 0.7, y: 4.15, w: 8, h: 0.4, fontFace: HF, fontSize: 18, bold: true, color: NAVY });
  const steps = [
    { n: "1", t: "Recon", d: "Map endpoints & params from proxy history" },
    { n: "2", t: "Plan", d: "Rank likely vulns per OWASP Top 10" },
    { n: "3", t: "Exploit", d: "Craft payloads, fire via Repeater/Intruder" },
    { n: "4", t: "Verify", d: "Read responses, confirm, chain findings" },
    { n: "5", t: "Report", d: "Evidence, CVSS & fixes, exported" },
  ];
  const sx = 0.7, sy = 4.75, sw = 2.32, sgap = 0.18;
  steps.forEach((st, i) => {
    const x = sx + i * (sw + sgap);
    s.addShape("roundRect", { x, y: sy, w: sw, h: 1.75, rectRadius: 0.08, fill: { color: WHITE }, line: { color: LINE, width: 1 }, shadow: newShadow() });
    s.addShape("oval", { x: x + 0.22, y: sy + 0.24, w: 0.62, h: 0.62, fill: { color: NAVY }, line: { type: "none" } });
    s.addText(st.n, { x: x + 0.22, y: sy + 0.24, w: 0.62, h: 0.62, align: "center", valign: "middle", fontFace: HF, fontSize: 20, bold: true, color: GOLD });
    s.addText(st.t, { x: x + 0.2, y: sy + 0.95, w: sw - 0.4, h: 0.35, fontFace: HF, fontSize: 15, bold: true, color: NAVY });
    s.addText(st.d, { x: x + 0.2, y: sy + 1.28, w: sw - 0.36, h: 0.42, fontFace: BF, fontSize: 10.5, color: SLATE, lineSpacing: 12 });
  });

  s.addNotes("Explain the pipeline left to right: Claude reasons and plans; MCP is the standardized, permissioned bridge; Burp is the industry-standard proxy that actually sends traffic; SkyHaven is our target. Then the loop — recon, plan, exploit, verify, report — runs autonomously and iterates until the plan is exhausted.");
})();

// ============================================================= SLIDE 3
(() => {
  const s = p.addSlide();
  s.background = { color: NAVY };
  s.addText("One Prompt. A Full Pentest.", { x: 0.7, y: 0.55, w: 12, h: 0.7, fontFace: HF, fontSize: 34, bold: true, color: WHITE });
  s.addText("You direct the engagement in plain English. Claude turns intent into Burp actions and works the target autonomously.",
    { x: 0.72, y: 1.28, w: 11.8, h: 0.5, fontFace: BF, fontSize: 14, color: MUTED });

  const prompts = [
    { tag: "01  ·  RECON & PLAN",
      body: "You are an authorized pentester. Using the Burp\nMCP tools, crawl http://localhost:8000, enumerate\nevery endpoint and parameter from proxy history,\nand map the attack surface. For each parameter,\nhypothesise the likely vuln class. Return a\nprioritised attack plan — do not exploit yet." },
    { tag: "02  ·  AUTONOMOUS EXPLOIT",
      body: "Work the plan autonomously. For each candidate:\ncraft a payload, send it via Burp Repeater through\nMCP, analyse the response, confirm or reject.\nChain findings (forge the session cookie, then\nreach /admin). Log every confirmed issue with\nrequest/response evidence and a CVSS score." },
  ];
  const px = 0.7, py = 2.15, pw = 5.9, ph = 3.1, pgap = 0.53;
  prompts.forEach((pr, i) => {
    const x = px + i * (pw + pgap);
    s.addShape("roundRect", { x, y: py, w: pw, h: ph, rectRadius: 0.08, fill: { color: NAVY2 }, line: { color: "1E3F5E", width: 1 }, shadow: newShadow() });
    // header dots + tag
    s.addShape("oval", { x: x + 0.28, y: py + 0.27, w: 0.14, h: 0.14, fill: { color: CRIT }, line: { type: "none" } });
    s.addShape("oval", { x: x + 0.48, y: py + 0.27, w: 0.14, h: 0.14, fill: { color: MED }, line: { type: "none" } });
    s.addShape("oval", { x: x + 0.68, y: py + 0.27, w: 0.14, h: 0.14, fill: { color: "3FB57A" }, line: { type: "none" } });
    s.addText(pr.tag, { x: x + 1.0, y: py + 0.2, w: pw - 1.2, h: 0.3, fontFace: BF, fontSize: 11, bold: true, color: GOLD, charSpacing: 1 });
    s.addShape("line", { x: x + 0.28, y: py + 0.62, w: pw - 0.56, h: 0, line: { color: "1E3F5E", width: 1 } });
    s.addText([{ text: "> ", options: { color: GOLD } }, { text: pr.body, options: { color: "CFE7D6" } }],
      { x: x + 0.3, y: py + 0.72, w: pw - 0.55, h: ph - 0.9, fontFace: MONO, fontSize: 11.5, lineSpacing: 15, valign: "top" });
  });

  // outcome strip
  s.addShape("roundRect", { x: 0.7, y: 5.55, w: 11.93, h: 1.35, rectRadius: 0.08, fill: { color: CARD }, line: { type: "none" } });
  const outs = [
    { k: "⚙", t: "Burp drives real traffic", d: "Repeater, Intruder & Scanner via MCP" },
    { k: "↻", t: "Iterates on its own", d: "Reads each response, adapts the next payload" },
    { k: "≡", t: "Report on demand", d: "“Compile findings into a report” → done" },
  ];
  outs.forEach((o, i) => {
    const x = 0.95 + i * 3.95;
    s.addText(o.k, { x, y: 5.72, w: 0.6, h: 0.95, align: "center", valign: "middle", fontFace: BF, fontSize: 28, color: GOLD });
    s.addText(o.t, { x: x + 0.62, y: 5.82, w: 3.15, h: 0.35, fontFace: HF, fontSize: 14, bold: true, color: WHITE });
    s.addText(o.d, { x: x + 0.62, y: 6.16, w: 3.2, h: 0.55, fontFace: BF, fontSize: 10.5, color: MUTED, lineSpacing: 12 });
  });

  s.addNotes("This is the 'wow' slide. Read prompt 01 aloud, then prompt 02. Emphasize: no scripting, no manual clicking — plain-English intent, and the agent chains findings (e.g., forges the weak session cookie then walks into /admin). The report is literally one more sentence.");
})();

// ============================================================= SLIDE 4  (comparison)
(() => {
  const s = p.addSlide();
  s.background = { color: ICE };
  s.addText("Where Automated Scanners Stop, Claude Keeps Going", { x: 0.7, y: 0.5, w: 12.3, h: 0.7, fontFace: HF, fontSize: 30, bold: true, color: NAVY });
  s.addText("A DAST scanner (e.g. Burp's automated Scanner) fires known signatures. Claude reasons about context and business logic — then drives Burp's Proxy, Repeater and Intruder to prove it.",
    { x: 0.72, y: 1.2, w: 11.9, h: 0.6, fontFace: BF, fontSize: 13.5, color: SLATE });

  // column geometry
  const capX = 0.7, capW = 4.15;
  const scX = 5.0, scW = 3.75;
  const clX = 8.95, clW = 3.68;
  const headY = 1.95, headH = 0.5;

  // column headers
  s.addShape("roundRect", { x: scX, y: headY, w: scW, h: headH, rectRadius: 0.06, fill: { color: "8496A6" }, line: { type: "none" } });
  s.addText("AUTOMATED SCANNER", { x: scX, y: headY, w: scW, h: headH, align: "center", valign: "middle", fontFace: BF, fontSize: 12.5, bold: true, color: WHITE, charSpacing: 1 });
  s.addShape("roundRect", { x: clX, y: headY, w: clW, h: headH, rectRadius: 0.06, fill: { color: NAVY }, line: { type: "none" }, shadow: newShadow() });
  s.addText([{ text: "CLAUDE ", options: { color: GOLD } }, { text: "· AGENTIC + BURP", options: { color: WHITE } }],
    { x: clX, y: headY, w: clW, h: headH, align: "center", valign: "middle", fontFace: BF, fontSize: 12.5, bold: true, charSpacing: 1 });

  const rows = [
    { cap: "Business-logic flaws",  sub: "PNR + last-name bypass, price tampering",
      sc: "Blind to intent", cl: "Reasons about intent" },
    { cap: "Multi-step exploit chains", sub: "forge cookie → /admin → RCE",
      sc: "Tests inputs in isolation", cl: "Chains findings end-to-end" },
    { cap: "Broken access control / IDOR", sub: "who owns which booking?",
      sc: "Can't infer ownership", cl: "Understands object ownership" },
    { cap: "False-positive triage", sub: "is this really exploitable?",
      sc: "Noisy — needs a human", cl: "Confirms with real evidence" },
    { cap: "Custom / stateful auth", sub: "multi-step login & sessions",
      sc: "Breaks on unusual flows", cl: "Follows the flow like a user" },
    { cap: "Remediation & reporting", sub: "developer-ready fixes",
      sc: "Generic boilerplate", cl: "Code-level, contextual fixes" },
  ];
  const rY = headY + headH + 0.14, rH = 0.6, rGap = 0.07;
  rows.forEach((r, i) => {
    const y = rY + i * (rH + rGap);
    // capability label
    s.addText([{ text: r.cap + "\n", options: { bold: true, color: NAVY, fontSize: 13 } },
               { text: r.sub, options: { color: SLATE, fontSize: 9.5, italic: true } }],
      { x: capX, y, w: capW, h: rH, valign: "middle", fontFace: BF, lineSpacing: 13 });
    // scanner cell
    s.addShape("roundRect", { x: scX, y, w: scW, h: rH, rectRadius: 0.06, fill: { color: "EEF1F4" }, line: { color: LINE, width: 1 } });
    s.addShape("oval", { x: scX + 0.18, y: y + rH/2 - 0.16, w: 0.32, h: 0.32, fill: { color: CRIT }, line: { type: "none" } });
    s.addText("✕", { x: scX + 0.18, y: y + rH/2 - 0.16, w: 0.32, h: 0.32, align: "center", valign: "middle", fontFace: BF, fontSize: 13, bold: true, color: WHITE });
    s.addText(r.sc, { x: scX + 0.62, y, w: scW - 0.7, h: rH, valign: "middle", fontFace: BF, fontSize: 11.5, color: "4A5866" });
    // claude cell
    s.addShape("roundRect", { x: clX, y, w: clW, h: rH, rectRadius: 0.06, fill: { color: "FBF3DF" }, line: { color: "EAD9A8", width: 1 } });
    s.addShape("oval", { x: clX + 0.18, y: y + rH/2 - 0.16, w: 0.32, h: 0.32, fill: { color: "1A8A5A" }, line: { type: "none" } });
    s.addText("✓", { x: clX + 0.18, y: y + rH/2 - 0.16, w: 0.32, h: 0.32, align: "center", valign: "middle", fontFace: BF, fontSize: 13, bold: true, color: WHITE });
    s.addText(r.cl, { x: clX + 0.62, y, w: clW - 0.7, h: rH, valign: "middle", fontFace: BF, fontSize: 11.5, bold: true, color: NAVY });
  });

  // better-together footer
  const fy = rY + rows.length * (rH + rGap) + 0.05;
  s.addShape("roundRect", { x: 0.7, y: fy, w: 11.93, h: 0.62, rectRadius: 0.08, fill: { color: NAVY }, line: { type: "none" } });
  s.addText([
    { text: "Better together:  ", options: { color: GOLD, bold: true } },
    { text: "scanners give breadth & regression; Claude adds depth, logic and chaining — driving Burp to validate every finding.", options: { color: WHITE } },
  ], { x: 1.0, y: fy, w: 11.4, h: 0.62, valign: "middle", fontFace: BF, fontSize: 12.5 });

  s.addNotes("The killer slide for technical buyers. Automated scanners are pattern-matchers — great at known signatures, blind to logic. The four things they can't do: business-logic flaws, multi-step chaining, access-control/IDOR reasoning, and triage. Claude does all four and uses Burp as its hands. Message: not a replacement for scanners — a force multiplier that closes the logic gap.");
})();

// ============================================================= SLIDE 5  (results)
(() => {
  const s = p.addSlide();
  s.background = { color: ICE };
  s.addText("Results: 13 Findings, Minutes Not Days", { x: 0.7, y: 0.55, w: 12.2, h: 0.7, fontFace: HF, fontSize: 32, bold: true, color: NAVY });
  s.addText("A single agentic run against SkyHaven surfaced issues across five OWASP Top 10 categories — each with evidence and a fix.",
    { x: 0.72, y: 1.26, w: 11.8, h: 0.5, fontFace: BF, fontSize: 14, color: SLATE });

  // stat callouts (left column)
  const stats = [
    { n: "13", l: "Total findings", c: NAVY },
    { n: "3", l: "Critical (RCE + SQLi)", c: CRIT },
    { n: "5", l: "OWASP categories hit", c: GOLDD },
    { n: "~90%", l: "Testing time saved", c: "1A8A5A" },
  ];
  stats.forEach((st, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.7 + col * 2.95, y = 2.15 + row * 1.75;
    s.addShape("roundRect", { x, y, w: 2.75, h: 1.55, rectRadius: 0.08, fill: { color: WHITE }, line: { color: LINE, width: 1 }, shadow: newShadow() });
    s.addText(st.n, { x: x + 0.05, y: y + 0.18, w: 2.65, h: 0.8, align: "center", fontFace: HF, fontSize: 42, bold: true, color: st.c });
    s.addText(st.l, { x: x + 0.1, y: y + 1.02, w: 2.55, h: 0.45, align: "center", fontFace: BF, fontSize: 11.5, color: SLATE });
  });

  // severity doughnut (right)
  s.addChart(p.ChartType.doughnut, [{
    name: "Severity", labels: ["Critical", "High", "Medium", "Low"], values: [3, 5, 2, 3],
  }], {
    x: 6.75, y: 2.05, w: 3.15, h: 3.35, holeSize: 58,
    chartColors: [CRIT, HIGH, MED, LOW],
    showTitle: true, title: "Findings by severity", titleColor: NAVY, titleFontFace: HF, titleFontSize: 13,
    showLegend: true, legendPos: "b", legendColor: SLATE, legendFontFace: BF, legendFontSize: 10,
    showValue: true, dataLabelColor: WHITE, dataLabelFontFace: BF, dataLabelFontSize: 11, dataLabelFontBold: true,
  });

  // top findings list (far right)
  s.addText("Confirmed highlights", { x: 10.05, y: 2.15, w: 3, h: 0.35, fontFace: HF, fontSize: 14, bold: true, color: NAVY });
  const finds = [
    ["CRIT", "OS command injection → RCE", CRIT],
    ["CRIT", "SQLi auth bypass (login)", CRIT],
    ["CRIT", "UNION SQLi data exfiltration", CRIT],
    ["HIGH", "Forgeable session → admin", HIGH],
    ["HIGH", "IDOR on bookings", HIGH],
    ["HIGH", "Plaintext creds via open API", HIGH],
    ["MED", "Reflected & stored XSS", MED],
  ];
  finds.forEach((f, i) => {
    const y = 2.6 + i * 0.53;
    s.addShape("roundRect", { x: 10.05, y, w: 0.72, h: 0.34, rectRadius: 0.05, fill: { color: f[2] }, line: { type: "none" } });
    s.addText(f[0], { x: 10.05, y, w: 0.72, h: 0.34, align: "center", valign: "middle", fontFace: BF, fontSize: 8.5, bold: true, color: WHITE });
    s.addText(f[1], { x: 10.85, y: y - 0.02, w: 2.45, h: 0.4, valign: "middle", fontFace: BF, fontSize: 11, color: NAVY2 });
  });

  // value footer band
  s.addShape("roundRect", { x: 0.7, y: 6.35, w: 11.93, h: 0.72, rectRadius: 0.08, fill: { color: NAVY }, line: { type: "none" } });
  s.addText([
    { text: "Takeaway:  ", options: { color: GOLD, bold: true } },
    { text: "agentic AI compresses a multi-day web pentest into a guided, evidence-backed run — consistent, repeatable, and reportable in one sitting.", options: { color: WHITE } },
  ], { x: 1.0, y: 6.35, w: 11.4, h: 0.72, valign: "middle", fontFace: BF, fontSize: 13 });

  s.addText("Prepared by Balaji Pedapolu  ·  SkyHaven Airways Security Assessment  ·  2026", { x: 0.7, y: 7.12, w: 11.9, h: 0.3, align: "center", fontFace: BF, fontSize: 9.5, color: SLATE });

  s.addNotes("Land the value: 13 findings across 5 OWASP categories, 3 critical including full RCE. Doughnut shows severity mix. The point for the customer: this is not a toy — it's a force multiplier that turns days of manual testing into a repeatable, evidence-backed run, with a human reviewing the output.");
})();

p.writeFile({ fileName: "SkyHaven_Agentic_Pentest.pptx" }).then(f => console.log("WROTE", f));
