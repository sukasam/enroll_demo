import { pushEvent } from "Services/googleAnalytics/index";
import handler from "./invalid_address_error";

// Mock the pushEvent function
jest.mock("Services/googleAnalytics/index", () => ({
    pushEvent: jest.fn()
}));

describe("invalid_address_error handler", () => {
    it("should call pushEvent with the provided event", () => {
        const mockEvent = "invalid_address_error" as const;

        handler(mockEvent as any);

        expect(pushEvent).toHaveBeenCalledTimes(1);
        expect(pushEvent).toHaveBeenCalledWith(mockEvent);
    });

    it("should work with different event structures", () => {
        const anotherMockEvent = {
            type: "INVALID_ADDRESS",
            details: "Street not found"
        };

        handler(anotherMockEvent as any);

        expect(pushEvent).toHaveBeenCalledTimes(1);
        expect(pushEvent).toHaveBeenCalledWith(anotherMockEvent);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
