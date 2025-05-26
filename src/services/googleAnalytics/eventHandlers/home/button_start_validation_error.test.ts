import * as gaService from "Services/googleAnalytics/index";
import handler from "./button_start_validation_error";

// Mock the googleAnalytics service
jest.mock("Services/googleAnalytics/index", () => ({
    checkProperties: jest.fn(),
    pushEvent: jest.fn()
}));

describe("Home Button Start Validation Error Event Handler", () => {
    const mockEvent = "validation_error";
    const mockData = {
        fieldName: "email"
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call pushEvent with correct parameters when all properties are valid", () => {
        (gaService.checkProperties as jest.Mock).mockReturnValue(true);

        handler(mockEvent as gaService.Event["event"], mockData);

        expect(gaService.checkProperties).toHaveBeenCalledWith("email");
        expect(gaService.pushEvent).toHaveBeenCalledWith(mockEvent, {
            field_name: "email"
        });
    });

    it("should throw an error when checkProperties returns false", () => {
        (gaService.checkProperties as jest.Mock).mockReturnValue(false);

        expect(() =>
            handler(mockEvent as gaService.Event["event"], mockData)
        ).toThrow("Missing required property!");
        expect(gaService.pushEvent).not.toHaveBeenCalled();
    });

    it("should handle different field names", () => {
        (gaService.checkProperties as jest.Mock).mockReturnValue(true);

        const testData = {
            fieldName: "password"
        };

        handler(mockEvent as gaService.Event["event"], testData);

        expect(gaService.checkProperties).toHaveBeenCalledWith("password");
        expect(gaService.pushEvent).toHaveBeenCalledWith(mockEvent, {
            field_name: "password"
        });
    });

    it("should work with empty string as field name", () => {
        (gaService.checkProperties as jest.Mock).mockReturnValue(true);

        const testData = {
            fieldName: ""
        };

        handler(mockEvent as gaService.Event["event"], testData);

        expect(gaService.checkProperties).toHaveBeenCalledWith("");
        expect(gaService.pushEvent).toHaveBeenCalledWith(mockEvent, {
            field_name: ""
        });
    });

    it("should work with special characters in field name", () => {
        (gaService.checkProperties as jest.Mock).mockReturnValue(true);

        const testData = {
            fieldName: "user@email.com"
        };

        handler(mockEvent as gaService.Event["event"], testData);

        expect(gaService.checkProperties).toHaveBeenCalledWith(
            "user@email.com"
        );
        expect(gaService.pushEvent).toHaveBeenCalledWith(mockEvent, {
            field_name: "user@email.com"
        });
    });
});
