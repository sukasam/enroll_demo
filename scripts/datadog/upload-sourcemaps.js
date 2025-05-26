import { exec } from "child_process";
import { promisify } from "util";
import pkg from "../../package.json" assert { type: "json" };

const execAsync = promisify(exec);
const Paths = [
    {
        DIST_PATH: "build/server/chunks",
        PATH_PREFIX: "/_next/server/chunks"
    },
    {
        DIST_PATH: "build/static/chunks",
        PATH_PREFIX: "/_next/static/chunks"
    }
];

const URL = {
    develop: "https://enrollment.unicityqa.com",
    master: "https://enrollment.unicity.com"
};

const SERVICE_NAME = "enrollment";
const RELEASE_VERSION = pkg.version;

const parseArgs = rawArgs =>
    rawArgs.reduce((args, arg) => {
        const [key, value] = arg.split("=");
        args[key] = value;
        return args;
    }, {});

const uploadSourcemaps = async args => {
    console.log("===================Uploading Sourcemaps===================");

    const urlPrefix = URL[args.branch];
    for (const path of Paths) {
        const command =
            `npx @datadog/datadog-ci sourcemaps upload ${path.DIST_PATH} ` +
            `--service=${SERVICE_NAME} ` +
            `--release-version=${RELEASE_VERSION} ` +
            `--minified-path-prefix=${urlPrefix}${path.PATH_PREFIX} ` +
            `--project-path=./src/ ` +
            `--disable-git`;

        try {
            console.log(
                `Running sourcemaps upload for prefix ${urlPrefix}${path.PATH_PREFIX}...`
            );
            const { stdout, stderr } = await execAsync(command);
            if (stdout) {
                console.log(`Stdout: ${stdout}`);
            }
            if (stderr) {
                console.log(`Stderr: ${stderr}`);
            }
            console.log(
                `Sourcemaps uploaded for prefix ${urlPrefix}${path.PATH_PREFIX}!`
            );
        } catch (error) {
            console.error(
                `Error during upload for prefix ${urlPrefix}${path.PATH_PREFIX}: ${error.message}`
            );
        }
    }
};

const main = async () => {
    try {
        const rawArgs = process.argv.slice(2);
        const args = parseArgs(rawArgs);
        await uploadSourcemaps(args);
    } catch (error) {
        console.error(error);
    }
};

main();
