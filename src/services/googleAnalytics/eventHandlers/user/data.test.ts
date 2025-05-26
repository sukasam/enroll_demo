import { Alpha2 } from "Constants/countryConfig/enums";
import { checkProperties, pushEvent } from "Services/googleAnalytics/index";
import handler from "./data";

// Mock the imported functions
jest.mock("Services/googleAnalytics/index", () => ({
    pushEvent: jest.fn(),
    checkProperties: jest.fn()
}));

describe("User Data Event Handler", () => {
    const mockEvent = "test_event";
    const mockData = {
        country: Alpha2.US,
        language: "en",
        referralId: "123",
        enrollerId: "456",
        sponsorId: "789",
        sponsorIsCustomize: true
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call pushEvent with correct parameters when all properties are valid", () => {
        (checkProperties as jest.Mock).mockReturnValue(true);

        handler(mockEvent as any, mockData);

        expect(checkProperties).toHaveBeenCalledWith(Alpha2.US, "en");
        expect(pushEvent).toHaveBeenCalledWith(mockEvent, {
            user_country: Alpha2.US,
            user_language: "en",
            referral_id: "123",
            enroller_id: "456",
            sponsor_id: "789",
            sponsor_is_customize: true
        });
    });

    it("should throw an error when required properties are missing", () => {
        (checkProperties as jest.Mock).mockReturnValue(false);

        expect(() => handler(mockEvent as any, mockData)).toThrow(
            "Missing required property!"
        );
        expect(checkProperties).toHaveBeenCalledWith(Alpha2.US, "en");
        expect(pushEvent).not.toHaveBeenCalled();
    });

    it("should use default values for optional properties when not provided", () => {
        (checkProperties as jest.Mock).mockReturnValue(true);

        const partialData = {
            country: Alpha2.US,
            language: "en"
        };

        handler(mockEvent as any, partialData as any);

        expect(pushEvent).toHaveBeenCalledWith(mockEvent, {
            user_country: Alpha2.US,
            user_language: "en",
            referral_id: "",
            enroller_id: "",
            sponsor_id: "",
            sponsor_is_customize: false
        });
    });
});
