import { checkProperties, pushEvent } from "Services/googleAnalytics/index";
import handler from "./submit_succeed";

jest.mock("Services/googleAnalytics/index");

describe("submit_succeed handler", () => {
    const mockEvent = "payment_submit_succeed";
    const mockData = {
        sku: "PROD123",
        shippingMethod: "express",
        paymentMethod: "credit_card",
        price: 99.99,
        userId: "USER456"
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (checkProperties as jest.Mock).mockReturnValue(true);
    });

    it("should call checkProperties with correct arguments", () => {
        handler(mockEvent, mockData);
        expect(checkProperties).toHaveBeenCalledWith(
            "PROD123",
            "express",
            "credit_card",
            99.99
        );
    });

    it("should call pushEvent with correct arguments when valid", () => {
        handler(mockEvent, mockData);
        expect(pushEvent).toHaveBeenCalledWith(mockEvent, {
            sku: "PROD123",
            shipping_method: "express",
            payment_method: "credit_card",
            price: 99.99,
            user_id: "USER456"
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

    it("should handle different input values", () => {
        const testData = {
            sku: "PROD789",
            shippingMethod: "standard",
            paymentMethod: "paypal",
            price: 49.99,
            userId: "USER789"
        };
        handler(mockEvent, testData);
        expect(pushEvent).toHaveBeenCalledWith(mockEvent, {
            sku: "PROD789",
            shipping_method: "standard",
            payment_method: "paypal",
            price: 49.99,
            user_id: "USER789"
        });
    });
});
