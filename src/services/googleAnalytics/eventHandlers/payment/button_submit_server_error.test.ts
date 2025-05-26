import { checkProperties, pushEvent } from "Services/googleAnalytics/index";
import handler from "./button_submit_server_error";

jest.mock("Services/googleAnalytics/index");

describe("button_submit_server_error handler", () => {
    const mockEvent = "payment_button_submit_server_error";
    const mockData = {
        responseCode: 500,
        errorMessage: "Internal Server Error"
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (checkProperties as jest.Mock).mockReturnValue(true);
    });

    it("should call checkProperties with responseCode and errorMessage", () => {
        handler(mockEvent, mockData);
        expect(checkProperties).toHaveBeenCalledWith(
            500,
            "Internal Server Error"
        );
    });

    it("should call pushEvent with correct arguments when valid", () => {
        handler(mockEvent, mockData);
        expect(pushEvent).toHaveBeenCalledWith(mockEvent, {
            response_code: 500,
            error_message: "Internal Server Error"
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

    it("should handle different response codes and error messages", () => {
        const testData = { responseCode: 404, errorMessage: "Not Found" };
        handler(mockEvent, testData);
        expect(pushEvent).toHaveBeenCalledWith(mockEvent, {
            response_code: 404,
            error_message: "Not Found"
        });
    });
});
