import shell from "shelljs";

import {
    deployToServersOnBetaGroup,
    getActiveTargetGroupAnr,
    setShellAwsEnvVariables,
    switchRulesTargetGroup
} from "./blueGreenDeployment/awsCommands.js";
import {
    BETA_RULE_ANR,
    BLUE_SERVERS,
    BLUE_TARGET_GROUP_ANR,
    GREEN_SERVERS,
    GREEN_TARGET_GROUP_ANR,
    LOAD_BALANCER_LISTENER_ANR,
    PROD_RULE_ANR
} from "./blueGreenDeployment/serverConfigs.js";
import { createImage, helpMessage } from "./blueGreenDeployment/utils.js";

if (process.argv.includes("help")) {
    helpMessage();
    shell.exit(0);
}

const DEPLOY_TO_BETA_ONLY = process.argv.includes("beta");
const SWAP_TARGET_GROUPS = process.argv.includes("swap");

// Default here to Blue deploy
let DEPLOY_TO_SERVERS = BLUE_SERVERS;
let ACTIVE_TARGET_GROUP_ANR = GREEN_TARGET_GROUP_ANR;
let DEPLOY_TO_TARGET_GROUP_ANR = BLUE_TARGET_GROUP_ANR;
const LISTENER_RULE_PROD_HOST_HEADER = shell.env.LISTENER_RULE_PROD_HOST_HEADER;

// #AWS Credentials
if (shell.env.TRAVIS) {
    await setShellAwsEnvVariables(
        shell.env.AWS_ACCESS_KEY_ID,
        shell.env.AWS_SECRET_ACCESS_KEY
    );
}

const setActiveAndBetaVariables = activeTargetGroupAnr => {
    // Already Defaulted to Blue Target Group Switch to Green Deploy
    if (activeTargetGroupAnr === BLUE_TARGET_GROUP_ANR) {
        DEPLOY_TO_SERVERS = GREEN_SERVERS;
        ACTIVE_TARGET_GROUP_ANR = BLUE_TARGET_GROUP_ANR;
        DEPLOY_TO_TARGET_GROUP_ANR = GREEN_TARGET_GROUP_ANR;
    }
};

const initTargets = async () => {
    const activeTargetGroupAnr = await getActiveTargetGroupAnr(
        LOAD_BALANCER_LISTENER_ANR,
        BLUE_TARGET_GROUP_ANR,
        GREEN_TARGET_GROUP_ANR,
        LISTENER_RULE_PROD_HOST_HEADER
    );
    setActiveAndBetaVariables(activeTargetGroupAnr);
};

const swapTargetGroups = async () => {
    await switchRulesTargetGroup(
        PROD_RULE_ANR,
        DEPLOY_TO_TARGET_GROUP_ANR,
        "Move Beta to Prod"
    );
    await switchRulesTargetGroup(
        BETA_RULE_ANR,
        ACTIVE_TARGET_GROUP_ANR,
        "Move Prod to Beta"
    );
};

const deploy = async () => {
    await createImage();
    await deployToServersOnBetaGroup(
        DEPLOY_TO_SERVERS,
        DEPLOY_TO_TARGET_GROUP_ANR
    );

    if (DEPLOY_TO_BETA_ONLY) return 0;
    await swapTargetGroups();
};

await initTargets();
if (SWAP_TARGET_GROUPS) {
    await swapTargetGroups();
} else {
    await deploy();
}
