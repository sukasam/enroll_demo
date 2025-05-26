import { renderHook } from "@testing-library/react";
import { useCountryConfig } from "Constants/countryConfig";
import { getCookie } from "cookies-next";
import useAllowGuide from "./useAllowGuide";

jest.mock("Constants/countryConfig");
jest.mock("cookies-next");

describe("useAllowGuide", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return true when alwaysShowGuide is true", () => {
        (useCountryConfig as jest.Mock).mockReturnValue({
            alwaysShowGuide: true
        });
        (getCookie as jest.Mock).mockReturnValue(undefined);

        const { result } = renderHook(() => useAllowGuide());

        expect(result.current).toBe(true);
    });

    it('should return true when allowGuide cookie is "true"', () => {
        (useCountryConfig as jest.Mock).mockReturnValue({
            alwaysShowGuide: false
        });
        (getCookie as jest.Mock).mockReturnValue("true");

        const { result } = renderHook(() => useAllowGuide());

        expect(result.current).toBe(true);
    });

    it('should return false when alwaysShowGuide is false and allowGuide cookie is not "true"', () => {
        (useCountryConfig as jest.Mock).mockReturnValue({
            alwaysShowGuide: false
        });
        (getCookie as jest.Mock).mockReturnValue("false");

        const { result } = renderHook(() => useAllowGuide());

        expect(result.current).toBe(false);
    });

    it('should return false when countryConfig is undefined and allowGuide cookie is not "true"', () => {
        (useCountryConfig as jest.Mock).mockReturnValue(undefined);
        (getCookie as jest.Mock).mockReturnValue("false");

        const { result } = renderHook(() => useAllowGuide());

        expect(result.current).toBe(false);
    });

    it("should return false when allowGuide cookie is undefined", () => {
        (useCountryConfig as jest.Mock).mockReturnValue({
            alwaysShowGuide: false
        });
        (getCookie as jest.Mock).mockReturnValue(undefined);

        const { result } = renderHook(() => useAllowGuide());

        expect(result.current).toBe(false);
    });

    it("should return false when both countryConfig and allowGuide cookie are undefined", () => {
        (useCountryConfig as jest.Mock).mockReturnValue(undefined);
        (getCookie as jest.Mock).mockReturnValue(undefined);

        const { result } = renderHook(() => useAllowGuide());

        expect(result.current).toBe(false);
    });
});
