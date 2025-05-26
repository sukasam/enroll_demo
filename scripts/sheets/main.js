import { appendSummaryData, updateDetailedData } from "./googleSheetsHelper.js";
import { parseCoverageData } from "./parseCoverageData.js";

async function main() {
    try {
        const { summaryData, detailedData } = await parseCoverageData();

        const today = new Date();
        const sheetTitle = today
            .toLocaleDateString("en-US", { month: "2-digit", year: "numeric" })
            .replace("/", "-");

        try {
            await appendSummaryData(sheetTitle, summaryData);
            console.log(
                `Summary data successfully appended to Google Sheets in "${sheetTitle}" sheet.`
            );
        } catch (error) {
            console.error(
                "Error appending summary data to Google Sheets:",
                error
            );
        }

        try {
            await updateDetailedData(detailedData);
            console.log(
                `Detailed coverage data successfully uploaded to the "Detailed Coverage" sheet.`
            );
        } catch (error) {
            console.error(
                "Error uploading detailed data to Google Sheets:",
                error
            );
        }
    } catch (error) {
        console.error("Error processing coverage data:", error);
    }
}

main();
