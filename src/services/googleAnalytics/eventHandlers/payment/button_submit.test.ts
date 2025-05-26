import { checkProperties, pushEvent } from "Services/googleAnalytics/index";
import handler from "./button_submit";

jest.mock("Services/googleAnalytics/index");

describe("button_submit handler", () => {
    const mockEvent = "payment_button_submit";
    const mockData = {
        shippingMethod: "express",
        paymentMethod: "credit_card"
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (checkProperties as jest.Mock).mockReturnValue(true);
    });

    it("should call checkProperties with shippingMethod and paymentMethod", () => {
        handler(mockEvent, mockData);
        expect(checkProperties).toHaveBeenCalledWith("express", "credit_card");
    });

    it("should call pushEvent with correct arguments when valid", () => {
        handler(mockEvent, mockData);
        expect(pushEvent).toHaveBeenCalledWith(mockEvent, {
            shipping_method: "express",
            payment_method: "credit_card"
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

    it("should handle different shipping and payment methods", () => {
        const testData = {
            shippingMethod: "standard",
            paymentMethod: "paypal"
        };
        handler(mockEvent, testData);
        expect(pushEvent).toHaveBeenCalledWith(mockEvent, {
            shipping_method: "standard",
            payment_method: "paypal"
        });
    });
});
