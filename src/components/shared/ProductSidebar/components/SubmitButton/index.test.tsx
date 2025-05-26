import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useCountryConfig } from "Constants/countryConfig";
import { useOrder } from "Contexts/OrderContext";
import { useProducts } from "Contexts/ProductContext";
import { useUser } from "Contexts/UserContext";
import { buildOrderRequest, postOrder } from "Hydra/order";
import { useFlags } from "launchdarkly-react-client-sdk";
import initDDC from "Services/worldPay/worldPay";
import SubmitButton from "./index";

jest.mock("Components/shared/ProcessingPopup", () => ({
    __esModule: true,
    default: jest.fn(() => null)
}));
jest.mock("launchdarkly-react-client-sdk", () => ({
    __esModule: true,
    useFlags: jest.fn(() => ({
        useWorldPayEu: false
    }))
}));

jest.mock("Constants/countryConfig", () => ({
    __esModule: true,
    useCountryConfig: jest.fn()
}));
jest.mock("Services/worldPay/worldPay", () => ({
    __esModule: true,
    default: jest.fn()
}));
jest.mock("Contexts/OrderContext", () => ({
    useOrder: jest.fn()
}));
jest.mock("Contexts/ProductContext", () => ({
    useProducts: jest.fn()
}));
jest.mock("Services/mixpanel/initializeMixPanel", () => ({
    __esModule: true,
    default: {
        trackEvent: jest.fn()
    }
}));
jest.mock("next/router", () => ({
    __esModule: true,
    useRouter: jest.fn()
}));
jest.mock("Contexts/UserContext", () => ({
    useUser: jest.fn()
}));
jest.mock("Hydra/order", () => ({
    buildOrderRequest: jest.fn(() => ({
        locale: "en",
        order: { testOrder: true },
        token: "valid-token",
        href: "/sample-path"
    })),
    postOrder: jest.fn(() =>
        Promise.resolve({
            id: { unicity: "mocked-order-id" }
        })
    )
}));

const mockSetOrderResult = jest.fn();
const mockPostOrder = jest
    .fn()
    .mockResolvedValue({ id: { unicity: "test-id" } });

beforeAll(() => {
    console.vlog = jest.fn();
});

beforeEach(() => {
    jest.clearAllMocks();
    (postOrder as jest.Mock).mockImplementation(mockPostOrder);

    // Setup all required mocks
    (useUser as jest.Mock).mockReturnValue({
        userToken: "test-token",
        href: "/test"
    });

    (useOrder as jest.Mock).mockReturnValue({
        selectedShippingMethod: { orderTotal: 100 },
        selectedPaymentMethod: "CreditCard",
        isCreditCardPaymentValid: true,
        setOrderResult: mockSetOrderResult,
        orderData: {
            paymentMethod: "credit_card",
            cardToken: "test-token"
        }
    });

    (useProducts as jest.Mock).mockReturnValue({
        shoppingCart: [{ sku: "test-sku", quantity: 1 }],
        ufgVariants: []
    });

    (buildOrderRequest as jest.Mock).mockReturnValue({
        order: { testOrder: true },
        token: "test-token"
    });
});

describe("SubmitButton Component", () => {
    it("should disable the button if required conditions are not met", () => {
        (useOrder as jest.Mock).mockReturnValue({
            selectedShippingMethod: null,
            selectedPaymentMethod: null,
            isCreditCardPaymentValid: false
        });

        render(<SubmitButton showPricingBreakdown />);

        const button = screen.getByTestId("button_complete_enrollment");
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
    });

    it("should handle successful order submission", async () => {
        await act(async () => {
            render(<SubmitButton showPricingBreakdown />);
        });

        const button = screen.getByTestId("button_complete_enrollment");

        await act(async () => {
            await userEvent.click(button);
        });

        await waitFor(() => {
            expect(mockPostOrder).toHaveBeenCalled();
        });

        expect(mockSetOrderResult).toHaveBeenCalledWith(
            expect.objectContaining({
                id: { unicity: "test-id" }
            })
        );
    });
    it("should handle WorldPay integration when enabled", async () => {
        const mockSessionId = "wp-session-123";

        (useFlags as jest.Mock).mockReturnValue({
            useWorldPayEu: true
        });

        (useCountryConfig as jest.Mock).mockReturnValue({
            marketExceptions: {
                useWorldPay: true
            },
            isNoPurchaseMarket: false,
            market: "EU",
            currency: "EUR",
            countryCode: "FR",
            locale: "fr-FR"
        });

        (useOrder as jest.Mock).mockReturnValue({
            selectedShippingMethod: { orderTotal: 100 },
            selectedPaymentMethod: "CreditCard",
            isCreditCardPaymentValid: true,
            setOrderResult: jest.fn(),
            paymentMethod: {
                type: "CreditCard",
                creditCardNumber: "4111111111111111"
            },
            orderData: {
                payment: {
                    method: "credit_card"
                }
            }
        });

        (initDDC as jest.Mock).mockResolvedValue({
            sessionId: mockSessionId,
            ddcHTML: "<html>DDC Content</html>"
        });

        (buildOrderRequest as jest.Mock).mockImplementation(
            ({ worldPaySessionId }) => ({
                order: {
                    testOrder: true,
                    transactions: {
                        items: [
                            {
                                methodDetails: {
                                    sessionId: worldPaySessionId,
                                    bankName: "WorldPay"
                                }
                            }
                        ]
                    }
                },
                token: "test-token"
            })
        );

        render(<SubmitButton showPricingBreakdown />);

        const button = screen.getByTestId("button_complete_enrollment");

        await act(async () => {
            await userEvent.click(button);
        });

        await waitFor(() => {
            expect(initDDC).toHaveBeenCalledWith(
                "4111111111111111",
                expect.any(String)
            );
        });

        const ddcIframe = screen.getByTitle("ddc");
        expect(ddcIframe).toBeInTheDocument();
        expect(ddcIframe).toHaveAttribute("srcdoc", "<html>DDC Content</html>");

        await waitFor(() => {
            expect(postOrder).toHaveBeenCalledWith(
                expect.objectContaining({
                    order: expect.objectContaining({
                        transactions: {
                            items: expect.arrayContaining([
                                expect.objectContaining({
                                    methodDetails: expect.objectContaining({
                                        sessionId: mockSessionId,
                                        bankName: "WorldPay"
                                    })
                                })
                            ])
                        }
                    })
                })
            );
        });
    });
});
