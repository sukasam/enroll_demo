import { renderHook } from "@testing-library/react";
import { getCountryConfig } from "Constants/countryConfig";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import getMe from "Hydra/getMe";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import { getAuthToken } from "../../utils/authUtils";
import useLoginHooks from "./LoginHooks";

// Mock the imported modules
jest.mock("cookies-next");
jest.mock("Hydra/getMe");
jest.mock("Services/mixpanel/initializeMixPanel");
jest.mock("Constants/countryConfig");
jest.mock("Contexts/translation");
jest.mock("../../utils/authUtils");

describe("useLoginHooks", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set auth cookie", () => {
        const { result } = renderHook(() => useLoginHooks());
        const token = "test-token";
        result.current.setAuthCookie(token);

        expect(setCookie).toHaveBeenCalledWith(
            "_unicityToken_v5_enroll",
            token,
            expect.any(Object)
        );
    });

    it("should get user token from cookie", () => {
        (getCookie as jest.Mock).mockReturnValue("test-token");
        const { result } = renderHook(() => useLoginHooks());

        expect(result.current.getUserTokenFromCookie()).toBe("test-token");
    });

    it("should delete auth cookie", () => {
        const { result } = renderHook(() => useLoginHooks());
        result.current.deleteAuthCookie();

        expect(deleteCookie).toHaveBeenCalledWith("_unicityToken_v5_enroll");
    });

    it("should set logged in data", async () => {
        const mockUserResponse = {
            ok: true,
            preferredLocale: "en-US",
            market: "US",
            type: "member",
            humanName: { firstName: "John", lastName: "Doe" },
            mobilePhone: "1234567890",
            email: "john@example.com",
            id: { unicity: "12345" },
            enroller: {
                id: "enroller123",
                humanName: { firstName: "Enroller", lastName: "Name" }
            },
            sponsor: {
                id: "sponsor123",
                humanName: { firstName: "Sponsor", lastName: "Name" }
            },
            href: "https://example.com/user",
            mainAddress: { country: "US", state: "CA" },
            joinDate: "2023-01-01"
        };

        (getMe as jest.Mock).mockResolvedValue(mockUserResponse);
        (getCountryConfig as jest.Mock).mockReturnValue({ someConfig: true });
        (getAuthToken as jest.Mock).mockReturnValue(null);

        const { result } = renderHook(() => useLoginHooks());

        const setUserData = jest.fn();
        const setHref = jest.fn();
        const setUserToken = jest.fn();
        const setEnrollerFullName = jest.fn();
        const setSponsorFullName = jest.fn();
        const setEnrollerId = jest.fn();
        const setSponsorId = jest.fn();
        const setMainAddress = jest.fn();

        await result.current.setLoggedInData({
            userToken: "test-token",
            setUserData,
            setHref,
            setUserToken,
            setEnrollerFullName,
            setSponsorFullName,
            setEnrollerId,
            setSponsorId,
            setMainAddress
        });

        expect(setUserData).toHaveBeenCalledWith({
            firstName: "John",
            lastName: "Doe",
            phoneNumber: "1234567890",
            email: "john@example.com",
            fullName: "John Doe",
            unicityId: "12345"
        });
        expect(setHref).toHaveBeenCalledWith("https://example.com/user");
        expect(setUserToken).toHaveBeenCalledWith("test-token");
        expect(setEnrollerFullName).toHaveBeenCalledWith("Enroller Name");
        expect(setSponsorFullName).toHaveBeenCalledWith("Sponsor Name");
        expect(setEnrollerId).toHaveBeenCalledWith("enroller123");
        expect(setSponsorId).toHaveBeenCalledWith("sponsor123");
        expect(setMainAddress).toHaveBeenCalledWith({
            country: "US",
            state: "CA"
        });
        expect(mixpanelService.identify).toHaveBeenCalledWith("12345");
        expect(mixpanelService.setPeopleProperties).toHaveBeenCalledTimes(2);
        expect(mixpanelService.registerSuperProperties).toHaveBeenCalled();
        expect(mixpanelService.trackEvent).toHaveBeenCalledWith(
            "enr_sign_in_completed",
            expect.any(Object)
        );
    });

    it("should throw an error if user data fetch fails", async () => {
        (getMe as jest.Mock).mockResolvedValue({ ok: false });

        const { result } = renderHook(() => useLoginHooks());

        await expect(
            result.current.setLoggedInData({
                userToken: "test-token",
                setUserData: jest.fn(),
                setHref: jest.fn(),
                setUserToken: jest.fn(),
                setEnrollerFullName: jest.fn(),
                setSponsorFullName: jest.fn(),
                setEnrollerId: jest.fn(),
                setSponsorId: jest.fn(),
                setMainAddress: jest.fn()
            })
        ).rejects.toThrow("failed_to_fetch_user_data");
    });

    it("should throw an error if market is not supported", async () => {
        const mockUserResponse = {
            ok: true,
            market: "UNSUPPORTED",
            type: "member",
            id: { unicity: "12345" },
            humanName: { fullName: "John Doe" },
            email: "john@example.com",
            joinDate: "2023-01-01",
            enroller: { id: "enroller123" },
            sponsor: { id: "sponsor123" },
            mainAddress: { country: "US", state: "CA" }
        };

        (getMe as jest.Mock).mockResolvedValue(mockUserResponse);
        (getCountryConfig as jest.Mock).mockReturnValue(null);

        const { result } = renderHook(() => useLoginHooks());

        await expect(
            result.current.setLoggedInData({
                userToken: "test-token",
                setUserData: jest.fn(),
                setHref: jest.fn(),
                setUserToken: jest.fn(),
                setEnrollerFullName: jest.fn(),
                setSponsorFullName: jest.fn(),
                setEnrollerId: jest.fn(),
                setSponsorId: jest.fn(),
                setMainAddress: jest.fn()
            })
        ).rejects.toThrow("market_not_supported");
    });
});
