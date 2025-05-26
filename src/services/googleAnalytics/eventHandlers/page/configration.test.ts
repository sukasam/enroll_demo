import { Alpha2 } from "Constants/countryConfig/enums";
import * as gaService from "Services/googleAnalytics/index";
import handler from "./configration";

// Mock the googleAnalytics service
jest.mock("Services/googleAnalytics/index", () => ({
    checkProperties: jest.fn(),
    pushEvent: jest.fn()
}));

describe("Page Configuration Event Handler", () => {
    const mockEvent = "page_view";
    const mockData = {
        country: Alpha2.US,
        language: "en"
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call pushEvent with correct parameters when all properties are valid", () => {
        (gaService.checkProperties as jest.Mock).mockReturnValue(true);

        handler(mockEvent as gaService.Event["event"], mockData);

        expect(gaService.checkProperties).toHaveBeenCalledWith(Alpha2.US, "en");
        expect(gaService.pushEvent).toHaveBeenCalledWith(mockEvent, {
            user_country: Alpha2.US,
            user_language: "en"
        });
    });

    it("should throw an error when checkProperties returns false", () => {
        (gaService.checkProperties as jest.Mock).mockReturnValue(false);

        expect(() =>
            handler(mockEvent as gaService.Event["event"], mockData)
        ).toThrow("Missing required property!");
        expect(gaService.pushEvent).not.toHaveBeenCalled();
    });

    it("should handle different country and language values", () => {
        (gaService.checkProperties as jest.Mock).mockReturnValue(true);

        const testData = {
            country: Alpha2.FR,
            language: "fr"
        };

        handler(mockEvent as gaService.Event["event"], testData);

        expect(gaService.checkProperties).toHaveBeenCalledWith(Alpha2.FR, "fr");
        expect(gaService.pushEvent).toHaveBeenCalledWith(mockEvent, {
            user_country: Alpha2.FR,
            user_language: "fr"
        });
    });
});
