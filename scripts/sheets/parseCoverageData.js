import { promises as fs } from "fs";
import path from "path";

// Try multiple possible coverage paths
const possibleCoveragePaths = [
    path.join(process.cwd(), "coverage/coverage-summary.json"),
    path.join(path.dirname(new URL(import.meta.url).pathname), "../../coverage/coverage-summary.json"),
    path.join(process.cwd(), "coverage-summary.json")
];

export async function parseCoverageData() {
    let coverageResults;
    let usedPath;

    // Try each possible path
    for (const coveragePath of possibleCoveragePaths) {
        try {
            const data = await fs.readFile(coveragePath, "utf8");
            coverageResults = JSON.parse(data);
            usedPath = coveragePath;
            break;
        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.error(`Error reading coverage file at ${coveragePath}:`, error);
                throw new Error(`Failed to parse coverage data: ${error.message}`);
            }
        }
    }

    if (!coverageResults) {
        throw new Error(
            `Coverage summary file not found. Tried paths:\n${possibleCoveragePaths.join('\n')}`
        );
    }

    console.log(`Successfully read coverage data from: ${usedPath}`);

    return {
        summaryData: buildSummaryData(coverageResults),
        detailedData: buildDetailedData(coverageResults)
    };
}

function buildSummaryData(coverageResults) {
    const totalCoverage = coverageResults.total;
    const date = new Date().toISOString();
    return [
        [
            "Date",
            "Statements (%)",
            "Branches (%)",
            "Functions (%)",
            "Lines (%)"
        ],
        [
            date,
            totalCoverage.statements.pct,
            totalCoverage.branches.pct,
            totalCoverage.functions.pct,
            totalCoverage.lines.pct
        ]
    ];
}

function buildDetailedData(coverageResults) {
    const nextBestFileData = getNextBestFileData(coverageResults);
    const detailedData = [
        ...nextBestFileData,
        [
            "File Path",
            "Statements (%)",
            "Branches (%)",
            "Functions (%)",
            "Lines (%)"
        ],
        ...Object.entries(coverageResults).map(([filePath, coverage]) => [
            filePath,
            coverage.statements.pct,
            coverage.branches.pct,
            coverage.functions.pct,
            coverage.lines.pct
        ])
    ];
    return detailedData;
}

function getNextBestFileData(coverageResults) {
    const filesCoverage = Object.entries(coverageResults)
        .filter(([filePath]) => filePath !== "total")
        .map(([filePath, coverage]) => ({
            filePath,
            statementsPct: coverage.statements.pct,
            branchesPct: coverage.branches.pct,
            functionsPct: coverage.functions.pct,
            linesPct: coverage.lines.pct,
            averageCoverage:
                (coverage.statements.pct +
                    coverage.branches.pct +
                    coverage.functions.pct +
                    coverage.lines.pct) /
                4,
            complexityScore:
                coverage.statements.total +
                coverage.branches.total +
                coverage.functions.total +
                coverage.lines.total
        }))
        .filter(file => file.averageCoverage < 100)
        .sort(
            (a, b) =>
                a.averageCoverage - b.averageCoverage ||
                b.complexityScore - a.complexityScore
        );

    const nextBestFile = filesCoverage[0];
    return nextBestFile
        ? [
              ["Next Best File to Test"],
              [
                  "File Path",
                  "Statements (%)",
                  "Branches (%)",
                  "Functions (%)",
                  "Lines (%)",
                  "Average Coverage (%)",
                  "Complexity Score"
              ],
              [
                  nextBestFile.filePath,
                  nextBestFile.statementsPct,
                  nextBestFile.branchesPct,
                  nextBestFile.functionsPct,
                  nextBestFile.linesPct,
                  nextBestFile.averageCoverage,
                  nextBestFile.complexityScore
              ],
              []
          ]
        : [["No suitable file found with incomplete coverage."], []];
}
