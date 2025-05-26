import httpTools from "Shared/httpTools";
import { buildOrderRequest, postOrder } from "./index";
import { TransactionMethod } from "./types";

jest.mock("Shared/httpTools", () => ({
    getHydraAPIUrl: jest.fn(() => "https://api.example.com"),
    envFlags: jest.fn(() => "test"),
    sendRequest: jest.fn()
}));

jest.mock("Root/package.json", () => ({ version: "1.0.0" }), { virtual: true });
jest.mock("Utils/getPlatform", () => jest.fn(() => "web"));

describe("Order Service", () => {
    describe("buildOrderRequest", () => {
        it("should build a valid order request", () => {
            const props = {
                cartItems: [{ sku: "SKU123", qty: 1 }],
                payment: {
                    method: TransactionMethod.CreditCard,
                    creditCardNumber: "1234 5678 9012 3456",
                    firstName: "John",
                    lastName: "Doe",
                    expiry: "12/25",
                    cvc: "123",
                    city: "Test City",
                    country: "US",
                    state: "CA",
                    address1: "123 Test St",
                    zip: "12345"
                },
                shipToAddress: {
                    firstName: "John",
                    lastName: "Doe",
                    address1: "123 Test St",
                    city: "Test City",
                    country: "US",
                    state: "CA",
                    zip: "12345"
                },
                shipMethod: { type: "standard" },
                shipToName: "John Doe",
                shipToEmail: "john@example.com",
                shipToPhone: "1234567890",
                customer: {
                    firstName: "John",
                    lastName: "Doe",
                    email: "john@example.com",
                    phone: "1234567890"
                },
                sourceMarket: "US",
                locale: "en-US"
            };
            const token = "test-token";
            const href = "customer-href";

            const result = buildOrderRequest(props, token, href);

            expect(result).toHaveProperty("locale", "en-US");
            expect(result).toHaveProperty("order");
            expect(result.order).toHaveProperty("lines");
            expect(result.order).toHaveProperty("transactions");
            expect(result).toHaveProperty("token", "test-token");
            expect(result).toHaveProperty("href", "customer-href");
        });
    });

    describe("postOrder", () => {
        it("should call httpTools.sendRequest with correct parameters", async () => {
            const orderData = {
                locale: "en-US",
                order: {
                    /* order details */
                },
                token: "test-token",
                href: "customer-href"
            };

            await postOrder(orderData);

            expect(httpTools.sendRequest).toHaveBeenCalledWith(
                expect.objectContaining({
                    method: "POST",
                    headers: { "Accept-Language": "en-US" },
                    url: "/customers/customer-href/orders",
                    token: "test-token",
                    withAuth: true,
                    throwError: true,
                    isErrorMessageOverride: true
                })
            );
        });
    });
});
