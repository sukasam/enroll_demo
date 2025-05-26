import { checkProperties, pushEvent } from "Services/googleAnalytics/index";
import handler from "./method_selected";

jest.mock("Services/googleAnalytics/index");

describe("method_selected handler", () => {
    const mockEvent = "payment_method_selected";
    const mockData = { paymentMethod: "credit_card", automatic: false };

    beforeEach(() => {
        jest.clearAllMocks();
        (checkProperties as jest.Mock).mockReturnValue(true);
    });

    it("should call checkProperties with paymentMethod and automatic", () => {
        handler(mockEvent, mockData);
        expect(checkProperties).toHaveBeenCalledWith("credit_card", false);
    });

    it("should call pushEvent with correct arguments when valid", () => {
        handler(mockEvent, mockData);
        expect(pushEvent).toHaveBeenCalledWith(mockEvent, {
            payment_method: "credit_card",
            automatic: false
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
            // Ignore the error
        }
        expect(pushEvent).not.toHaveBeenCalled();
    });

    it("should handle different payment methods and automatic values", () => {
        const testData = { paymentMethod: "paypal", automatic: true };
        handler(mockEvent, testData);
        expect(pushEvent).toHaveBeenCalledWith(mockEvent, {
            payment_method: "paypal",
            automatic: true
        });
    });
});
