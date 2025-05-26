import shell from "shelljs";

function consoleLogColor(message, color = "white") {
    // Docs https://logfetch.com/js-console-colors/
    const colors = {
        black: "30",
        red: "31",
        green: "32",
        yellow: "33",
        blue: "34",
        magenta: "35",
        cyan: "36",
        white: "37",
        gray: "90"
    };
    console.log(`\x1b[${colors[color]}m%s\x1b[0m`, message);
}

const errorOutIfNeeded = (code, stderr, command) => {
    if (code !== 0) {
        consoleLogColor(`Error! ${stderr}`, "red");
        consoleLogColor(`command: ${command}`, "gray");
        shell.exit(1);
    }
};

const shellExec = async command => {
    const { code, stdout, stderr } = await shell.exec(command);
    errorOutIfNeeded(code, stderr, command);
    return stdout;
};

const helpMessage = () => {
    consoleLogColor(
        `
    Usage: node blueGreen.js [beta] [swap]
    beta: Deploy to beta only
    swap: Swap the Blue Green target groups`,
        "yellow"
    );
    shell.exit(0);
};

const createImage = async () => {
    consoleLogColor("Creating Docker Image", "blue");

    // Create base environment file first
    consoleLogColor("Creating environment file...", "cyan");
    try {
        await shellExec(`./scripts/createENV.sh`);
        // Verify .env file was created
        if (!shell.test("-f", ".env")) {
            throw new Error(".env file was not created");
        }
        consoleLogColor("✓ Environment file created successfully", "green");
    } catch (error) {
        consoleLogColor(`✗ Failed to create environment file: ${error}`, "red");
        shell.exit(1);
    }

    // Update build ID for cache busting
    consoleLogColor("Updating build ID for cache busting...", "cyan");
    try {
        await shellExec("./scripts/update-build-id.sh");
        // Verify BUILD_ID was added to .env
        const envContent = shell.cat(".env").toString();
        if (!envContent.includes("NEXT_PUBLIC_BUILD_ID=")) {
            throw new Error("BUILD_ID was not added to .env file");
        }
        consoleLogColor("✓ Build ID updated successfully", "green");
    } catch (error) {
        consoleLogColor(`✗ Failed to update build ID: ${error}`, "red");
        shell.exit(1);
    }

    // Build Docker image
    try {
        await shellExec(`docker-compose build enroll`);
        await shellExec("mkdir -p ./dockerimage");
        await shellExec("docker save -o ./dockerimage/enroll.tar.gz enroll:latest");
        consoleLogColor("✓ Docker Image Created Successfully", "green");
    } catch (error) {
        consoleLogColor(`✗ Failed to create Docker image: ${error}`, "red");
        shell.exit(1);
    }
};

export { consoleLogColor, createImage, helpMessage, shellExec };
