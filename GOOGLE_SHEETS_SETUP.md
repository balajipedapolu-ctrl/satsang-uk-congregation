# Save registrations to a Google Sheet

Every time someone registers, their details will be added as a new row in a
Google Sheet you own. Free, no database. ~10 minutes to set up.

The flow: **Website → Google Apps Script (a tiny web app) → your Sheet.**

---

## Step 1 — Create the Sheet

1. Go to <https://sheets.new> (creates a new Google Sheet).
2. Name it something like **"Satsang Registrations 2026"** (top-left).

## Step 2 — Add the script

1. In the Sheet menu: **Extensions → Apps Script**. A code editor opens.
2. Delete anything in the editor and paste this **exactly**:

```javascript
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var d = JSON.parse(e.postData.contents);

    if (d.type === 'message') {
      // Contact-form messages go to their own "Messages" tab
      var msg = ss.getSheetByName('Messages') || ss.insertSheet('Messages');
      if (msg.getLastRow() === 0) {
        msg.appendRow(['Timestamp', 'Name', 'Email', 'Message']);
      }
      msg.appendRow([new Date(), d.name || '', d.email || '', d.message || '']);
    } else if (d.type === 'donation') {
      // Donations go to their own "Donations" tab
      var don = ss.getSheetByName('Donations') || ss.insertSheet('Donations');
      if (don.getLastRow() === 0) {
        don.appendRow([
          'Timestamp', 'Reference', 'Name', 'Email', 'Phone',
          'Amount (£)', 'Method', 'SumUp Ref', 'Message'
        ]);
      }
      don.appendRow([
        new Date(),
        d.reference || '',
        d.name || '',
        d.email || '',
        d.phone || '',
        d.amount || '',
        d.method || '',
        d.receipt || '',
        d.message || ''
      ]);
    } else {
      // Registrations go to the first sheet
      var sheet = ss.getSheets()[0];
      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          'Timestamp', 'Reference', 'Name', 'Email', 'Phone',
          'Location', 'Postcode', 'Attendees', 'Travel Mode', 'Volunteer', 'Seva', 'Blood Donor'
        ]);
      }
      sheet.appendRow([
        new Date(),
        d.reference || '',
        d.name || '',
        d.email || '',
        d.phone || '',
        d.location || '',
        d.postcode || '',
        d.attendees || '',
        d.travelMode || '',
        d.wantsToVolunteer ? 'Yes' : 'No',
        (d.seva || []).join(', '),
        d.bloodDonorInterest ? 'Yes' : 'No'
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

> **Already set up registrations?** Just replace your existing script with the
> version above, then **Deploy → Manage deployments → edit ✏️ → Version: New
> version → Deploy**. The webhook URL stays the same, and donations will start
> landing on a new **"Donations"** tab automatically.

3. Click the **Save** icon (💾).

## Step 3 — Deploy it as a Web App

1. Top-right: **Deploy → New deployment**.
2. Click the ⚙️ gear next to "Select type" → choose **Web app**.
3. Set:
   - **Description:** `Satsang registrations`
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**
4. Click **Deploy**.
5. Click **Authorize access** → choose your Google account → on the
   "Google hasn't verified this app" screen, click **Advanced → Go to
   (your project) (unsafe)** → **Allow**. *(This is safe — it's your own script.)*
6. Copy the **Web app URL** — it looks like
   `https://script.google.com/macros/s/AKfy..../exec`

## Step 4 — Give the URL to your website

Add the URL as an environment variable in Vercel:

1. In your Vercel project: **Settings → Environment Variables**.
2. Add a new one:
   - **Key:** `GOOGLE_SHEETS_WEBHOOK_URL`
   - **Value:** paste the Web app URL from Step 3
   - **Environments:** tick all (Production, Preview, Development)
3. Click **Save**.
4. Go to **Deployments → (latest) → ⋯ → Redeploy** so the new setting takes effect.

## Done ✅

Register a test person on your live site — a new row should appear in your
Sheet within a couple of seconds.

---

## Verifying donations without SumUp API access

A SumUp payment *link* doesn't notify the website when a payment succeeds, so
the donation form is a **self-report** — it can't prove money actually arrived.
That's fine; verify it this way instead:

1. **SumUp is your source of truth.** Every real card payment appears in your
   **SumUp dashboard** (and emails you a receipt) with the payer's name, amount,
   date and a transaction ID. Reconcile the sheet against it.
2. **Match by receipt number.** The donation form asks for the **SumUp receipt /
   transaction number** (saved in the "SumUp Ref" column). Match each sheet row
   to a real SumUp transaction in seconds — a made-up number won't match.
3. **Optional CSV import.** In SumUp you can export transactions as CSV and paste
   them into a third tab (e.g. "SumUp Export") so everything lives in one file.

---

### Notes
- **Updating the script later?** After editing, do **Deploy → Manage
  deployments → (edit ✏️) → Version: New version → Deploy**, or the changes
  won't go live. (The URL stays the same.)
- **Local development:** put the same line in a file named `.env.local` at the
  project root: `GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/.../exec`
- **Security:** the URL is a private webhook — keep it out of public places.
  For a community event the risk is low; if you later want to lock it down we
  can add a shared secret.
