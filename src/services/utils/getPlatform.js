export default function getPlatform() {
    const platformList = {
        "Windows NT 10.0": "Windows 10",
        "Windows NT 6.2": "Windows 8",
        "Windows NT 6.1": "Windows 7",
        "Windows NT 6.0": "Windows Vista",
        "Windows NT 5.1": "Windows XP",
        "Windows NT 5.0": "Windows 2000",
        Android: "Android",
        iPhone: "iOS",
        iPad: "iOS",
        iPod: "iOS",
        Mac: "MacOS",
        Linux: "Linux",
        X11: "UNIX"
    };

    const { userAgent } = window.navigator;
    const foundPlatform = Object.entries(platformList).find(
        ([platform]) => userAgent.indexOf(platform) !== -1
    );

    return foundPlatform ? foundPlatform[1] : "NA";
}
