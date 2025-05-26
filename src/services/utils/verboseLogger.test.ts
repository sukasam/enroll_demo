import { getCookie } from "cookies-next";
import { colors, consoleLogColor, styledLogMessage } from "./verboseLogger";

// Mock cookies-next
jest.mock("cookies-next", () => ({
    getCookie: jest.fn()
}));

describe("verboseLogger", () => {
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
        jest.clearAllMocks();
    });

    describe("consoleLogColor", () => {
        it("should not log when enrollVerbosLogger cookie is not set", () => {
            (getCookie as jest.Mock).mockReturnValue(null);
            consoleLogColor("Test message");
            expect(consoleLogSpy).not.toHaveBeenCalled();
        });

        it("should log with default color when enrollVerbosLogger cookie is set", () => {
            (getCookie as jest.Mock).mockReturnValue("true");
            consoleLogColor("Test message");
            expect(consoleLogSpy).toHaveBeenCalledWith(
                "\x1b[37m%s\x1b[0m",
                "Test message"
            );
        });

        it("should log with specified color when enrollVerbosLogger cookie is set", () => {
            (getCookie as jest.Mock).mockReturnValue("true");
            consoleLogColor("Test message", "red");
            expect(consoleLogSpy).toHaveBeenCalledWith(
                "\x1b[31m%s\x1b[0m",
                "Test message"
            );
        });
    });

    describe("styledLogMessage", () => {
        beforeEach(() => {
            (getCookie as jest.Mock).mockReturnValue("true");
        });

        it("should log styled message with additional information", () => {
            styledLogMessage("Test message", "blue", { key: "value" });
            expect(consoleLogSpy).toHaveBeenCalledWith(
                expect.stringContaining("\x1b[34m%s\x1b[0m"),
                expect.stringContaining("Test message")
            );
            expect(consoleLogSpy.mock.calls[0][1]).toMatch(
                /--- Test message : {"key":"value"}/
            );
        });

        it("should handle errors and log a message without caller information", () => {
            const error = new Error("Test error");
            error.stack = undefined;
            jest.spyOn(global, "Error").mockImplementation(() => error);

            styledLogMessage("Test message", "green");
            expect(consoleLogSpy).toHaveBeenCalledWith(
                "\x1b[32m%s\x1b[0m",
                '--- Test message : ""'
            );
        });
    });

    describe("colors", () => {
        it("should have the correct color codes", () => {
            expect(colors).toEqual({
                black: "30",
                red: "31",
                green: "32",
                yellow: "33",
                blue: "34",
                magenta: "35",
                cyan: "36",
                white: "37",
                gray: "90"
            });
        });
    });
});
