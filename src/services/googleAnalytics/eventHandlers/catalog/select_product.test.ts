import * as gaService from "Services/googleAnalytics/index";
import handler from "./select_product";

// Mock the googleAnalytics service
jest.mock("Services/googleAnalytics/index", () => ({
    checkProperties: jest.fn(),
    pushEvent: jest.fn()
}));

describe("Catalog Select Product Event Handler", () => {
    const mockEvent = "select_product";
    const mockData = {
        sku: "ABC123",
        automatic: false
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call pushEvent with correct parameters when all properties are valid", () => {
        (gaService.checkProperties as jest.Mock).mockReturnValue(true);

        handler(mockEvent as gaService.Event["event"], mockData);

        expect(gaService.checkProperties).toHaveBeenCalledWith("ABC123", false);
        expect(gaService.pushEvent).toHaveBeenCalledWith(mockEvent, {
            sku: "ABC123",
            automatic: false
        });
    });

    it("should throw an error when checkProperties returns false", () => {
        (gaService.checkProperties as jest.Mock).mockReturnValue(false);

        expect(() =>
            handler(mockEvent as gaService.Event["event"], mockData)
        ).toThrow("Missing required property!");
        expect(gaService.pushEvent).not.toHaveBeenCalled();
    });

    it("should handle automatic selection correctly", () => {
        (gaService.checkProperties as jest.Mock).mockReturnValue(true);

        const automaticData = {
            sku: "XYZ789",
            automatic: true
        };

        handler(mockEvent as gaService.Event["event"], automaticData);

        expect(gaService.checkProperties).toHaveBeenCalledWith("XYZ789", true);
        expect(gaService.pushEvent).toHaveBeenCalledWith(mockEvent, {
            sku: "XYZ789",
            automatic: true
        });
    });

    it("should handle different SKU values", () => {
        (gaService.checkProperties as jest.Mock).mockReturnValue(true);

        const differentSkuData = {
            sku: "DEF456",
            automatic: false
        };

        handler(mockEvent as gaService.Event["event"], differentSkuData);

        expect(gaService.checkProperties).toHaveBeenCalledWith("DEF456", false);
        expect(gaService.pushEvent).toHaveBeenCalledWith(mockEvent, {
            sku: "DEF456",
            automatic: false
        });
    });
});
