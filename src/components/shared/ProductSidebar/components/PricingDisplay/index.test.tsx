/* eslint-disable jsx-a11y/alt-text */
import "@testing-library/jest-dom/extend-expect";
import { render, RenderResult, screen } from "@testing-library/react";
import Spinner from "Components/shared/Spinner";
import { useCountryConfig } from "Constants/countryConfig";
import { Currency } from "Constants/countryConfig/enums";
import { useOrder } from "Contexts/OrderContext";
import { useProducts } from "Contexts/ProductContext";
import { useTranslations } from "Contexts/translation";
import ReactDOMServer from "react-dom/server";
import { useTranslate } from "react-polyglot";
import "test-utils/router-mock";
import PricingDisplay, { PricingDisplayProps } from "./index";

jest.mock("Contexts/translation");
jest.mock("Contexts/ProductContext");
jest.mock("Contexts/OrderContext");
jest.mock("Constants/countryConfig");
jest.mock("react-polyglot");

describe("PricingDisplay", () => {
    const selectedShippingMethodMockGoodResults = {
        market: "US",
        type: "Economy",
        location: "California",
        productPrice: "100.00",
        shipping: "5.00",
        subtotal: "105.00",
        tax: "8.25",
        orderTotal: "113.25"
    };

    beforeEach(() => {
        jest.clearAllMocks();

        (useTranslations as jest.Mock).mockReturnValue({
            translations: {
                subtotal: "Subtotal",
                shipping: "Shipping",
                tax: "Tax",
                free: "Free"
            },
            country: "US",
            language: "en"
        });
        (useProducts as jest.Mock).mockReturnValue({
            shoppingCart: [
                {
                    price: "100"
                }
            ]
        });
        (useOrder as jest.Mock).mockReturnValue({
            selectedShippingMethod: selectedShippingMethodMockGoodResults
        });
        (useCountryConfig as jest.Mock).mockReturnValue({
            marketExceptions: {
                taxInclusiveBackEnd: false
            },
            currency: Currency.USD
        });
        (useTranslate as jest.Mock).mockReturnValue((key: string) => {
            if (key === "country") return "GB";
            return key;
        });
    });

    const setup = (ComponentProps: PricingDisplayProps): RenderResult =>
        render(<PricingDisplay {...ComponentProps} />);

    test("renders the price details", () => {
        const test = setup({ showPricingBreakdown: true });

        expect(test.getByTestId("right_column_subtotal")).toHaveTextContent(
            "right_column_subtotal"
        );
        expect(
            test.getByTestId("right_column_payment_shipping")
        ).toHaveTextContent("right_column_payment_shipping");
        expect(test.getByTestId("right_column_payment_tax")).toHaveTextContent(
            "right_column_payment_tax"
        );
        expect(test.getByTestId("subtotal_price_label")).toHaveTextContent(
            "$100.00"
        );
        expect(test.getByTestId("shipping_price_label")).toHaveTextContent(
            "$5.00"
        );
        expect(test.getByTestId("tax_price_label")).toHaveTextContent("$8.25");
    });

    test("renders the price detail, With Free shipping", () => {
        (useOrder as jest.Mock).mockReturnValue({
            ...useOrder(),
            selectedShippingMethod: {
                ...selectedShippingMethodMockGoodResults,
                shipping: "0"
            }
        });

        const test = setup({ showPricingBreakdown: true });

        expect(test.getByTestId("shipping_price_label")).toHaveTextContent(
            "right_column_payment_shipping_price"
        );
    });

    test("renders the Spinners", () => {
        const spinnerMarkup = ReactDOMServer.renderToString(<Spinner dark />);
        (useOrder as jest.Mock).mockReturnValue({
            ...useOrder(),
            selectedShippingMethod: {
                ...selectedShippingMethodMockGoodResults,
                shipping: "Loading...",
                subtotal: "Loading...",
                tax: "Loading..."
            }
        });
        const test = setup({ showPricingBreakdown: true });

        // expect(test.getByTestId("subtotal_price_label")).toContainHTML(
        //     spinnerMarkup
        // );
        expect(test.getByTestId("shipping_price_label")).toContainHTML(
            spinnerMarkup
        );
        expect(test.getByTestId("tax_price_label")).toContainHTML(
            spinnerMarkup
        );
    });

    test("Dont show anything", () => {
        const test = setup({ showPricingBreakdown: false });

        expect(test.queryByTestId("subtotal_label")).toBeNull();
        expect(test.queryByTestId("shipping_label")).toBeNull();
        expect(test.queryByTestId("tax_label")).toBeNull();
    });

    test("renders the price in GB", () => {
        (useOrder as jest.Mock).mockReturnValue({
            ...useOrder(),
            selectedShippingMethod: {
                ...selectedShippingMethodMockGoodResults,
                market: "GB"
            }
        });
        (useTranslations as jest.Mock).mockReturnValue({
            translations: {
                subtotal: "Subtotal",
                shipping: "Shipping",
                tax: "Tax",
                free: "Free"
            },
            country: "GB",
            language: "en"
        });
        (useCountryConfig as jest.Mock).mockReturnValue({
            marketExceptions: {
                taxInclusiveBackEnd: false
            },
            currency: Currency.GBP
        });
        (useTranslate as jest.Mock).mockReturnValue((key: string) => {
            if (key === "country") return "GB";
            return key;
        });

        const test = setup({ showPricingBreakdown: true });
        expect(test.getByTestId("subtotal_price_label")).toHaveTextContent(
            "£100.00"
        );
    });

    test("Show tax if taxInclusiveBackEnd is false", () => {
        const testWithTax = setup({ showPricingBreakdown: true });
        expect(
            testWithTax.queryByTestId("right_column_payment_tax")
        ).toBeInTheDocument();
    });

    test("Dont show tax if taxInclusiveBackEnd is true", () => {
        (useCountryConfig as jest.Mock).mockReturnValueOnce({
            marketExceptions: {
                taxInclusiveBackEnd: true
            }
        });

        const testNoTax = setup({ showPricingBreakdown: true });

        expect(
            testNoTax.queryByTestId("right_column_payment_tax")
        ).not.toBeInTheDocument();
    });

    it("renders the price in GB", () => {
        (useOrder as jest.Mock).mockReturnValue({
            selectedShippingMethod: {
                ...selectedShippingMethodMockGoodResults,
                market: "GB"
            }
        });
        (useTranslations as jest.Mock).mockReturnValue({
            translations: {
                subtotal: "Subtotal",
                shipping: "Shipping",
                tax: "Tax",
                free: "Free"
            },
            country: "GB",
            language: "en"
        });
        (useCountryConfig as jest.Mock).mockReturnValue({
            marketExceptions: {
                taxInclusiveBackEnd: false
            },
            currency: Currency.GBP
        });
        (useTranslate as jest.Mock).mockReturnValue((key: string) => {
            if (key === "country") return "GB";
            return key;
        });

        render(<PricingDisplay showPricingBreakdown />);
        expect(screen.getByTestId("subtotal_price_label")).toHaveTextContent(
            "£100.00"
        );
    });
});
