import { pushEvent } from "Services/googleAnalytics/index";
import handler from "./button_address_changed";

jest.mock("Services/googleAnalytics/index");

describe("button_address_changed handler", () => {
    it("should call pushEvent with the provided event", () => {
        const mockEvent = "payment_button_address_changed";

        handler(mockEvent);

        expect(pushEvent).toHaveBeenCalledWith(mockEvent);
    });

    it("should not throw an error when called with a valid event", () => {
        expect(() => handler("payment_button_address_changed")).not.toThrow();
    });
});
