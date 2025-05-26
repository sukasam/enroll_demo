import { renderHook, waitFor } from "@testing-library/react";
import { getCountryConfig } from "Constants/countryConfig";
import { Alpha2 } from "Constants/countryConfig/enums";
import { validateSponsor } from "Hydra/validateSponsor";
import { getFirstValidFullName, getFullName } from "Services/utils/fullName";
import isRefValid from "Services/utils/refValidation";
import useAvailableLanguages, { checkRefID, checkSponsor } from "./hooks";

jest.mock("Constants/countryConfig", () => ({
    getCountryConfig: jest.fn()
}));

jest.mock("Constants/languages", () => [
    { label: "English", value: "en", defaultCountry: "US" },
    { label: "Spanish", value: "es", defaultCountry: "US" },
    { label: "French", value: "fr", defaultCountry: "CA" }
]);

jest.mock("Hydra/validateSponsor", () => ({
    validateSponsor: jest.fn()
}));

jest.mock("Services/utils/refValidation", () => ({
    __esModule: true,
    default: jest.fn()
}));

jest.mock("Services/utils/fullName", () => ({
    getFullName: jest.fn(),
    getFirstValidFullName: jest.fn()
}));

describe("useAvailableLanguages", () => {
    it("should return available languages for a country", async () => {
        (getCountryConfig as jest.Mock).mockReturnValue({
            languages: [
                { name: "English", code: "EN" },
                { name: "Spanish", code: "ES" }
            ]
        });

        const { result } = renderHook(() => useAvailableLanguages(Alpha2.US));

        await waitFor(() => {
            expect(result.current).toEqual([
                { label: "English", value: "en", defaultCountry: "US" },
                { label: "Spanish", value: "es", defaultCountry: "US" }
            ]);
        });
    });

    it("should return all languages", async () => {
        const { result } = renderHook(() => useAvailableLanguages(null));

        await waitFor(() => {
            expect(result.current).toEqual([
                { label: "English", value: "en", defaultCountry: "US" },
                { label: "Spanish", value: "es", defaultCountry: "US" },
                { label: "French", value: "fr", defaultCountry: "CA" }
            ]);
        });
    });

    it("should not add English if not present", async () => {
        (getCountryConfig as jest.Mock).mockReturnValue({
            languages: [{ name: "French", code: "FR" }]
        });

        const { result } = renderHook(() => useAvailableLanguages(Alpha2.FR));

        await waitFor(() => {
            expect(result.current).toEqual([
                { label: "French", value: "fr", defaultCountry: "FR" }
            ]);
        });
    });
});

describe("checkSponsor", () => {
    const mockSetFormSponsorId = jest.fn();
    const mockSetFormSponsorFullName = jest.fn();
    const mockSetIsLoading = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return "error_invalid_sponsor" if sponsor is invalid', async () => {
        (isRefValid as jest.Mock).mockResolvedValue({ isValid: false });
        const result = await checkSponsor(
            "123",
            "456",
            mockSetFormSponsorId,
            mockSetFormSponsorFullName,
            mockSetIsLoading
        );
        expect(result).toBe("error_invalid_sponsor");
        expect(mockSetFormSponsorFullName).toHaveBeenCalledWith("");
    });

    it('should return "error_invalid_sponsor" if validateSponsor returns an error', async () => {
        (isRefValid as jest.Mock).mockResolvedValue({
            isValid: true,
            unicityID: "123"
        });
        (validateSponsor as jest.Mock).mockResolvedValue({ error: true });
        const result = await checkSponsor(
            "123",
            "456",
            mockSetFormSponsorId,
            mockSetFormSponsorFullName,
            mockSetIsLoading
        );
        expect(result).toBe("error_invalid_sponsor");
        expect(mockSetFormSponsorFullName).toHaveBeenCalledWith("");
    });

    it("should return true and set sponsor details if sponsor is valid", async () => {
        (isRefValid as jest.Mock).mockResolvedValue({
            isValid: true,
            unicityID: "123",
            refResults: { humanName: "John Doe" }
        });
        (validateSponsor as jest.Mock).mockResolvedValue({ error: false });
        (getFirstValidFullName as jest.Mock).mockReturnValue("John Doe");
        (getFullName as jest.Mock).mockReturnValue("John Doe");
        const result = await checkSponsor(
            "123",
            "456",
            mockSetFormSponsorId,
            mockSetFormSponsorFullName,
            mockSetIsLoading
        );
        expect(result).toBe(true);
        expect(mockSetFormSponsorId).toHaveBeenCalledWith("123");
        expect(mockSetFormSponsorFullName).toHaveBeenCalledWith("John Doe");
    });
});

describe("checkRefID", () => {
    const mockSetUnicityId = jest.fn();
    const mockSetFullName = jest.fn();
    const mockSetEnrollerAllFullName = jest.fn();
    const mockSetIsLoading = jest.fn();
    const mockTranslate = jest.fn(key => key);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return "error_invalid_referrer" if referrer is invalid', async () => {
        (isRefValid as jest.Mock).mockResolvedValue({ isValid: false });
        const result = await checkRefID(
            "123",
            mockSetUnicityId,
            mockSetFullName,
            mockSetEnrollerAllFullName,
            mockSetIsLoading,
            mockTranslate
        );
        expect(result).toBe("error_invalid_referrer");
        expect(mockSetFullName).toHaveBeenCalledWith("");
    });

    it("should return true and set referrer details if referrer is valid", async () => {
        (isRefValid as jest.Mock).mockResolvedValue({
            isValid: true,
            unicityID: "123",
            refResults: { humanName: "Jane Doe" }
        });
        (getFirstValidFullName as jest.Mock).mockReturnValue("Jane Doe");
        const result = await checkRefID(
            "123",
            mockSetUnicityId,
            mockSetFullName,
            mockSetEnrollerAllFullName,
            mockSetIsLoading,
            mockTranslate
        );
        expect(result).toBe(true);
        expect(mockSetUnicityId).toHaveBeenCalledWith("123");
        expect(mockSetFullName).toHaveBeenCalledWith("Jane Doe");
    });

    it("should use preferredName when available", async () => {
        (isRefValid as jest.Mock).mockResolvedValue({
            isValid: true,
            unicityID: "123",
            refResults: {
                preferredName: { firstName: "Jane", lastName: "Preferred" },
                humanName: { firstName: "Jane", lastName: "Doe" }
            }
        });
        (getFirstValidFullName as jest.Mock).mockReturnValueOnce(
            "Jane Preferred"
        );

        const result = await checkRefID(
            "123",
            mockSetUnicityId,
            mockSetFullName,
            mockSetEnrollerAllFullName,
            mockSetIsLoading,
            mockTranslate
        );

        expect(result).toBe(true);
        expect(mockSetUnicityId).toHaveBeenCalledWith("123");
        expect(getFirstValidFullName).toHaveBeenCalledWith([
            { firstName: "Jane", lastName: "Preferred" },
            { firstName: "Jane", lastName: "Doe" }
        ]);
        expect(mockSetFullName).toHaveBeenCalledWith("Jane Preferred");
    });

    it("should use humanName when preferredName is available but contains empty strings", async () => {
        (isRefValid as jest.Mock).mockResolvedValue({
            isValid: true,
            unicityID: "123",
            refResults: {
                preferredName: { firstName: "", lastName: "" },
                humanName: { firstName: "Jack", lastName: "Doe" }
            }
        });
        (getFirstValidFullName as jest.Mock).mockReturnValueOnce("Jack Doe");

        const result = await checkRefID(
            "123",
            mockSetUnicityId,
            mockSetFullName,
            mockSetEnrollerAllFullName,
            mockSetIsLoading,
            mockTranslate
        );

        expect(result).toBe(true);
        expect(mockSetUnicityId).toHaveBeenCalledWith("123");
        expect(getFirstValidFullName).toHaveBeenCalledWith([
            { firstName: "", lastName: "" },
            { firstName: "Jack", lastName: "Doe" }
        ]);
        expect(mockSetFullName).toHaveBeenCalledWith("Jack Doe");
    });

    it("should fallback to humanName when preferredName is not available", async () => {
        (isRefValid as jest.Mock).mockResolvedValue({
            isValid: true,
            unicityID: "123",
            refResults: {
                humanName: { firstName: "Jack", lastName: "Doe" }
            }
        });
        (getFirstValidFullName as jest.Mock).mockReturnValueOnce("Jack Doe");

        const result = await checkRefID(
            "123",
            mockSetUnicityId,
            mockSetFullName,
            mockSetEnrollerAllFullName,
            mockSetIsLoading,
            mockTranslate
        );

        expect(result).toBe(true);
        expect(mockSetUnicityId).toHaveBeenCalledWith("123");
        expect(getFirstValidFullName).toHaveBeenCalledWith([
            undefined,
            { firstName: "Jack", lastName: "Doe" }
        ]);
        expect(mockSetFullName).toHaveBeenCalledWith("Jack Doe");
    });
});
