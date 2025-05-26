import { render, RenderResult, screen } from "@testing-library/react";
import { useCountryConfig } from "Constants/countryConfig";
import { Variant } from "Constants/countryConfig/types";
import OrderSummary from "./index";

// Mock the required hooks and components
jest.mock("Constants/countryConfig");
jest.mock("Components/shared/Translate", () => ({
    __esModule: true,
    default: ({ children }: { children: string }): string => children,
    useTranslate:
        () =>
        (text: string): string =>
            text
}));
jest.mock("Components/shared/CurrencyFormatter", () => ({
    __esModule: true,
    default: ({ children }: { children: number }): string => `$${children}`
}));
jest.mock("Contexts/ProductContext", () => ({
    useProducts: (): { shoppingCart: Array<{ price: number }> } => ({
        shoppingCart: [{ price: 100 }]
    })
}));

const mockProduct = {
    terms: {
        subtotal: 100,
        total: 120,
        tax: {
            amount: 20
        }
    }
};

const mockSelectedProduct = {
    productImage: "/test-image.jpg",
    name: "Test Product",
    description: "Test Description",
    options: {},
    sku: "31994",
    partsCount: "1",
    tabImage: "/test-tab-image.jpg",
    price: 100,
    rrp: 120
} as Variant;

const defaultProps = {
    summaryExpanded: true,
    setSummaryExpanded: jest.fn(),
    product: mockProduct,
    selectedProduct: mockSelectedProduct
};

describe("OrderSummary", () => {
    const setup = (props = {}): RenderResult =>
        render(<OrderSummary {...defaultProps} {...props} />);

    test("Shows tax section when taxInclusiveBackEnd is false", (): void => {
        (useCountryConfig as jest.Mock).mockReturnValue({
            marketExceptions: {
                taxInclusiveBackEnd: false
            }
        });

        setup();

        expect(screen.getByTestId("tax_label")).toBeInTheDocument();
        expect(screen.getByTestId("tax_value")).toBeInTheDocument();
    });

    test("Hides tax section when taxInclusiveBackEnd is true", (): void => {
        (useCountryConfig as jest.Mock).mockReturnValue({
            marketExceptions: {
                taxInclusiveBackEnd: true
            }
        });

        setup();

        expect(screen.queryByTestId("tax_label")).not.toBeInTheDocument();
        expect(screen.queryByTestId("tax_value")).not.toBeInTheDocument();
    });
});
