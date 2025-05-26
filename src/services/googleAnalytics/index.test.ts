import TagManager from "react-gtm-module";
import { checkProperties, EVENTS, pushEvent, sendEvent } from "./index";

jest.mock("react-gtm-module");
jest.mock("Shared/httpTools", () => ({
    isProd: false
}));

describe("Google Analytics Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        console.log = jest.fn();
        console.error = jest.fn();
    });

    describe("pushEvent", () => {
        it("should call TagManager.dataLayer with correct parameters", () => {
            const event = EVENTS.HOME_START_SUCCEED;
            const data = { someData: "value" };
            pushEvent(event, data);
            expect(TagManager.dataLayer).toHaveBeenCalledWith({
                dataLayer: { event, ...data }
            });
        });
    });

    describe("checkProperties", () => {
        it("should return true if all properties are defined", () => {
            expect(checkProperties("a", 1, true, {})).toBe(true);
        });

        it("should return false if any property is undefined", () => {
            expect(checkProperties("a", undefined, true)).toBe(false);
        });
    });

    describe("sendEvent", () => {
        it("should log attempt in non-production environment", async () => {
            await sendEvent(EVENTS.HOME_START_SUCCEED, { data: "test" });
            expect(console.log).toHaveBeenCalledWith(
                expect.stringContaining("Attempting to handle event"),
                expect.any(Object)
            );
        });

        it("should handle missing event handler", async () => {
            jest.mock("./eventHandlers/home/start_succeed.ts", () => {
                throw new Error("Module not found");
            });

            await sendEvent(EVENTS.HOME_START_SUCCEED);
            expect(console.error).toHaveBeenCalledWith(
                expect.stringContaining("No handler for event type")
            );
        });

        it("should handle event error", async () => {
            const mockHandler = jest.fn().mockImplementation(() => {
                throw new Error("Test error");
            });
            jest.mock("./eventHandlers/home/start_succeed.ts", () => ({
                default: mockHandler
            }));

            await sendEvent(EVENTS.HOME_START_SUCCEED);
            expect(console.error).toHaveBeenCalledWith(
                expect.stringContaining("Error handling event"),
                expect.any(Error)
            );
        });
    });
});
