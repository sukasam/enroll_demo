import { render } from "@testing-library/react";
import { useOrder } from "Contexts/OrderContext";
import Payment from "./Payment";

// Mock the necessary hooks and components
jest.mock("Contexts/OrderContext", () => ({
    useOrder: jest.fn()
}));

jest.mock("Constants/paymentOptions", () => [
    {
        transactionMethod: "CreditCard",
        imageSrc: "/images/credit-card.png",
        optionLabel: "Credit Card",
        testIdPrefix: "credit_card"
    },
    {
        transactionMethod: "PayPal",
        imageSrc: "/images/paypal.png",
        optionLabel: "PayPal",
        testIdPrefix: "paypal"
    }
]);

jest.mock(
    "Components/shared/Translate",
    () =>
        function Translate({
            children
        }: {
            children: React.ReactNode;
        }): JSX.Element {
            return <span>{children}</span>;
        }
);

jest.mock(
    "next/image",
    () =>
        function Image(props: any): JSX.Element {
            return <img {...props} alt="" />;
        }
);

describe("Payment", () => {
    beforeEach(() => {
        (useOrder as jest.Mock).mockReturnValue({
            selectedPaymentMethod: null
        });
    });

    it("renders correctly when no payment method is selected", () => {
        const { asFragment } = render(<Payment />);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders correctly when CreditCard payment method is selected", () => {
        (useOrder as jest.Mock).mockReturnValue({
            selectedPaymentMethod: "CreditCard"
        });

        const { asFragment } = render(<Payment />);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders correctly when PayPal payment method is selected", () => {
        (useOrder as jest.Mock).mockReturnValue({
            selectedPaymentMethod: "PayPal"
        });

        const { asFragment } = render(<Payment />);
        expect(asFragment()).toMatchSnapshot();
    });
});
