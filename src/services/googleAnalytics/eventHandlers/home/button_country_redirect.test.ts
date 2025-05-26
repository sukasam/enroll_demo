import { Alpha2 } from "Constants/countryConfig/enums";
import * as gaService from "Services/googleAnalytics/index";
import handler from "./button_country_redirect";

// Mock the googleAnalytics service
jest.mock("Services/googleAnalytics/index", () => ({
    checkProperties: jest.fn(),
    pushEvent: jest.fn()
}));

describe("Home Button Country Redirect Event Handler", () => {
    const mockEvent = "country_redirect";
    const mockData = {
        country: Alpha2.US
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call pushEvent with correct parameters when all properties are valid", () => {
        (gaService.checkProperties as jest.Mock).mockReturnValue(true);

        handler(mockEvent as gaService.Event["event"], mockData);

        expect(gaService.checkProperties).toHaveBeenCalledWith(Alpha2.US);
        expect(gaService.pushEvent).toHaveBeenCalledWith(mockEvent, {
            country: Alpha2.US
        });
    });

    it("should throw an error when checkProperties returns false", () => {
        (gaService.checkProperties as jest.Mock).mockReturnValue(false);

        expect(() =>
            handler(mockEvent as gaService.Event["event"], mockData)
        ).toThrow("Missing required property!");
        expect(gaService.pushEvent).not.toHaveBeenCalled();
    });

    it("should handle different country values", () => {
        (gaService.checkProperties as jest.Mock).mockReturnValue(true);

        const testData = {
            country: Alpha2.FR
        };

        handler(mockEvent as gaService.Event["event"], testData);

        expect(gaService.checkProperties).toHaveBeenCalledWith(Alpha2.FR);
        expect(gaService.pushEvent).toHaveBeenCalledWith(mockEvent, {
            country: Alpha2.FR
        });
    });

    it("should work with all Alpha2 enum values", () => {
        (gaService.checkProperties as jest.Mock).mockReturnValue(true);

        Object.values(Alpha2).forEach(countryCode => {
            const testData = {
                country: countryCode
            };

            handler(mockEvent as gaService.Event["event"], testData);

            expect(gaService.checkProperties).toHaveBeenCalledWith(countryCode);
            expect(gaService.pushEvent).toHaveBeenCalledWith(mockEvent, {
                country: countryCode
            });
        });
    });
});
