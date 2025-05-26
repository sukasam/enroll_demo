import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
    credentials: {
        type: "service_account",
        project_id: process.env.GOOGLE_UNITTEST_PROJECT_ID,
        private_key_id: process.env.GOOGLE_UNITTEST_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_UNITTEST_PRIVATE_KEY.replace(
            /\\n/g,
            "\n"
        ),
        client_email: process.env.GOOGLE_UNITTEST_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_UNITTEST_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url:
            "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(
            process.env.GOOGLE_UNITTEST_CLIENT_EMAIL
        )}`
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

const spreadsheetId = "1m7ti7um0Ac1ZkyufD2OXsU42_f2h0xBvwVIgJa-xSC8";

export async function appendSummaryData(sheetTitle, summaryData) {
    const sheets = google.sheets({
        version: "v4",
        auth: await auth.getClient()
    });
    try {
        await ensureSheetExists(sheets, sheetTitle);
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetTitle}!A1`,
            valueInputOption: "RAW",
            requestBody: { values: summaryData }
        });
    } catch (error) {
        console.error(
            `Error appending summary data to sheet "${sheetTitle}":`,
            error
        );
        throw new Error("Failed to append summary data to Google Sheets");
    }
}

export async function updateDetailedData(detailedData) {
    const sheets = google.sheets({
        version: "v4",
        auth: await auth.getClient()
    });
    const detailedSheetTitle = "Detailed Coverage";
    try {
        await ensureSheetExists(sheets, detailedSheetTitle);
        await sheets.spreadsheets.values.clear({
            spreadsheetId,
            range: `${detailedSheetTitle}!A1:Z1000`
        });
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${detailedSheetTitle}!A1`,
            valueInputOption: "RAW",
            requestBody: { values: detailedData }
        });
    } catch (error) {
        console.error("Error updating detailed coverage data:", error);
        throw new Error(
            "Failed to update detailed coverage data in Google Sheets"
        );
    }
}

async function ensureSheetExists(sheets, title) {
    try {
        const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
        const existingSheet = spreadsheet.data.sheets.find(
            sheet => sheet.properties.title === title
        );

        if (!existingSheet) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                requestBody: {
                    requests: [{ addSheet: { properties: { title } } }]
                }
            });
        }
    } catch (error) {
        console.error(`Error ensuring sheet "${title}" exists:`, error);
        throw new Error(`Failed to create or access sheet titled "${title}"`);
    }
}
