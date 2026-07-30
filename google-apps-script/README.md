# Google Sheets RSVP connection

The website database remains the primary RSVP record. This Apps Script mirrors every successful create or update into the `RSVP Responses` tab of the Google Sheet.

1. Import `Jane-Luca-RSVP-Tracker.xlsx` into Google Drive as a native Google Sheet.
2. In that sheet, open **Extensions → Apps Script** and replace the editor contents with `Code.gs`.
3. In **Project Settings → Script properties**, add:
   - `SPREADSHEET_ID`: the value between `/d/` and `/edit` in the sheet URL.
   - `RSVP_WEBHOOK_SECRET`: a long random value (at least 32 characters).
4. Select **Deploy → New deployment → Web app**. Execute as yourself and allow access to anyone who has the URL.
5. Add the deployment URL to Vercel as `GOOGLE_SHEETS_WEBHOOK_URL` and the same random value as `GOOGLE_SHEETS_WEBHOOK_SECRET`.
6. Redeploy the website, submit one test RSVP, and verify that a row appears on the `RSVP Responses` tab.

Do not commit the webhook URL or secret to GitHub.
