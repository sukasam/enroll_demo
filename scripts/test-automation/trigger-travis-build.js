import axios from "axios";
import dotenv from "dotenv";
import { exec } from "child_process";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
// Load environment variables from .env file
const TRAVIS_API_URL = process.env.TRAVIS_API_URL;
const TRAVIS_TOKEN = process.env.TRAVIS_TOKEN;
// List of environment variables to be used in the docker run command
const TRAVIS_ENV_VAR = [
    "TRAVIS_TOKEN",
    "TRAVIS_BUILD_ID",
    "TRAVIS_REPO_SLUG",
    "TRAVIS_COMMIT",
    "GITHUB_ACCESS_TOKEN",
    "SLACK_CHANNEL_GROWTH_TEST_RESULTS",
    "SLACK_CHANNEL_SHOP_TEST_RESULTS",
    "CF_ACCESS_CLIENT_ID",
    "CF_ACCESS_CLIENT_SECRET",
    "TESTMO_TOKEN",
    "S3_ACCESS_CLIENT_ID",
    "S3_ACCESS_CLIENT_SECRET"
];
// Parse command-line arguments in the form of KEY=VALUE to an object
const parseArgs = rawArgs =>
    rawArgs.reduce((args, arg) => {
        const [key, value] = arg.split("=");
        args[key] = value;
        return args;
    }, {});
function getDynamicDirectoryName() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // JavaScript months are 0-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}`;
}
// Construct the request body for the Travis CI API to trigger a build
const constructRequestBody = (
    args,
    reporterCommand,
    sendResultsCommand,
    suiteCommand,
    projectBranch,
    deviceCommand,
    workers,
    otherCommands,
) => {
    // Join all the environment variables with ' -e ' prefix
    const travisEnvVars = TRAVIS_ENV_VAR.map(varName => `-e ${varName}`).join(" ");
    const dynamicDirectoryName = getDynamicDirectoryName(); // e.g., "202312011230" for Dec 1, 2023, at 12:30
    const testmoToken = process.env.TESTMO_TOKEN; // Ensure this environment variable is set

    const updateXMLCommand = `node scripts/updateXMLAttachmentPaths.js ${args.project_name} ${dynamicDirectoryName}`;
    const uploadToS3Command = `node scripts/s3.js ${args.project_name} ${dynamicDirectoryName}`;
    const projectIds = {
        "enrollment": 1,
        "upgrade": 1,
        "membership": 1,
        "ufeelgreat": 2
    };
    const testMoProjectId = projectIds[args.project_name] || 0;
    const runName = (args.suite === "smoke") ? args.suite + " - " + args.project_name : `regression${args.other ? ' ' + args.other : ''}`;
    const source = (args.suite === "smoke") ? "smoke-runs" : args.project_name;
    const submitToTestmoCommand = `npm install -g @testmo/testmo-cli && export TESTMO_TOKEN=${testmoToken} && testmo automation:run:submit --instance https://unicityqa.testmo.net --project-id ${testMoProjectId} --name '${runName}' --source ${source} --results ${args.project_name}/results/test-results.xml`;
    return {
        request: {
            message: `${args.project_name} automation - ${suiteCommand === "" ? "regression" : suiteCommand
                } suite ${otherCommands}`,
            branch: args.auto_branch || "master",
            merge_mode: "replace",
            config: {
                language: "node_js",
                dist: "jammy",
                node_js: ["18"],
                services: ["docker"],
                before_install: [
                    "docker build -t test-automation .",
                    "npm install @aws-sdk/client-s3"
                ],
                script: [
                    `docker run ${travisEnvVars} test-automation bash -c "cd ${args.project_name} && ${reporterCommand} ${projectBranch} npx playwright test ${deviceCommand} ${suiteCommand} --workers=${workers} ${otherCommands}  || true ${sendResultsCommand}  && cd .. && ${updateXMLCommand}  || true && ${uploadToS3Command}  || true && ${submitToTestmoCommand}"`, // after that i want to run the following command

                ],
            },
        },
    };
};
function isValueUndefined(arg) {
    return arg === "undefined" || typeof arg === "undefined";
}
// Construct the request headers for the Travis CI API
const constructRequestConfig = () => ({
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Travis-API-Version": "3",
        Authorization: `token ${TRAVIS_TOKEN}`,
    },
});

// Trigger a new build in Travis CI by sending a POST request to the Travis CI API
const triggerBuild = async args => {
    const projectBranch = args.branch_url ? `BRANCH=${args.branch_url}` : "";
    const workers = args.workers || "3";
    const deviceCommand = args.device ? `--project='${args.device}'` : "";
    const suiteCommand = args.suite ? `-g @${args.suite}` : "";
    const reporterCommand = args.channel_name ? "REPORTER=on" : "";
    const full_report = args.full_report || "on";
    const repoCommit =
        process.env.TRAVIS_REPO_SLUG === undefined || process.env.TRAVIS_REPO_SLUG.includes("Growth-TestAutomation")
            ? ""
            : process.env.TRAVIS_COMMIT;
    const repoSlug =
        process.env.TRAVIS_REPO_SLUG === undefined || process.env.TRAVIS_REPO_SLUG.includes("Growth-TestAutomation")
            ? ""
            : process.env.TRAVIS_REPO_SLUG;
    const sendResultsCommand = args.channel_name
        ? `&& node ../scripts/slack/send-test-results-to-channel.js results.json ${args.channel_name} ${args.project_name} ${args.suite} ${full_report} ${repoCommit} ${repoSlug} '${args.other}'`
        : "";
    const otherCommands = isValueUndefined(args.other) ? "" : args.other;
    const requestBody = constructRequestBody(
        args,
        reporterCommand,
        sendResultsCommand,
        suiteCommand,
        projectBranch,
        deviceCommand,
        workers,
        otherCommands,
    );
    const config = constructRequestConfig();

    try {
        await axios.post(TRAVIS_API_URL, requestBody, config);
        console.log(`Triggered build for project: ${args.project_name}`);
    } catch (error) {
        console.error(`Error triggering build for project: ${args.project_name}. Error: ${error.message}`);
    }
};

// Validate the necessary command-line arguments and environment variables
const validateArgs = args => {
    if (!args.project_name || !TRAVIS_TOKEN) {
        const missingArgs = !args.project_name ? ["project name"] : [];
        if (!TRAVIS_TOKEN) missingArgs.push("Travis CI token (environment variable)");
        throw new Error(`Error: Missing required ${missingArgs.join(", ")}.`);
    }
};

// Main function that parses the command-line arguments, validates them, and triggers the build
const main = async () => {
    const rawArgs = process.argv.slice(2);
    const args = parseArgs(rawArgs);
    validateArgs(args);
    await triggerBuild(args);
};

main().catch(console.error);
