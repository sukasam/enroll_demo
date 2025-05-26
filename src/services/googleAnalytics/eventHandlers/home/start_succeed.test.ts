import * as gaService from "Services/googleAnalytics/index";
import handler from "./start_succeed";

// Mock the googleAnalytics service
jest.mock("Services/googleAnalytics/index", () => ({
    pushEvent: jest.fn()
}));

describe("Home Start Succeed Event Handler", () => {
    const mockEvent = "start_succeed";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call pushEvent with the correct event", () => {
        handler(mockEvent as gaService.Event["event"]);

        expect(gaService.pushEvent).toHaveBeenCalledWith(mockEvent);
    });

    it("should call pushEvent exactly once", () => {
        handler(mockEvent as gaService.Event["event"]);

        expect(gaService.pushEvent).toHaveBeenCalledTimes(1);
    });

    it("should work with different event names", () => {
        const differentEvent = "different_event";

        handler(differentEvent as gaService.Event["event"]);

        expect(gaService.pushEvent).toHaveBeenCalledWith(differentEvent);
    });

    it("should not throw an error when called with an empty string", () => {
        expect(() => handler("" as gaService.Event["event"])).not.toThrow();
        expect(gaService.pushEvent).toHaveBeenCalledWith("");
    });

    it("should pass through any event name without modification", () => {
        const complexEvent = "complex_event_name_123";

        handler(complexEvent as gaService.Event["event"]);

        expect(gaService.pushEvent).toHaveBeenCalledWith(complexEvent);
    });
});
