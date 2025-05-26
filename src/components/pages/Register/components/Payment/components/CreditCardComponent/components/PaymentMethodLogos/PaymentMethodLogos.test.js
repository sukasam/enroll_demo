import { render, screen, waitFor } from "@testing-library/react";
import { useCountryConfig } from "Constants/countryConfig";
import PaymentMethodLogos from "./index.js";

jest.mock("Constants/countryConfig", () => ({
    useCountryConfig: jest.fn()
}));

jest.mock("next/image", () => ({
    __esModule: true,
    default: ({ alt, ariaLabel, role, ...props }) => (
        <img alt={alt} aria-label={ariaLabel} role={role} {...props} />
    )
}));

describe("PaymentMethodLogos", () => {
    it("renders no logos when there are no payment logos", () => {
        useCountryConfig.mockImplementationOnce(() => ({
            paymentLogos: null
        }));

        render(<PaymentMethodLogos />);
        const logos = screen.queryAllByTestId(/payment_method_.*_logo/);
        expect(logos).toHaveLength(0);
    });

    it("renders the logos when there are payment logos", async () => {
        useCountryConfig.mockImplementationOnce(() => ({
            paymentLogos: ["visa", "mastercard", "paypal"]
        }));

        render(<PaymentMethodLogos />);
        await waitFor(() => {
            const logos = screen.getAllByTestId(/payment_method_.*_logo/);
            expect(logos).toHaveLength(3);
        });

        expect(
            screen.getByTestId("payment_method_visa_logo")
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("payment_method_mastercard_logo")
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("payment_method_paypal_logo")
        ).toBeInTheDocument();
    });
});
