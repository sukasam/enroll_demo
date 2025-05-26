import { checkProperties, pushEvent } from "Services/googleAnalytics/index";
import handler from "./button_submit_validation_error";

jest.mock("Services/googleAnalytics/index");

describe("button_submit_validation_error handler", () => {
    const mockEvent = "payment_button_submit_validation_error";
    const mockData = { fieldName: "creditCardNumber" };

    beforeEach(() => {
        jest.clearAllMocks();
        (checkProperties as jest.Mock).mockReturnValue(true);
    });

    it("should call checkProperties with fieldName", () => {
        handler(mockEvent, mockData);
        expect(checkProperties).toHaveBeenCalledWith("creditCardNumber");
    });

    it("should call pushEvent with correct arguments when valid", () => {
        handler(mockEvent, mockData);
        expect(pushEvent).toHaveBeenCalledWith(mockEvent, {
            field_name: "creditCardNumber"
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

    it("should handle different field names", () => {
        const testData = { fieldName: "expirationDate" };
        handler(mockEvent, testData);
        expect(pushEvent).toHaveBeenCalledWith(mockEvent, {
            field_name: "expirationDate"
        });
    });
});
