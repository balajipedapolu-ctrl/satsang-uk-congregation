"""
Shared HTML layout + CSS for the SkyHaven Airways demo.
Kept separate so the page markup in server.py stays readable.

NOTE: This is an intentionally vulnerable teaching app. Do NOT copy this
markup into production — several templates concatenate untrusted input on
purpose (see VULNERABILITIES.md).
"""

CSS = """
:root{
  --navy:#0a2540; --navy2:#123a5e; --gold:#e6b34d; --gold2:#c8952f;
  --sky:#1a73e8; --ink:#1a2b3c; --muted:#5b6b7b; --line:#e3e9f0;
  --bg:#f5f8fc; --card:#ffffff; --ok:#1a8a5a; --danger:#d64545;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{font-family:'Inter','Segoe UI',system-ui,-apple-system,sans-serif;
  color:var(--ink);background:var(--bg);line-height:1.55;font-size:15px}
a{color:var(--sky);text-decoration:none}
a:hover{text-decoration:underline}
.container{max-width:1140px;margin:0 auto;padding:0 22px}

/* top bar */
.topbar{background:var(--navy);color:#cfe0f2;font-size:12.5px}
.topbar .container{display:flex;justify-content:space-between;padding:7px 22px}
.topbar a{color:#cfe0f2}

/* header / nav */
header.main{background:#fff;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:50}
.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 22px}
.brand{display:flex;align-items:center;gap:11px;font-weight:800;font-size:21px;color:var(--navy)}
.brand .logo{width:38px;height:38px;border-radius:9px;
  background:linear-gradient(135deg,var(--navy),var(--sky));display:grid;place-items:center;
  color:#fff;font-size:20px;box-shadow:0 4px 12px rgba(10,37,64,.25)}
.brand small{display:block;font-size:10.5px;font-weight:600;letter-spacing:2px;color:var(--gold2)}
nav.links a{color:var(--ink);font-weight:600;margin-left:22px;font-size:14px}
nav.links a:hover{color:var(--sky);text-decoration:none}
.nav-cta{background:var(--gold);color:#3a2a00;padding:9px 16px;border-radius:8px;font-weight:700}
.nav-cta:hover{background:var(--gold2);text-decoration:none}

/* hero */
.hero{background:linear-gradient(120deg,var(--navy) 0%,var(--navy2) 55%,#1c4e7a 100%);
  color:#fff;position:relative;overflow:hidden}
.hero:after{content:"";position:absolute;right:-120px;top:-80px;width:520px;height:520px;
  background:radial-gradient(circle,rgba(230,179,77,.20),transparent 62%)}
.hero .container{padding:64px 22px 96px;position:relative;z-index:2}
.hero h1{font-size:44px;line-height:1.12;margin:0 0 14px;font-weight:800;letter-spacing:-.5px}
.hero p.sub{font-size:18px;color:#d3e2f3;max-width:560px;margin:0 0 6px}
.badge{display:inline-block;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);
  padding:5px 13px;border-radius:30px;font-size:12.5px;margin-bottom:18px;letter-spacing:.4px}

/* search widget */
.search-card{background:#fff;border-radius:16px;box-shadow:0 20px 50px rgba(10,37,64,.22);
  padding:22px;margin-top:30px;color:var(--ink)}
.trip-tabs{display:flex;gap:8px;margin-bottom:16px}
.trip-tabs span{padding:7px 15px;border-radius:20px;font-size:13px;font-weight:600;cursor:pointer;
  background:#eef3f9;color:var(--muted)}
.trip-tabs span.active{background:var(--navy);color:#fff}
.search-grid{display:grid;grid-template-columns:1.2fr 1.2fr 1fr 1fr auto;gap:12px;align-items:end}
.field label{display:block;font-size:11.5px;font-weight:700;color:var(--muted);
  text-transform:uppercase;letter-spacing:.6px;margin-bottom:5px}
.field input,.field select{width:100%;padding:11px 12px;border:1px solid var(--line);
  border-radius:9px;font-size:14px;background:#fbfdff}
.field input:focus{outline:none;border-color:var(--sky);background:#fff}
.btn{background:var(--gold);color:#3a2a00;border:none;padding:12px 22px;border-radius:9px;
  font-weight:800;font-size:15px;cursor:pointer;white-space:nowrap}
.btn:hover{background:var(--gold2)}
.btn-navy{background:var(--navy);color:#fff}
.btn-navy:hover{background:var(--navy2)}
.btn-block{width:100%}

/* generic sections */
section{padding:52px 0}
.section-head{text-align:center;max-width:640px;margin:0 auto 34px}
.section-head h2{font-size:30px;margin:0 0 8px;color:var(--navy);font-weight:800}
.section-head p{color:var(--muted);margin:0}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden;
  transition:transform .15s, box-shadow .15s}
.card:hover{transform:translateY(-4px);box-shadow:0 14px 34px rgba(10,37,64,.12)}
.card .thumb{height:150px;background-size:cover;background-position:center;position:relative}
.card .thumb .price{position:absolute;bottom:10px;right:10px;background:#fff;color:var(--navy);
  font-weight:800;padding:5px 11px;border-radius:8px;font-size:14px;box-shadow:0 3px 10px rgba(0,0,0,.15)}
.card .body{padding:15px 17px}
.card .body h3{margin:0 0 3px;font-size:17px;color:var(--navy)}
.card .body .route{color:var(--muted);font-size:13px;margin-bottom:9px}
.feature{text-align:center;padding:8px}
.feature .ic{width:56px;height:56px;border-radius:14px;background:#eaf1fb;color:var(--sky);
  display:grid;place-items:center;font-size:25px;margin:0 auto 13px}
.feature h3{margin:0 0 6px;font-size:17px;color:var(--navy)}
.feature p{color:var(--muted);font-size:13.5px;margin:0}

/* panels / forms */
.panel{background:#fff;border:1px solid var(--line);border-radius:14px;padding:26px;
  max-width:440px;margin:40px auto;box-shadow:0 8px 28px rgba(10,37,64,.08)}
.panel h2{margin:0 0 6px;color:var(--navy)}
.panel .lead{color:var(--muted);margin:0 0 20px;font-size:14px}
.form-row{margin-bottom:15px}
.form-row label{display:block;font-size:13px;font-weight:700;color:var(--ink);margin-bottom:6px}
.form-row input,.form-row select,.form-row textarea{width:100%;padding:11px 12px;
  border:1px solid var(--line);border-radius:9px;font-size:14px;background:#fbfdff}
.note{background:#fff8e8;border:1px solid #f0dca6;color:#7a5c10;padding:11px 14px;
  border-radius:9px;font-size:13px;margin-bottom:16px}
.alert{padding:11px 14px;border-radius:9px;font-size:13.5px;margin-bottom:16px}
.alert.err{background:#fdeaea;border:1px solid #f3c4c4;color:#a12b2b}
.alert.ok{background:#e8f7ef;border:1px solid #b6e6cc;color:#12603f}

/* tables */
table.data{width:100%;border-collapse:collapse;background:#fff;border:1px solid var(--line);
  border-radius:12px;overflow:hidden;font-size:13.5px}
table.data th{background:var(--navy);color:#fff;text-align:left;padding:11px 13px;font-size:12.5px;
  text-transform:uppercase;letter-spacing:.5px}
table.data td{padding:11px 13px;border-top:1px solid var(--line)}
table.data tr:hover td{background:#f7fafd}
.pill{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11.5px;font-weight:700}
.pill.ok{background:#e8f7ef;color:var(--ok)}
.pill.warn{background:#fff2df;color:#a5701a}

/* flight list rows */
.flight{display:flex;align-items:center;justify-content:space-between;background:#fff;
  border:1px solid var(--line);border-radius:13px;padding:18px 22px;margin-bottom:14px}
.flight:hover{box-shadow:0 8px 22px rgba(10,37,64,.09)}
.flight .leg{display:flex;align-items:center;gap:20px}
.flight .code{font-weight:800;color:var(--navy);font-size:15px}
.flight .time{font-size:22px;font-weight:800;color:var(--ink)}
.flight .city{font-size:12.5px;color:var(--muted)}
.flight .arrow{color:var(--gold2);font-size:20px}
.flight .price{font-size:23px;font-weight:800;color:var(--navy)}
.flight .price small{display:block;font-size:11px;color:var(--muted);font-weight:600}

/* footer */
footer{background:var(--navy);color:#a9c2dc;margin-top:20px}
footer .container{padding:44px 22px 26px}
.fgrid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:26px}
footer h4{color:#fff;font-size:14px;margin:0 0 14px;letter-spacing:.5px}
footer a{color:#a9c2dc;display:block;margin-bottom:8px;font-size:13.5px}
footer a:hover{color:#fff;text-decoration:none}
.fbrand{font-weight:800;font-size:19px;color:#fff;margin-bottom:10px}
.fbot{border-top:1px solid rgba(255,255,255,.12);margin-top:28px;padding-top:18px;
  display:flex;justify-content:space-between;font-size:12.5px;color:#7f9bb8}
.labtag{background:#3a1414;color:#ffb4b4;border:1px solid #6b2020;padding:2px 9px;
  border-radius:6px;font-size:11px;font-weight:700}
@media(max-width:900px){.search-grid{grid-template-columns:1fr 1fr}
  .grid3,.grid4,.fgrid{grid-template-columns:1fr 1fr}.hero h1{font-size:32px}}
"""


def layout(title, body, user=None):
    """Wrap page `body` in the full chrome (nav + footer)."""
    if user:
        acct = (f'<a href="/account">Hi, {user["username"]}</a>'
                f'<a href="/logout">Logout</a>')
        if user.get("role") == "admin":
            acct = '<a href="/admin">Admin</a>' + acct
    else:
        acct = '<a href="/login">Sign in</a><a class="nav-cta" href="/register">Join SkyMiles</a>'

    return f"""<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} — SkyHaven Airways</title>
<style>{CSS}</style>
</head><body>
<div class="topbar"><div class="container">
  <span>&#9993; support@skyhaven-air.example &nbsp;|&nbsp; &#9742; 1-800-SKY-HAVN</span>
  <span><span class="labtag">PENTEST LAB</span> &nbsp; <a href="/manage">Manage Booking</a> &nbsp;|&nbsp; Web Check-in &nbsp;|&nbsp; Flight Status</span>
</div></div>
<header class="main"><div class="nav">
  <a class="brand" href="/">
    <span class="logo">&#9992;</span>
    <span>SkyHaven<small>AIRWAYS</small></span>
  </a>
  <nav class="links">
    <a href="/">Home</a>
    <a href="/flights">Book Flights</a>
    <a href="/manage">Manage Booking</a>
    <a href="/deals">Deals</a>
    <a href="/contact">Contact</a>
    {acct}
  </nav>
</div></header>
{body}
<footer><div class="container">
  <div class="fgrid">
    <div>
      <div class="fbrand">&#9992; SkyHaven Airways</div>
      <p style="font-size:13.5px;max-width:280px">Connecting 120+ destinations across
      6 continents with award-winning service and the comfort you deserve.</p>
    </div>
    <div><h4>Book &amp; Manage</h4><a href="/flights">Search Flights</a>
      <a href="/deals">Special Deals</a><a href="/account">Manage Booking</a>
      <a href="/contact">Web Check-in</a></div>
    <div><h4>Company</h4><a href="#">About Us</a><a href="#">SkyMiles Loyalty</a>
      <a href="#">Careers</a><a href="#">Press</a></div>
    <div><h4>Support</h4><a href="/contact">Contact Us</a><a href="#">Baggage Policy</a>
      <a href="#">Refunds</a><a href="#">Privacy</a></div>
  </div>
  <div class="fbot">
    <span>&copy; 2026 SkyHaven Airways. Intentionally vulnerable training app.</span>
    <span>IATA: SH &nbsp; ICAO: SKH</span>
  </div>
  <div style="text-align:center;margin-top:14px;font-size:12.5px;color:#8fb0d0">
    Designed &amp; developed by <b style="color:#fff">Balaji Pedapolu</b>
    &nbsp;&middot;&nbsp; Security Training Platform
  </div>
</div></footer>
</body></html>"""
