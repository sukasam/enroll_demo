import { getCookie } from "cookies-next";

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

function consoleLogColor(
    message: string,
    color: keyof typeof colors = "white",
    force = false
): void {
    // Docs https://logfetch.com/js-console-colors/
    if (getCookie("enrollVerbosLogger") || force) {
        console.log(`\x1b[${colors[color]}m%s\x1b[0m`, message);
    }
}

function styledLogMessage(
    message: string,
    color: keyof typeof colors = "white",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any = "",
    force = false
): void {
    const prefix = message.startsWith("---") ? "" : "--- ";
    try {
        const _message = `${prefix}${message} : ${JSON.stringify(data)}`;
        consoleLogColor(_message, color, force);
    } catch {
        consoleLogColor(`${prefix}${message}`, color, force);
    }
}

declare global {
    interface Console {
        vlog(
            message: string,
            color?: keyof typeof colors,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data?: any,
            force?: boolean
        ): void;
    }
}

function initVlog(): void {
    // Extend the console object to include vlog
    console.vlog = (
        message: string,
        color: keyof typeof colors = "white",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: any = "",
        force = false
    ): void => {
        styledLogMessage(message, color, data, force);
    };
}

export { colors, consoleLogColor, initVlog, styledLogMessage };
