import shell from "shelljs";
import { consoleLogColor, shellExec } from "./utils.js";

const setShellAwsEnvVariables = async (awsAccessKeyID, awsSecretAccessKey) => {
    consoleLogColor("Setup AWS Configs", "blue");
    await shellExec("mkdir ~/.aws");
    await shellExec("mv ./scripts/config ~/.aws && touch ~/.aws/credentials");
    await shellExec(
        `echo '[default]\naws_access_key_id = ${awsAccessKeyID}\naws_secret_access_key = ${awsSecretAccessKey}' >> ~/.aws/credentials`
    );
    consoleLogColor("Succeeded in Setup AWS Configs", "green");
};

const getActiveTargetGroupAnr = async (
    listenerAnr,
    blueANR,
    greenANR,
    hostHeader
) => {
    consoleLogColor(`blueANR: ${blueANR}`, "gray");
    consoleLogColor(`greenANR: ${greenANR}`, "gray");
    const commandGetActiveTargetGroupANR = `aws elbv2 describe-rules --listener-arn ${listenerAnr} | jq '.Rules[] | select(.Conditions[].Field == "host-header" and .Conditions[].Values[] == "${hostHeader}")' | jq '.Actions[].TargetGroupArn'`;
    const result = await shellExec(commandGetActiveTargetGroupANR);
    const activeTargetGroupAnr = result.replace(/"/g, "").trim();
    consoleLogColor(`activeTargetGroupAnr: ${activeTargetGroupAnr}`, "gray");

    if (activeTargetGroupAnr === blueANR || activeTargetGroupAnr === greenANR)
        return activeTargetGroupAnr;
    else {
        consoleLogColor(
            `Error! Failed Target Group Identification: ${hostHeader}`,
            "red"
        );
        shell.exit(1);
    }
};

const switchRulesTargetGroup = async (ruleAnr, newTargetGroup, message) => {
    consoleLogColor(`Switching Target Group: ${message}`, "blue");
    const commandSwitchRules = `aws elbv2 modify-rule --rule-arn ${ruleAnr} --actions Type=forward,TargetGroupArn=${newTargetGroup}`;
    await shellExec(commandSwitchRules);
    consoleLogColor("Succeeded in Switching Target Group", "green");
};

const waitUntilHealthy = async (ID, name, deployToTargetGroupANR) => {
    const pollUntilHealthy = async () => {
        consoleLogColor(`Checking if ${name} is healthy...`, "blue");
        let results = await shellExec(
            `aws elbv2 describe-target-health --cli-input-json\
            '{"TargetGroupArn":"${deployToTargetGroupANR}","Targets":[{"Id":"${ID}"}]}'`
        );

        const resJSON = JSON.parse(results);
        const status = resJSON.TargetHealthDescriptions[0].TargetHealth.State;
        if (status === "initial") {
            consoleLogColor(
                `Target is still re-initializing. Current status: ${status}`
            );
            consoleLogColor("Waiting 10s before retrying");
            let wait = 0;
            const waitInterval = setInterval(async () => {
                if (wait >= 10) {
                    clearInterval(waitInterval);
                    await pollUntilHealthy();
                } else {
                    wait += 1;
                    consoleLogColor(`${wait}....`);
                }
            }, 1000);
        } else if (status === "healthy") {
            consoleLogColor(`Success! ${name} is Reregistered!`, "green");
        } else {
            consoleLogColor(
                `Received unexpected server status: ${status}. Exiting...`,
                "red"
            );
            shell.exit(1);
        }
    };

    await pollUntilHealthy();
};

const deregister = async (ID, name, deployToTargetGroupANR) => {
    consoleLogColor(`Initializing ${name} deregistration process...`, "blue");
    await shellExec(`aws elbv2 deregister-targets --cli-input-json\
    '{"TargetGroupArn":"${deployToTargetGroupANR}","Targets":[{"Id":"${ID}","Port":80}]}'`);
    await shellExec(`aws elbv2 wait target-deregistered --cli-input-json\
    '{"TargetGroupArn":"${deployToTargetGroupANR}","Targets":[{"Id":"${ID}","Port":80}]}'`);
    consoleLogColor(`Success!! ${name} is Deregistered!!`, "green");
};

const reregister = async (ID, name, deployToTargetGroupANR) => {
    consoleLogColor(`Reregister Initialized. ${name} reregistering...`, "blue");
    await shellExec(
        `aws elbv2 register-targets --cli-input-json\
             '{"TargetGroupArn":"${deployToTargetGroupANR}","Targets":[{"Id":"${ID}"}]}'`
    );
    consoleLogColor(`${name} scheduled to be re-registered`, "green");
};

const rebuild = async (IP, name) => {
    consoleLogColor("Rebuild Process Initializing...", "blue");
    await shellExec(
        `docker context create ${name} --docker "host=ssh://ubuntu@${IP}"`
    );

    consoleLogColor(`Docker context ${name} created!`);
    await shellExec(`docker context use ${name}`);
    consoleLogColor("If having issues check IP addresses did not change. See Enrollment ReadMe for inscructions on IP addresses.", "gray");
    await shellExec("docker load -i ./dockerimage/enroll.tar.gz");
    await shellExec("docker-compose down --remove-orphans");
    await shellExec("docker-compose up -d enroll");
    await shellExec(
        `ssh -o StrictHostKeyChecking=no ubuntu@${IP} "docker system prune -a -f --volumes"`
    );
    consoleLogColor("Server Rebuilt!!", "green");
};

const deployToServersOnBetaGroup = async (
    deployToServers,
    deployToTargetGroupANR
) => {
    for (let idx = 0; idx < deployToServers.length; idx++) {
        const { IP, ID, name } = deployToServers[idx];

        consoleLogColor(`Starting deployment for server ${name}`, "blue");
        // await deregister(ID, name, deployToTargetGroupANR);
        await rebuild(IP, name);
        // await reregister(ID, name, deployToTargetGroupANR);
        await waitUntilHealthy(ID, name, deployToTargetGroupANR);
        consoleLogColor(`Completed deployment for server ${name}`, "green");
    }
    consoleLogColor(
        "Completed deployment for all servers in Target Group",
        "green"
    );
};

export {
    deployToServersOnBetaGroup,
    getActiveTargetGroupAnr,
    setShellAwsEnvVariables,
    switchRulesTargetGroup
};
