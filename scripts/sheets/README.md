# Jest Coverage Report to Google Sheets

This script uploads Jest coverage data to Google Sheets. The coverage information is extracted from a Jest JSON report and then pushed to Google Sheets in two sections: a summary sheet with an executions totals and a detailed coverage sheet with file-by-file data from last execution.

## Project Structure

### Main Components

-   **`parseCoverageData.js`**:

    -   Reads and processes the coverage JSON file.
    -   Generates two data sets:
        -   **Summary Data**: Total coverage metrics (statements, branches, functions, and lines).
        -   **Detailed Data**: File-by-file coverage metrics and a "next best file to test" recommendation.
    -   Functions:
        -   `buildSummaryData`: Generates a summary table with overall coverage percentages.
        -   `buildDetailedData`: Compiles detailed coverage data for each file, along with the "next best file to test."

-   **`googleSheetsHelper.js`**:

    -   Manages Google Sheets integration, including:
        -   Authenticating with Google Sheets.
        -   Appending new data to the summary sheet.
        -   Clearing and updating data on the detailed coverage sheet.
    -   Functions:
        -   `appendSummaryData`: Appends summary data to a monthly sheet based on the current date.
        -   `updateDetailedData`: Clears and updates the detailed sheet with the latest file-level coverage data.
        -   `ensureSheetExists`: Checks if a sheet exists and creates it if necessary.

-   **`main.js`**:
    -   The entry point script that orchestrates the workflow:
        1. Calls `parseCoverageData` to prepare summary and detailed data.
        2. Uses `googleSheetsHelper` to upload summary and detailed data to Google Sheets.
    -   Example usage:
        ```bash
        node main.js
        ```

## Usage Instructions

### Prerequisites

1. **Google Sheets API**:

    - Enable the Google Sheets API on your Google Cloud project.
    - Download the credentials JSON file for a service account with permissions to access the Google Sheets API.

2. **Configure Spreadsheet ID**:
    - Set your Google Sheets `spreadsheetId` in `googleSheetsHelper.js`.

### Running the Workflow

1. **Generate Jest Coverage JSON**:

    - Run Jest with coverage enabled:
        ```bash
        npm run testCoverage
        ```
    - This will create a `coverage-summary.json` file in the `coverage` folder.

2. **Execute the Main Script**:
    - Run the main script to parse the data and upload it to Google Sheets:
        ```bash
        node main.js
        ```

### Output in Google Sheets

-   **Summary Tab** (named by month/year):

    -   Shows an appended row of total coverage percentages with the current date.

-   **Detailed Coverage Tab**:
    -   Contains the "next best file to test" suggestion at the top.
    -   Displays detailed coverage data for each file, allowing easy identification of files with low coverage.

## Troubleshooting

-   **Google Sheets API Errors**:
    -   Ensure the Google Sheets API is enabled for your project.
    -   Verify that the `spreadsheetId` and the permissions for the service account in `credentials.json` are correctly configured.
    -   Ensure the Google Sheets document is shared with the email in your service account.

## Additional Notes

-   Complexity score is calculated using the `calculateComplexityScore` function in `parseCoverageData.js`. It can be refined over time.
