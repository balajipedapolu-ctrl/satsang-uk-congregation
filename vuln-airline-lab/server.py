#!/usr/bin/env python3
"""
SkyHaven Airways — intentionally vulnerable airline web app for
AUTHORIZED security training / pentest practice ONLY.

Run:   python3 server.py         (then open http://localhost:8000)

Every vulnerability is deliberate and documented in VULNERABILITIES.md.
Do NOT deploy this on a public/production network. Zero external deps —
Python 3.8+ standard library only (http.server + sqlite3).
"""
import base64
import html
import http.cookies
import json
import os
import sqlite3
import subprocess
import urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

from theme import layout

DB = os.path.join(os.path.dirname(__file__), "skyhaven.db")
# Bind to loopback only: this app is deliberately exploitable (live RCE via
# the diagnostics endpoint), so it must never be reachable off your machine.
HOST, PORT = "127.0.0.1", 8000

DEST_IMG = {
    "Dubai":   "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=70",
    "London":  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=70",
    "Paris":   "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=70",
    "Singapore":"https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=70",
    "New York":"https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=70",
    "Tokyo":   "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=70",
}


# --------------------------------------------------------------------------
# Database bootstrap (recreated fresh on each start for a clean lab)
# --------------------------------------------------------------------------
def init_db():
    if os.path.exists(DB):
        os.remove(DB)
    c = sqlite3.connect(DB)
    c.executescript("""
    CREATE TABLE users(
        id INTEGER PRIMARY KEY, username TEXT, password TEXT, email TEXT,
        fullname TEXT, role TEXT, skymiles INTEGER, credit_card TEXT);
    CREATE TABLE flights(
        id INTEGER PRIMARY KEY, code TEXT, origin TEXT, dest TEXT,
        depart TEXT, arrive TEXT, price INTEGER, seats INTEGER, aircraft TEXT);
    CREATE TABLE bookings(
        id INTEGER PRIMARY KEY, ref TEXT, user_id INTEGER, flight_id INTEGER,
        passenger TEXT, seat TEXT, status TEXT);
    CREATE TABLE messages(
        id INTEGER PRIMARY KEY, name TEXT, email TEXT, body TEXT);
    """)
    users = [
        (1,"admin","Sh@dow-Adm1n-2026","admin@skyhaven-air.example","System Administrator","admin",999999,"4485-1102-9931-7788"),
        (2,"j.walker","password123","john.walker@gmail.com","John Walker","user",4200,"5500-2841-7712-0043"),
        (3,"s.mehta","sunshine","sneha.mehta@yahoo.com","Sneha Mehta","user",18750,"4111-3320-8890-1234"),
        (4,"m.chen","dragon88","ming.chen@outlook.com","Ming Chen","user",760,"6011-7781-2234-9902"),
        (5,"guest","guest","guest@skyhaven-air.example","Guest User","user",0,"0000-0000-0000-0000"),
    ]
    c.executemany("INSERT INTO users VALUES(?,?,?,?,?,?,?,?)", users)
    flights = [
        (1,"SH201","London","Dubai","2026-08-02 09:15","2026-08-02 19:40",489,42,"Boeing 777-300ER"),
        (2,"SH208","Dubai","London","2026-08-02 22:10","2026-08-03 02:55",512,17,"Boeing 777-300ER"),
        (3,"SH415","London","New York","2026-08-05 11:00","2026-08-05 14:05",640,8,"Airbus A350-900"),
        (4,"SH330","Paris","Singapore","2026-08-07 13:25","2026-08-08 07:50",905,55,"Airbus A380-800"),
        (5,"SH772","Singapore","Tokyo","2026-08-09 08:00","2026-08-09 15:35",388,31,"Boeing 787-9"),
        (6,"SH119","New York","London","2026-08-11 20:30","2026-08-12 08:10",598,23,"Airbus A350-900"),
        (7,"SH540","Tokyo","Dubai","2026-08-13 01:15","2026-08-13 07:25",712,40,"Boeing 777-300ER"),
        (8,"SH222","Dubai","Paris","2026-08-15 03:40","2026-08-15 08:55",560,12,"Airbus A380-800"),
    ]
    c.executemany("INSERT INTO flights VALUES(?,?,?,?,?,?,?,?,?)", flights)
    bookings = [
        (1,"SKH7F2A9",2,1,"John Walker","14C","Confirmed"),
        (2,"SKH3B8K1",3,4,"Sneha Mehta","02A","Confirmed"),
        (3,"SKH9QW44",3,5,"Sneha Mehta","31F","Checked-in"),
        (4,"SKHZ1X07",4,6,"Ming Chen","19D","Confirmed"),
    ]
    c.executemany("INSERT INTO bookings VALUES(?,?,?,?,?,?,?)", bookings)
    c.executemany("INSERT INTO messages VALUES(?,?,?,?)", [
        (1,"Priya R.","priya@example.com","Loved the extra legroom on SH330. Will fly again!"),
    ])
    c.commit()
    c.close()


def db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn


# --------------------------------------------------------------------------
# Session handling  —  INTENTIONALLY WEAK (see VULNERABILITIES.md #7)
# The "session" cookie is just base64(json) the client fully controls.
# Flip "role":"admin" and you're an admin. No signature, no server state.
# --------------------------------------------------------------------------
def make_session(user):
    raw = json.dumps({"uid": user["id"], "username": user["username"],
                      "role": user["role"]}).encode()
    return base64.b64encode(raw).decode()


def read_session(cookie_header):
    if not cookie_header:
        return None
    jar = http.cookies.SimpleCookie(cookie_header)
    if "session" not in jar:
        return None
    try:
        return json.loads(base64.b64decode(jar["session"].value))
    except Exception:
        return None


# --------------------------------------------------------------------------
# Page fragments
# --------------------------------------------------------------------------
def home_page():
    conn = db()
    deals = conn.execute("SELECT * FROM flights ORDER BY price LIMIT 4").fetchall()
    conn.close()
    cards = ""
    for f in deals:
        img = DEST_IMG.get(f["dest"], "")
        cards += f"""
        <div class="card">
          <div class="thumb" style="background-image:url('{img}')">
            <span class="price">${f['price']}</span></div>
          <div class="body">
            <h3>{f['dest']}</h3>
            <div class="route">{f['code']} &middot; {f['origin']} &rarr; {f['dest']}</div>
            <a class="btn btn-navy" style="display:inline-block;padding:8px 16px;font-size:13px"
               href="/flights?from={urllib.parse.quote(f['origin'])}&to={urllib.parse.quote(f['dest'])}">
               View flight</a>
          </div></div>"""

    body = f"""
    <div class="hero"><div class="container">
      <span class="badge">&#11088; Rated #1 for onboard comfort — SkyAward 2026</span>
      <h1>Fly Beyond<br>the Horizon.</h1>
      <p class="sub">Premium cabins, generous SkyMiles and fares that don't cost the earth.
      Book across 120+ destinations in seconds.</p>

      <div class="search-card">
        <div class="trip-tabs"><span class="active">Round trip</span>
          <span>One way</span><span>Multi-city</span></div>
        <form action="/flights" method="get">
        <div class="search-grid">
          <div class="field"><label>From</label>
            <input name="from" placeholder="City or airport" value="London"></div>
          <div class="field"><label>To</label>
            <input name="to" placeholder="City or airport" value="Dubai"></div>
          <div class="field"><label>Depart</label><input type="date" value="2026-08-02"></div>
          <div class="field"><label>Passengers</label>
            <select><option>1 Adult</option><option>2 Adults</option><option>Family</option></select></div>
          <div class="field"><button class="btn" type="submit">Search &#9992;</button></div>
        </div></form>
      </div>
    </div></div>

    <section><div class="container">
      <div class="section-head"><h2>Featured Fares</h2>
        <p>Hand-picked routes with our lowest available prices this week.</p></div>
      <div class="grid4">{cards}</div>
    </div></section>

    <section style="background:#fff"><div class="container">
      <div class="section-head"><h2>Why fly SkyHaven</h2>
        <p>Little things that make a big difference at 38,000 feet.</p></div>
      <div class="grid4">
        <div class="feature"><div class="ic">&#128188;</div><h3>Flat-bed Business</h3>
          <p>Fully lie-flat suites with direct aisle access on every widebody.</p></div>
        <div class="feature"><div class="ic">&#127869;</div><h3>Chef-curated Dining</h3>
          <p>Regional menus designed with Michelin-starred partner kitchens.</p></div>
        <div class="feature"><div class="ic">&#127918;</div><h3>4K Entertainment</h3>
          <p>1,200+ hours of movies, shows and live TV on 4K seat-back screens.</p></div>
        <div class="feature"><div class="ic">&#9992;</div><h3>Earn SkyMiles</h3>
          <p>Up to 3x miles on every fare, redeemable for upgrades and flights.</p></div>
      </div>
    </div></section>
    """
    return body


def flights_page(params):
    frm = params.get("from", [""])[0]
    to = params.get("to", [""])[0]
    q = params.get("q", [""])[0]

    conn = db()
    # -- VULN #1 & #2: SQL injection. Search terms are concatenated straight
    # into the query. Try  from=London' OR '1'='1  or a UNION SELECT.
    where = "1=1"
    if frm:
        where += f" AND origin LIKE '%{frm}%'"
    if to:
        where += f" AND dest LIKE '%{to}%'"
    if q:
        where += f" AND (code LIKE '%{q}%' OR aircraft LIKE '%{q}%')"
    sql = f"SELECT * FROM flights WHERE {where} ORDER BY depart"
    try:
        rows = conn.execute(sql).fetchall()
        err = None
    except Exception as e:
        rows, err = [], str(e)   # VULN #12: verbose SQL errors leaked to user
    conn.close()

    # -- VULN #3: reflected XSS. The raw search terms are echoed unescaped.
    heading = f"Flights"
    if frm or to:
        heading += f": {frm or 'Anywhere'} &rarr; {to or 'Anywhere'}"

    result = ""
    if err:
        result += (f'<div class="alert err"><b>Query error:</b> {err}<br>'
                   f'<code style="font-size:12px">{sql}</code></div>')
    if not rows and not err:
        result += '<div class="alert err">No flights matched your search.</div>'
    for f in rows:
        result += f"""
        <div class="flight">
          <div class="leg">
            <div><div class="code">{f['code']}</div>
              <div class="city" style="font-size:11px">{f['aircraft']}</div></div>
            <div><div class="time">{f['depart'][11:]}</div>
              <div class="city">{f['origin']}</div></div>
            <div class="arrow">&#8594;</div>
            <div><div class="time">{f['arrive'][11:]}</div>
              <div class="city">{f['dest']}</div></div>
          </div>
          <div style="text-align:right">
            <div class="price">${f['price']}<small>{f['seats']} seats left</small></div>
            <form action="/book" method="post" style="margin-top:6px">
              <input type="hidden" name="flight_id" value="{f['id']}">
              <button class="btn btn-navy" style="padding:8px 16px;font-size:13px">Select</button>
            </form>
          </div></div>"""

    body = f"""
    <div class="hero" style="padding:0"><div class="container" style="padding:34px 22px 40px">
      <h1 style="font-size:28px;margin:0">{heading}</h1>
      <form action="/flights" method="get" style="margin-top:18px">
        <div class="search-card" style="margin-top:0">
        <div class="search-grid">
          <div class="field"><label>From</label><input name="from" value="{frm}"></div>
          <div class="field"><label>To</label><input name="to" value="{to}"></div>
          <div class="field"><label>Flight / aircraft</label>
            <input name="q" value="{q}" placeholder="e.g. SH201 or A350"></div>
          <div class="field"><label>&nbsp;</label>
            <button class="btn" type="submit">Search &#9992;</button></div>
        </div></div>
      </form>
    </div></div>
    <section><div class="container">{result}</div></section>
    """
    return body


def deals_page():
    conn = db()
    fs = conn.execute("SELECT * FROM flights ORDER BY price").fetchall()
    conn.close()
    cards = ""
    for f in fs:
        img = DEST_IMG.get(f["dest"], "")
        cards += f"""<div class="card"><div class="thumb" style="background-image:url('{img}')">
          <span class="price">${f['price']}</span></div><div class="body">
          <h3>{f['origin']} &rarr; {f['dest']}</h3>
          <div class="route">{f['code']} &middot; {f['aircraft']}</div>
          <a class="btn btn-navy" style="display:inline-block;padding:8px 16px;font-size:13px"
            href="/flights?from={urllib.parse.quote(f['origin'])}&to={urllib.parse.quote(f['dest'])}">Book now</a>
        </div></div>"""
    return f"""<section><div class="container">
      <div class="section-head"><h2>All Special Deals</h2>
        <p>Every live fare on the SkyHaven network, sorted by price.</p></div>
      <div class="grid3">{cards}</div></div></section>"""


def contact_page(sent=False, msgs=None):
    reviews = ""
    for m in (msgs or []):
        # -- VULN #4: stored XSS. Message body is rendered without escaping,
        # so <script> submitted via the form executes for every viewer.
        reviews += (f'<div class="card" style="padding:15px 18px;margin-bottom:12px">'
                    f'<b style="color:var(--navy)">{m["name"]}</b>'
                    f'<p style="margin:6px 0 0;color:var(--muted)">{m["body"]}</p></div>')
    ok = '<div class="alert ok">Thanks! Your message has been posted.</div>' if sent else ""
    return f"""<section><div class="container" style="max-width:760px">
      <div class="section-head"><h2>Contact &amp; Reviews</h2>
        <p>Questions, feedback or a shout-out for our crew — drop us a line.</p></div>
      {ok}
      <div class="panel" style="max-width:none;margin:0 0 30px">
        <form action="/contact" method="post">
          <div class="form-row"><label>Name</label><input name="name" required></div>
          <div class="form-row"><label>Email</label><input name="email" type="email"></div>
          <div class="form-row"><label>Message</label>
            <textarea name="body" rows="4" required></textarea></div>
          <button class="btn btn-navy btn-block">Post message</button>
        </form>
      </div>
      <h3 style="color:var(--navy)">Recent traveller reviews</h3>
      {reviews}
    </div></section>"""


def manage_form(msg="", pnr="", lastname=""):
    alert = f'<div class="alert err">{msg}</div>' if msg else ""
    return f"""<section><div class="container" style="max-width:640px">
      <div class="section-head"><h2>Manage Your Booking</h2>
        <p>Retrieve your trip to view details, check in, or download your
        boarding pass. Enter your booking reference (PNR) and last name.</p></div>
      <div class="panel" style="max-width:none;margin:0">
        {alert}
        <div class="note">Try PNR <b>SKH7F2A9</b> with last name <b>Walker</b>.</div>
        <form method="post" action="/manage">
          <div class="form-row"><label>Booking reference (PNR)</label>
            <input name="pnr" value="{html.escape(pnr)}" placeholder="e.g. SKH7F2A9"
              style="text-transform:uppercase;letter-spacing:2px;font-weight:700" required></div>
          <div class="form-row"><label>Passenger last name</label>
            <input name="lastname" value="{html.escape(lastname)}" placeholder="e.g. Walker" required></div>
          <button class="btn btn-navy btn-block">Retrieve booking &#9992;</button>
        </form>
        <p style="text-align:center;margin:16px 0 0;font-size:13px;color:var(--muted)">
          A six-character PNR is on your confirmation email and e-ticket.</p>
      </div>
    </div></section>"""


def manage_result(b):
    """Retrieved-booking view for the Manage Booking flow."""
    return f"""<section><div class="container" style="max-width:720px">
      <div class="section-head" style="margin-bottom:20px"><h2>Your Booking</h2>
        <p>Reference retrieved successfully.</p></div>
      <div class="card" style="padding:0;overflow:hidden">
        <div style="background:var(--navy);color:#fff;padding:22px 26px;display:flex;
             justify-content:space-between;align-items:center">
          <div><div style="font-size:12px;letter-spacing:2px;color:var(--gold)">BOOKING REFERENCE (PNR)</div>
            <div style="font-size:28px;font-weight:800">{b['ref']}</div></div>
          <span class="pill ok" style="font-size:13px">{b['status']}</span></div>
        <div style="padding:26px">
          <div style="display:flex;justify-content:space-between;margin-bottom:20px">
            <div><div class="city">Passenger</div><b>{b['passenger']}</b></div>
            <div><div class="city">Flight</div><b>{b['code']}</b></div>
            <div><div class="city">Seat</div><b>{b['seat']}</b></div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;
               border-top:1px solid var(--line);padding-top:20px">
            <div><div class="time">{b['depart'][11:]}</div><b>{b['origin']}</b>
              <div class="city">{b['depart'][:10]}</div></div>
            <div style="text-align:center;color:var(--gold2)">
              <div>&#9992;</div><div class="city">{b['aircraft']}</div></div>
            <div style="text-align:right"><div class="time">{b['arrive'][11:]}</div><b>{b['dest']}</b>
              <div class="city">{b['arrive'][:10]}</div></div>
          </div>
          <div style="margin-top:22px;display:flex;gap:10px">
            <a class="btn btn-navy" href="/download?file={b['ref']}.txt">Download boarding pass</a>
            <a class="btn" href="/manage">Look up another</a>
          </div>
        </div></div></div></section>"""


# --------------------------------------------------------------------------
# HTTP handler
# --------------------------------------------------------------------------
class App(BaseHTTPRequestHandler):
    server_version = "SkyHaven/1.0"  # VULN: banner/version disclosure

    def log_message(self, fmt, *args):
        print("  ·", self.address_string(), fmt % args)

    # ---- helpers ----
    def sess(self):
        return read_session(self.headers.get("Cookie"))

    def user(self):
        s = self.sess()
        if not s:
            return None
        conn = db()
        u = conn.execute("SELECT * FROM users WHERE id=?", (s.get("uid"),)).fetchone()
        conn.close()
        if u:
            d = dict(u)
            d["role"] = s.get("role", d["role"])  # trust cookie role (weak!)
            return d
        return None

    def send_html(self, markup, status=200, cookie=None):
        self.send_response(status)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        # VULN #10: no security headers (no CSP, X-Frame-Options, HttpOnly, etc.)
        if cookie:
            self.send_header("Set-Cookie", cookie)
        self.end_headers()
        self.wfile.write(markup.encode())

    def send_json(self, obj, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(obj, indent=2).encode())

    def redirect(self, to, cookie=None):
        self.send_response(302)
        self.send_header("Location", to)
        if cookie:
            self.send_header("Set-Cookie", cookie)
        self.end_headers()

    def body_params(self):
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length).decode()
        return urllib.parse.parse_qs(raw)

    # ---- GET ----
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        params = urllib.parse.parse_qs(parsed.query)
        user = self.user()

        if path == "/":
            return self.send_html(layout("Home", home_page(), user))
        if path == "/flights":
            return self.send_html(layout("Flights", flights_page(params), user))
        if path == "/deals":
            return self.send_html(layout("Deals", deals_page(), user))
        if path == "/contact":
            conn = db(); msgs = conn.execute("SELECT * FROM messages ORDER BY id DESC").fetchall(); conn.close()
            return self.send_html(layout("Contact", contact_page(msgs=msgs), user))
        if path == "/login":
            return self.send_html(layout("Sign in", self.login_form(), user))
        if path == "/register":
            return self.send_html(layout("Register", self.register_form(), user))
        if path == "/manage":
            return self.send_html(layout("Manage Booking", manage_form(), user))
        if path == "/logout":
            return self.redirect("/", cookie="session=; Max-Age=0; Path=/")
        if path == "/account":
            return self.account_page(user)
        if path == "/booking":
            return self.booking_page(params, user)
        if path == "/download":
            return self.download(params)
        if path == "/api/users":
            return self.api_users()
        if path == "/admin":
            return self.admin_page(user)

        return self.send_html(layout("Not found",
            '<section><div class="container"><div class="section-head">'
            '<h2>404 — Page not found</h2><p>The page you requested doesn\'t exist.</p>'
            '</div></div></section>', user), status=404)

    # ---- POST ----
    def do_POST(self):
        path = urllib.parse.urlparse(self.path).path
        p = self.body_params()
        user = self.user()

        if path == "/login":
            return self.do_login(p)
        if path == "/register":
            return self.do_register(p)
        if path == "/contact":
            conn = db()
            conn.execute("INSERT INTO messages(name,email,body) VALUES(?,?,?)",
                         (p.get("name",[""])[0], p.get("email",[""])[0], p.get("body",[""])[0]))
            conn.commit()
            msgs = conn.execute("SELECT * FROM messages ORDER BY id DESC").fetchall(); conn.close()
            return self.send_html(layout("Contact", contact_page(sent=True, msgs=msgs), user))
        if path == "/manage":
            return self.do_manage(p, user)
        if path == "/book":
            return self.do_book(p, user)
        if path == "/admin/diagnostics":
            return self.diagnostics(p, user)
        return self.send_html(layout("Error", "<section><div class='container'>Bad request</div></section>"), 400)

    # ================= auth =================
    def login_form(self, msg=""):
        alert = f'<div class="alert err">{msg}</div>' if msg else ""
        return f"""<div class="panel">
          <h2>Sign in</h2><p class="lead">Access your bookings and SkyMiles.</p>
          {alert}
          <div class="note">Demo account &mdash; <b>guest / guest</b></div>
          <form method="post" action="/login">
            <div class="form-row"><label>Username</label><input name="username" autofocus></div>
            <div class="form-row"><label>Password</label><input name="password" type="password"></div>
            <button class="btn btn-navy btn-block">Sign in</button>
          </form>
          <p style="text-align:center;margin:16px 0 0;font-size:13px">
            New here? <a href="/register">Create an account</a></p>
        </div>"""

    def do_login(self, p):
        u = p.get("username", [""])[0]
        pw = p.get("password", [""])[0]
        conn = db()
        # -- VULN #5: authentication SQL injection. Classic bypass:
        #    username:  admin'--        password: anything
        #    or:        ' OR '1'='1'--
        sql = f"SELECT * FROM users WHERE username='{u}' AND password='{pw}'"
        try:
            row = conn.execute(sql).fetchone()
        except Exception as e:
            conn.close()
            return self.send_html(layout("Sign in", self.login_form(f"Login error: {e}")))
        conn.close()
        if row:
            return self.redirect("/account", cookie=f"session={make_session(row)}; Path=/")
        return self.send_html(layout("Sign in", self.login_form("Invalid username or password.")))

    def register_form(self, msg=""):
        alert = f'<div class="alert err">{msg}</div>' if msg else ""
        return f"""<div class="panel">
          <h2>Join SkyMiles</h2><p class="lead">Earn miles on every flight.</p>{alert}
          <form method="post" action="/register">
            <div class="form-row"><label>Full name</label><input name="fullname"></div>
            <div class="form-row"><label>Email</label><input name="email" type="email"></div>
            <div class="form-row"><label>Username</label><input name="username"></div>
            <div class="form-row"><label>Password</label><input name="password" type="password"></div>
            <button class="btn btn-navy btn-block">Create account</button>
          </form></div>"""

    def do_register(self, p):
        fn = p.get("fullname", [""])[0]; em = p.get("email", [""])[0]
        un = p.get("username", [""])[0]; pw = p.get("password", [""])[0]
        if not un or not pw:
            return self.send_html(layout("Register", self.register_form("Username and password required.")))
        conn = db()
        if conn.execute("SELECT 1 FROM users WHERE username=?", (un,)).fetchone():
            conn.close()
            return self.send_html(layout("Register", self.register_form("That username is taken.")))
        # VULN #8: passwords stored in plaintext
        cur = conn.execute(
            "INSERT INTO users(username,password,email,fullname,role,skymiles,credit_card)"
            " VALUES(?,?,?,?,'user',0,'')", (un, pw, em, fn))
        conn.commit()
        row = conn.execute("SELECT * FROM users WHERE id=?", (cur.lastrowid,)).fetchone()
        conn.close()
        return self.redirect("/account", cookie=f"session={make_session(row)}; Path=/")

    # ================= account / bookings =================
    def account_page(self, user):
        if not user:
            return self.redirect("/login")
        conn = db()
        bks = conn.execute("""SELECT b.*, f.code, f.origin, f.dest, f.depart
                              FROM bookings b JOIN flights f ON f.id=b.flight_id
                              WHERE b.user_id=?""", (user["id"],)).fetchall()
        conn.close()
        rows = ""
        for b in bks:
            rows += f"""<tr><td><b>{b['ref']}</b></td><td>{b['code']}</td>
              <td>{b['origin']} &rarr; {b['dest']}</td><td>{b['depart']}</td>
              <td>{b['seat']}</td><td><span class="pill ok">{b['status']}</span></td>
              <td><a href="/booking?id={b['id']}">View</a> &middot;
                  <a href="/download?file={b['ref']}.txt">Boarding pass</a></td></tr>"""
        if not rows:
            rows = '<tr><td colspan="7">No bookings yet. <a href="/flights">Book a flight &rarr;</a></td></tr>'

        body = f"""<section><div class="container">
          <div class="card" style="padding:26px;margin-bottom:26px;display:flex;
               justify-content:space-between;align-items:center">
            <div><h2 style="margin:0 0 4px;color:var(--navy)">Welcome back, {user['fullname']}</h2>
              <p style="margin:0;color:var(--muted)">{user['email']} &middot; @{user['username']}
              &middot; Role: {user['role']}</p></div>
            <div style="text-align:right"><div style="font-size:12px;color:var(--muted)
              ;text-transform:uppercase;letter-spacing:1px">SkyMiles balance</div>
              <div style="font-size:30px;font-weight:800;color:var(--gold2)">{user['skymiles']:,}</div></div>
          </div>
          <h3 style="color:var(--navy)">My bookings</h3>
          <table class="data"><tr><th>Ref</th><th>Flight</th><th>Route</th><th>Departs</th>
            <th>Seat</th><th>Status</th><th></th></tr>{rows}</table>
        </div></section>"""
        return self.send_html(layout("My Account", body, user))

    def booking_page(self, params, user):
        bid = params.get("id", [""])[0]
        conn = db()
        # -- VULN #6: IDOR. Any booking id is shown to anyone; no ownership
        # check. Increment ?id= to read other passengers' bookings.
        b = conn.execute("""SELECT b.*, f.code, f.origin, f.dest, f.depart, f.arrive,
                            f.aircraft, u.fullname owner, u.email
                            FROM bookings b JOIN flights f ON f.id=b.flight_id
                            JOIN users u ON u.id=b.user_id WHERE b.id=?""", (bid,)).fetchone()
        conn.close()
        if not b:
            return self.send_html(layout("Booking",
                '<section><div class="container"><div class="alert err">Booking not found.</div>'
                '</div></section>', user), 404)
        body = f"""<section><div class="container" style="max-width:720px">
          <div class="card" style="padding:0;overflow:hidden">
            <div style="background:var(--navy);color:#fff;padding:22px 26px;display:flex;
                 justify-content:space-between;align-items:center">
              <div><div style="font-size:12px;letter-spacing:2px;color:var(--gold)">BOOKING REFERENCE</div>
                <div style="font-size:28px;font-weight:800">{b['ref']}</div></div>
              <span class="pill ok" style="font-size:13px">{b['status']}</span></div>
            <div style="padding:26px">
              <div style="display:flex;justify-content:space-between;margin-bottom:20px">
                <div><div class="city">Passenger</div><b>{b['passenger']}</b></div>
                <div><div class="city">Booked by</div><b>{b['owner']}</b> ({b['email']})</div>
                <div><div class="city">Seat</div><b>{b['seat']}</b></div>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;
                   border-top:1px solid var(--line);padding-top:20px">
                <div><div class="time">{b['depart'][11:]}</div><b>{b['origin']}</b>
                  <div class="city">{b['depart'][:10]}</div></div>
                <div style="text-align:center;color:var(--gold2)">
                  <div>&#9992;</div><div class="city">{b['code']} &middot; {b['aircraft']}</div></div>
                <div style="text-align:right"><div class="time">{b['arrive'][11:]}</div><b>{b['dest']}</b>
                  <div class="city">{b['arrive'][:10]}</div></div>
              </div>
              <div style="margin-top:22px">
                <a class="btn btn-navy" href="/download?file={b['ref']}.txt">Download boarding pass</a>
              </div>
            </div></div></div></section>"""
        return self.send_html(layout("Booking", body, user))

    def do_manage(self, p, user):
        pnr = p.get("pnr", [""])[0].strip()
        lastname = p.get("lastname", [""])[0].strip()
        if not pnr or not lastname:
            return self.send_html(layout("Manage Booking",
                manage_form("Please enter both your PNR and last name.", pnr, lastname), user))
        conn = db()
        # -- VULN #13: SQLi in the PNR lookup. PNR + last name are concatenated
        # into the query, so authentication can be bypassed entirely, e.g.
        #   PNR: SKH7F2A9   last name: ' OR '1'='1
        # returns the first booking regardless of the real passenger name.
        sql = ("SELECT b.*, f.code, f.origin, f.dest, f.depart, f.arrive, f.aircraft "
               "FROM bookings b JOIN flights f ON f.id=b.flight_id "
               f"WHERE b.ref='{pnr}' AND b.passenger LIKE '%{lastname}%'")
        try:
            b = conn.execute(sql).fetchone()
        except Exception as e:
            conn.close()
            return self.send_html(layout("Manage Booking",
                manage_form(f"Lookup error: {e}", pnr, lastname), user))
        conn.close()
        if not b:
            return self.send_html(layout("Manage Booking",
                manage_form("No booking matches that reference and last name. "
                            "Please check and try again.", pnr, lastname), user))
        return self.send_html(layout("Manage Booking", manage_result(b), user))

    def do_book(self, p, user):
        if not user:
            return self.redirect("/login")
        fid = p.get("flight_id", [""])[0]
        conn = db()
        f = conn.execute("SELECT * FROM flights WHERE id=?", (fid,)).fetchone()
        if not f:
            conn.close(); return self.redirect("/flights")
        import random
        ref = "SKH" + "".join(random.choice("0123456789ABCDEFGHJKLMNPQRSTUVWXYZ") for _ in range(5))
        seat = f"{random.randint(1,40)}{random.choice('ABCDEF')}"
        conn.execute("INSERT INTO bookings(ref,user_id,flight_id,passenger,seat,status)"
                     " VALUES(?,?,?,?,?,'Confirmed')",
                     (ref, user["id"], f["id"], user["fullname"], seat))
        conn.commit(); conn.close()
        return self.redirect("/account")

    def download(self, params):
        # -- VULN #9: path traversal / LFI. The filename is joined without
        # sanitisation, so ?file=../../../../etc/passwd escapes the folder.
        # (Legit boarding-pass files are generated on the fly below.)
        name = params.get("file", [""])[0]
        base = os.path.join(os.path.dirname(__file__), "boarding_passes")
        os.makedirs(base, exist_ok=True)
        target = os.path.join(base, name)   # no normalisation on purpose

        # generate a plausible boarding pass for real refs so the feature "works"
        if name.endswith(".txt") and not os.path.exists(target) and "/" not in name and ".." not in name:
            ref = name[:-4]
            conn = db()
            b = conn.execute("""SELECT b.*, f.code, f.origin, f.dest, f.depart, f.aircraft
                                FROM bookings b JOIN flights f ON f.id=b.flight_id
                                WHERE b.ref=?""", (ref,)).fetchone()
            conn.close()
            if b:
                pass_txt = (f"===== SKYHAVEN AIRWAYS BOARDING PASS =====\n"
                            f"Ref: {b['ref']}\nPassenger: {b['passenger']}\n"
                            f"Flight: {b['code']}  {b['origin']} -> {b['dest']}\n"
                            f"Departs: {b['depart']}   Seat: {b['seat']}\n"
                            f"Aircraft: {b['aircraft']}\n==========================================\n")
                with open(target, "w") as fh:
                    fh.write(pass_txt)
        try:
            with open(target, "rb") as fh:
                data = fh.read()
        except Exception as e:
            return self.send_html(layout("Download",
                f'<section><div class="container"><div class="alert err">'
                f'Could not read file: {e}</div></div></section>'), 404)
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Disposition", f'inline; filename="{os.path.basename(name)}"')
        self.end_headers()
        self.wfile.write(data)

    # ================= API =================
    def api_users(self):
        # -- VULN #8: sensitive data exposure. No auth; dumps every user
        # including plaintext passwords and credit-card numbers.
        conn = db()
        users = [dict(r) for r in conn.execute("SELECT * FROM users").fetchall()]
        conn.close()
        return self.send_json({"count": len(users), "users": users})

    # ================= admin =================
    def admin_page(self, user):
        # -- VULN #11: broken access control / privilege escalation.
        # "Admin" is decided purely by the client-controlled role in the
        # session cookie. base64-decode it, set role=admin, re-encode, done.
        if not user or user.get("role") != "admin":
            return self.send_html(layout("Admin",
                '<section><div class="container"><div class="panel">'
                '<h2>Restricted</h2><p class="lead">Administrator access required.</p>'
                '</div></div></section>', user), 403)
        conn = db()
        users = conn.execute("SELECT * FROM users").fetchall()
        msgs = conn.execute("SELECT * FROM messages ORDER BY id DESC").fetchall()
        conn.close()
        urows = ""
        for u in users:
            urows += (f"<tr><td>{u['id']}</td><td>{u['username']}</td>"
                      f"<td><code>{u['password']}</code></td><td>{u['email']}</td>"
                      f"<td>{u['role']}</td><td>{u['credit_card']}</td></tr>")
        mrows = ""
        for m in msgs:
            mrows += f"<tr><td>{m['name']}</td><td>{m['email']}</td><td>{m['body']}</td></tr>"
        body = f"""<section><div class="container">
          <h2 style="color:var(--navy)">Admin Console</h2>
          <p style="color:var(--muted)">Logged in as {user['username']} ({user['role']})</p>

          <h3 style="color:var(--navy);margin-top:26px">Users</h3>
          <table class="data"><tr><th>ID</th><th>Username</th><th>Password</th>
            <th>Email</th><th>Role</th><th>Card</th></tr>{urows}</table>

          <h3 style="color:var(--navy);margin-top:30px">Contact messages</h3>
          <table class="data"><tr><th>Name</th><th>Email</th><th>Message</th></tr>{mrows}</table>

          <h3 style="color:var(--navy);margin-top:30px">Network Diagnostics</h3>
          <div class="panel" style="max-width:none;margin:12px 0 0">
            <p class="lead">Ping a host to check connectivity from the booking server.</p>
            <form method="post" action="/admin/diagnostics">
              <div class="form-row"><label>Host</label>
                <input name="host" value="127.0.0.1"></div>
              <button class="btn btn-navy">Run ping</button>
            </form>
          </div>
        </div></section>"""
        return self.send_html(layout("Admin", body, user))

    def diagnostics(self, p, user):
        if not user or user.get("role") != "admin":
            return self.send_html(layout("Admin", "Forbidden", user), 403)
        host = p.get("host", ["127.0.0.1"])[0]
        # -- VULN: OS command injection. host is interpolated into a shell
        # string, so  127.0.0.1; cat /etc/passwd  runs arbitrary commands.
        cmd = f"ping -c 2 {host}"
        try:
            out = subprocess.run(cmd, shell=True, capture_output=True,
                                 text=True, timeout=10)
            output = (out.stdout or "") + (out.stderr or "")
        except Exception as e:
            output = str(e)
        body = f"""<section><div class="container">
          <h2 style="color:var(--navy)">Diagnostics result</h2>
          <p style="color:var(--muted)">Command: <code>{cmd}</code></p>
          <pre style="background:#0a2540;color:#9fe3b0;padding:18px;border-radius:10px;
            overflow:auto;font-size:13px">{html.escape(output)}</pre>
          <a class="btn btn-navy" href="/admin">Back to console</a>
        </div></section>"""
        return self.send_html(layout("Diagnostics", body, user))


def main():
    init_db()
    print("=" * 60)
    print("  SkyHaven Airways — VULNERABLE training app")
    print("  ⚠  Authorized security practice ONLY. Do not expose publicly.")
    print(f"  ▶  http://localhost:{PORT}")
    print("  See VULNERABILITIES.md for the full challenge list.")
    print("=" * 60)
    ThreadingHTTPServer((HOST, PORT), App).serve_forever()


if __name__ == "__main__":
    main()
