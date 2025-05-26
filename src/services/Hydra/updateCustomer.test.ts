import httpTools from "Shared/httpTools.js";
import updateCustomer from "./updateCustomer";

jest.mock("Shared/httpTools.js", () => ({
    sendRequest: jest.fn()
}));

describe("updateCustomer", () => {
    const mockCustomerData = {
        name: "John Doe",
        email: "john@example.com"
    };
    const mockCustomerHref = "customer123";
    const mockUserToken = "token123";

    it("calls sendRequest with correct parameters", async () => {
        await updateCustomer(mockCustomerData, mockCustomerHref, mockUserToken);

        expect(httpTools.sendRequest).toHaveBeenCalledWith({
            method: "POST",
            url: "/customers/customer123",
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*"
            },
            withAuth: true,
            token: mockUserToken,
            data: mockCustomerData,
            throwError: true
        });
    });

    it("returns the result of sendRequest", async () => {
        const mockResponse = { status: "success" };
        (httpTools.sendRequest as jest.Mock).mockResolvedValue(mockResponse);

        const result = await updateCustomer(
            mockCustomerData,
            mockCustomerHref,
            mockUserToken
        );

        expect(result).toBe(mockResponse);
    });
});
