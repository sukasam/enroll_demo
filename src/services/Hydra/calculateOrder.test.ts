import httpTools from "Shared/httpTools.js";
import { Address } from "Types/Address";
import { CustomerType } from "Types/enums";
import getPlatform from "Utils/getPlatform";
import calculateOrder from "./calculateOrder";

jest.mock("Shared/httpTools.js");
jest.mock("Utils/getPlatform");
jest.mock("Root/package.json", () => ({ version: "1.0.0" }));

describe("calculateOrder", () => {
    const mockEnvUrl = "https://test-env.com";
    const mockPlatform = "web";
    const mockProps = {
        items: ["SKU1", "SKU2"],
        shippingMethod: { type: "standard", location: "warehouse1" },
        shipToAddress: { country: "US" } as Address,
        customerType: CustomerType.MEMBER
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (httpTools.envUrl as jest.Mock).mockReturnValue(mockEnvUrl);
        (getPlatform as jest.Mock).mockReturnValue(mockPlatform);
    });

    it("should call sendRequest with correct parameters", async () => {
        const mockResponse = {
            items: [
                {
                    terms: {
                        tax: { amount: 0 },
                        freight: { amount: 0 },
                        total: 0,
                        discount: { amount: 0 },
                        subtotal: 0
                    },
                    added_lines: { items: 0 },
                    lines: { items: 0 }
                }
            ]
        };
        (httpTools.sendRequest as jest.Mock).mockResolvedValue(mockResponse);

        await calculateOrder(mockProps);

        expect(httpTools.sendRequest).toHaveBeenCalledWith({
            method: "POST",
            url: "/quotes",
            data: {
                order: {
                    customer: {
                        href: `${mockEnvUrl}/customers?type=${CustomerType.MEMBER}`
                    },
                    lines: {
                        items: [
                            {
                                item: {
                                    href: `${mockEnvUrl}/items?id.unicity=SKU1`
                                },
                                quantity: 1
                            },
                            {
                                item: {
                                    href: `${mockEnvUrl}/items?id.unicity=SKU2`
                                },
                                quantity: 1
                            }
                        ]
                    },
                    shipToAddress: mockProps.shipToAddress,
                    shippingMethod: {
                        href: `${mockEnvUrl}/shippingmethods?type=standard&location=warehouse1`
                    },
                    type: "Order",
                    source: {
                        medium: "Internet",
                        agent: "Enroll-OrderCalc",
                        version: "1.0.0",
                        platform: mockPlatform,
                        market: "US"
                    }
                }
            },
            withAuth: false
        });
    });

    it("should return calculated order details on success", async () => {
        const mockResponse = {
            items: [
                {
                    terms: {
                        tax: { amount: 10 },
                        freight: { amount: 5 },
                        total: 100,
                        discount: { amount: 2 },
                        subtotal: 87
                    },
                    added_lines: { items: 1 },
                    lines: { items: 2 }
                }
            ]
        };
        (httpTools.sendRequest as jest.Mock).mockResolvedValue(mockResponse);

        const result = await calculateOrder(mockProps);

        expect(result).toEqual({
            tax: 10,
            shipping: 5,
            total: 100,
            discount: 2,
            addedSkus: 1,
            lines: 2,
            subtotal: 87,
            error: undefined
        });
    });

    it("should throw an error if shipping method is not provided", async () => {
        const invalidProps = { ...mockProps, shippingMethod: undefined };
        await expect(calculateOrder(invalidProps as any)).rejects.toThrow(
            "Shipping method is required"
        );
    });

    it("should throw an error if calculation fails", async () => {
        (httpTools.sendRequest as jest.Mock).mockResolvedValue({});
        await expect(calculateOrder(mockProps)).rejects.toThrow(
            "Could not calculate order"
        );
    });

    it("should handle shipping method without location", async () => {
        const propsWithoutLocation = {
            ...mockProps,
            shippingMethod: { type: "standard" }
        };
        const mockResponse = {
            items: [
                {
                    terms: {
                        tax: { amount: 10 },
                        freight: { amount: 5 },
                        total: 100,
                        discount: { amount: 2 },
                        subtotal: 87
                    },
                    added_lines: { items: 1 },
                    lines: { items: 2 }
                }
            ]
        };
        (httpTools.sendRequest as jest.Mock).mockResolvedValue(mockResponse);

        await calculateOrder(propsWithoutLocation);

        expect(httpTools.sendRequest).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    order: expect.objectContaining({
                        shippingMethod: {
                            href: `${mockEnvUrl}/shippingmethods?type=standard`
                        }
                    })
                })
            })
        );
    });

    it("should handle missing added_lines and lines in the response", async () => {
        const mockResponse = {
            items: [
                {
                    terms: {
                        tax: { amount: 10 },
                        freight: { amount: 5 },
                        total: 100,
                        discount: { amount: 2 },
                        subtotal: 87
                    }
                }
            ]
        };
        (httpTools.sendRequest as jest.Mock).mockResolvedValue(mockResponse);

        const result = await calculateOrder(mockProps);

        expect(result).toEqual({
            tax: 10,
            shipping: 5,
            total: 100,
            discount: 2,
            addedSkus: 0,
            lines: 0,
            subtotal: 87,
            error: undefined
        });
    });

    it("should handle missing terms in the response", async () => {
        const mockResponse = {
            items: [{}]
        };
        (httpTools.sendRequest as jest.Mock).mockResolvedValue(mockResponse);

        await expect(calculateOrder(mockProps)).rejects.toThrow(
            "Could not calculate order"
        );
    });

    it("should handle missing amounts in terms", async () => {
        const mockResponse = {
            items: [
                {
                    terms: {
                        tax: {},
                        freight: {},
                        total: 100,
                        discount: {},
                        subtotal: 87
                    },
                    added_lines: { items: 1 },
                    lines: { items: 2 }
                }
            ]
        };
        (httpTools.sendRequest as jest.Mock).mockResolvedValue(mockResponse);

        const result = await calculateOrder(mockProps);

        expect(result).toEqual({
            tax: 0,
            shipping: 0,
            total: 100,
            discount: 0,
            addedSkus: 1,
            lines: 2,
            subtotal: 87,
            error: undefined
        });
    });

    it("should handle empty response from sendRequest", async () => {
        (httpTools.sendRequest as jest.Mock).mockResolvedValue(null);

        await expect(calculateOrder(mockProps)).rejects.toThrow(
            "Could not calculate order"
        );
    });
});
