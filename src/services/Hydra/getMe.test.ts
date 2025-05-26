import { AddressType } from "Contexts/types/OrderContextTypes";
import httpTools from "Shared/httpTools.js";
import getMe, { UserResponseType } from "./getMe";

jest.mock("Shared/httpTools.js");

describe("getMe", () => {
    const mockHydraToken = "mock-hydra-token";
    const mockUserResponse: UserResponseType = {
        humanName: { firstName: "John", lastName: "Doe", fullName: "John Doe" },
        mainAddress: {} as AddressType,
        unicity: 12345,
        market: "US",
        href: "http://example.com",
        id: { unicity: "12345" },
        preferredLocale: "en-US",
        mobilePhone: "1234567890",
        email: "john@example.com",
        type: "Customer",
        enroller: { id: "67890", humanName: { fullName: "Jane Doe" } },
        joinDate: "2023-01-01",
        sponsor: { id: "54321", humanName: { fullName: "Bob Smith" } }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call sendRequest with correct parameters", async () => {
        await getMe(mockHydraToken);

        expect(httpTools.sendRequest).toHaveBeenCalledWith({
            method: "GET",
            url: "/customers/me",
            token: mockHydraToken
        });
    });

    it("should return the user response from sendRequest", async () => {
        (httpTools.sendRequest as jest.Mock).mockResolvedValue(
            mockUserResponse
        );

        const result = await getMe(mockHydraToken);

        expect(result).toEqual(mockUserResponse);
    });

    it("should throw an error if sendRequest fails", async () => {
        const mockError = new Error("API error");
        (httpTools.sendRequest as jest.Mock).mockRejectedValue(mockError);

        await expect(getMe(mockHydraToken)).rejects.toThrow("API error");
    });
});
