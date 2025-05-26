import { checkProperties, pushEvent } from "Services/googleAnalytics/index";
import handler from "./button_shipping_method_changed";

jest.mock("Services/googleAnalytics/index");

describe("button_shipping_method_changed handler", () => {
    const mockEvent = "payment_button_shipping_method_changed";
    const mockData = { shippingMethod: "express" };

    beforeEach(() => {
        jest.clearAllMocks();
        (checkProperties as jest.Mock).mockReturnValue(true);
    });

    it("should call checkProperties with shippingMethod", () => {
        handler(mockEvent, mockData);
        expect(checkProperties).toHaveBeenCalledWith("express");
    });

    it("should call pushEvent with correct arguments when valid", () => {
        handler(mockEvent, mockData);
        expect(pushEvent).toHaveBeenCalledWith(mockEvent, {
            shipping_method: "express"
        });
    });

    it("should throw an error when checkProperties returns false", () => {
        (checkProperties as jest.Mock).mockReturnValue(false);
        expect(() => handler(mockEvent, mockData)).toThrow(
            "Missing required property!"
        );
    });

    it("should not call pushEvent when checkProperties returns false", () => {
        (checkProperties as jest.Mock).mockReturnValue(false);
        try {
            handler(mockEvent, mockData);
        } catch (error) {
            console.log(error);
        }
        expect(pushEvent).not.toHaveBeenCalled();
    });
});
