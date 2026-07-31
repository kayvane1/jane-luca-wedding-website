const SHEET_NAME = "RSVP Responses";
const HEADER_ROW = 4;
const NOTIFICATION_EMAIL = "liukrossini@gmail.com";

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function yesNo(value) {
  return value === true ? "Yes" : "No";
}

function sendRsvpNotification(payload, targetRow) {
  const attendance = payload.attendance === "attending" ? "Attending" : "Declined";
  const subject = `Wedding RSVP: ${payload.primaryGuestName || "Guest"} — ${attendance}`;
  const events = [
    `Friday: ${yesNo(payload.fridayAttendance)}`,
    `Saturday: ${yesNo(payload.saturdayAttendance)}`,
    `Sunday: ${yesNo(payload.sundayAttendance)}`,
  ].join("\n");

  const body = [
    "A wedding RSVP has been submitted.",
    "",
    `Guest: ${payload.primaryGuestName || "—"}`,
    `Email: ${payload.email || "—"}`,
    `Attendance: ${attendance}`,
    events,
    `Party size: ${Number(payload.guestCount || 0)}`,
    `Additional guests: ${Array.isArray(payload.guestNames) && payload.guestNames.length ? payload.guestNames.join(", ") : "—"}`,
    `Menu: ${payload.menuChoice || "—"}`,
    `Allergies / dietary notes: ${payload.dietaryRequirements || "—"}`,
    `Note for Jane & Luca: ${payload.message || "—"}`,
    `Best tune: ${payload.bestTune || "—"}`,
    "",
    `RSVP ID: ${payload.id}`,
    `Sheet row: ${targetRow}`,
  ].join("\n");

  MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
}

function doPost(event) {
  try {
    const properties = PropertiesService.getScriptProperties();
    const expectedSecret = properties.getProperty("RSVP_WEBHOOK_SECRET");
    const spreadsheetId = properties.getProperty("SPREADSHEET_ID");
    const payload = JSON.parse(event.postData.contents || "{}");

    if (!expectedSecret || payload.secret !== expectedSecret) {
      return jsonResponse({ ok: false, error: "Unauthorised" });
    }
    if (!spreadsheetId) {
      return jsonResponse({ ok: false, error: "SPREADSHEET_ID is not configured" });
    }

    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(SHEET_NAME);
    if (!sheet) return jsonResponse({ ok: false, error: `${SHEET_NAME} tab not found` });

    const lastRow = Math.max(sheet.getLastRow(), HEADER_ROW);
    const ids = lastRow > HEADER_ROW
      ? sheet.getRange(HEADER_ROW + 1, 1, lastRow - HEADER_ROW, 1).getValues().flat()
      : [];
    const existingIndex = ids.findIndex((value) => String(value) === String(payload.id));
    const targetRow = existingIndex === -1 ? lastRow + 1 : HEADER_ROW + 1 + existingIndex;
    const now = new Date();

    sheet.getRange(targetRow, 1, 1, 17).setValues([[
      payload.id,
      payload.action,
      payload.submittedOrUpdatedAt || now,
      payload.primaryGuestName || "",
      payload.attendance === "attending" ? "Attending" : "Declined",
      yesNo(payload.fridayAttendance),
      yesNo(payload.saturdayAttendance),
      yesNo(payload.sundayAttendance),
      Number(payload.guestCount || 0),
      Array.isArray(payload.guestNames) ? payload.guestNames.join(", ") : "",
      payload.menuChoice || "",
      payload.dietaryRequirements || "",
      payload.message || "",
      payload.bestTune || "",
      payload.email || "",
      "Synced",
      now,
    ]]);

    sendRsvpNotification(payload, targetRow);

    return jsonResponse({ ok: true, row: targetRow });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: String(error) });
  }
}
