import httpTools from "Shared/httpTools.js";
import getPlatform from "Utils/getPlatform";
import createCustomer, { CustomerDataType } from "./createCustomer";

jest.mock("Shared/httpTools.js");
jest.mock("Utils/getPlatform");
jest.mock("Root/package.json", () => ({ version: "1.0.0" }));

describe("createCustomer", () => {
    const mockEnvUrl = "https://test-env.com";
    const mockPlatform = "web";
    const mockCustomerData: CustomerDataType = {
        mainAddress: { country: "US" },
        humanName: { firstName: "John", lastName: "Doe" },
        password: { value: "password123" },
        signature: { value: null },
        email: "john@example.com",
        mobilePhone: "1234567890",
        type: "Customer",
        businessEntity: { legalType: "Individual" },
        recaptchaToken: "recaptcha-token",
        recaptchaType: "v2"
    };
    const mockEnrollerId = "12345";
    const mockSponsorId = "67890";

    beforeEach(() => {
        jest.clearAllMocks();
        (httpTools.envUrl as jest.Mock).mockReturnValue(mockEnvUrl);
        (getPlatform as jest.Mock).mockReturnValue(mockPlatform);
    });

    it("should call sendRequest with correct parameters", async () => {
        await createCustomer(mockCustomerData, mockEnrollerId, mockSponsorId);

        expect(httpTools.sendRequest).toHaveBeenCalledWith({
            method: "POST",
            url: "/customers",
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
                "x-enable-recaptcha": "true"
            },
            withAuth: false,
            data: {
                ...mockCustomerData,
                enroller: {
                    href: `${mockEnvUrl}/customers?id.unicity=${mockEnrollerId}`,
                    href_params: [`id.unicity=${mockEnrollerId}`]
                },
                sponsor: {
                    href: `${mockEnvUrl}/customers?id.unicity=${mockSponsorId}`,
                    href_params: [`id.unicity=${mockSponsorId}`]
                },
                source: {
                    medium: "Internet",
                    agent: "Enroll2",
                    version: "1.0.0",
                    platform: mockPlatform,
                    market: "US"
                }
            },
            throwError: true,
            isErrorMessageOverride: true,
            logOptions: {
                requestName: "Create Account",
                error: true,
                functionName: "createCustomer"
            }
        });
    });

    it("should not include sponsor if sponsorId is not provided", async () => {
        await createCustomer(mockCustomerData, mockEnrollerId);

        expect(httpTools.sendRequest).toHaveBeenCalledWith(
            expect.not.objectContaining({
                data: expect.objectContaining({
                    sponsor: expect.anything()
                })
            })
        );
    });

    it("should return the result from sendRequest", async () => {
        const mockResponse = { id: "new-customer-id" };
        (httpTools.sendRequest as jest.Mock).mockResolvedValue(mockResponse);

        const result = await createCustomer(mockCustomerData, mockEnrollerId);

        expect(result).toEqual(mockResponse);
    });
});
