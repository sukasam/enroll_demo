import { pushEvent } from "Services/googleAnalytics/index";
import handler from "./new_account_succeed";

jest.mock("Services/googleAnalytics/index", () => ({
    pushEvent: jest.fn()
}));

describe("new_account_succeed handler", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call pushEvent with the provided event", () => {
        const mockEvent = "new_account_succeed" as const;
        handler(mockEvent as any);
        expect(pushEvent).toHaveBeenCalledWith(mockEvent);
        expect(pushEvent).toHaveBeenCalledTimes(1);
    });

    it("should handle various event types", () => {
        const events = [
            "home_start_succeed",
            "login_button_submit",
            "user_data"
        ];
        events.forEach(event => {
            handler(event as any);
            expect(pushEvent).toHaveBeenCalledWith(event);
        });
        expect(pushEvent).toHaveBeenCalledTimes(events.length);
    });
});
