const LOAD_BALANCER_LISTENER_ANR =
    "arn:aws:elasticloadbalancing:us-east-1:564857702270:listener/app/Enroll-BlueGreen/032be68235c9b317/7132c1006d1dfba4";

const PROD_RULE_ANR =
    "arn:aws:elasticloadbalancing:us-east-1:564857702270:listener-rule/app/Enroll-BlueGreen/032be68235c9b317/7132c1006d1dfba4/1ba93d2d557e4bda";
const BETA_RULE_ANR =
    "arn:aws:elasticloadbalancing:us-east-1:564857702270:listener-rule/app/Enroll-BlueGreen/032be68235c9b317/7132c1006d1dfba4/cc98e9168b22178a";

const BLUE_TARGET_GROUP_ANR =
    "arn:aws:elasticloadbalancing:us-east-1:564857702270:targetgroup/Enroll-Blue/a9b64caca946b4b0";
const GREEN_TARGET_GROUP_ANR =
    "arn:aws:elasticloadbalancing:us-east-1:564857702270:targetgroup/Enroll-Green/cbdf5536168feed3";

const BLUE_SERVERS = [
    { name: "Enroll-Blue-1", ID: "i-08b73ff295c8a7029", IP: "52.2.207.201" },
    { name: "Enroll-Blue-2", ID: "i-086e2528f9e9d1741", IP: "44.207.234.142" }
];
const GREEN_SERVERS = [
    { name: "Enroll-Green-1", ID: "i-05f228fdf1492750f", IP: "44.198.49.59" },
    { name: "Enroll-Green-2", ID: "i-065e0ab2ae570981e", IP: "98.85.191.7" }
];

export {
    BETA_RULE_ANR,
    BLUE_SERVERS,
    BLUE_TARGET_GROUP_ANR,
    GREEN_SERVERS,
    GREEN_TARGET_GROUP_ANR,
    LOAD_BALANCER_LISTENER_ANR,
    PROD_RULE_ANR
};
