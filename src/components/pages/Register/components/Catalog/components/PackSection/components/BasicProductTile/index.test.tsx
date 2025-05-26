import { fireEvent, render, screen } from "@testing-library/react";
import BasicProductTile from "./index";

// Mock the imported components
jest.mock("Components/shared/CurrencyFormatter", () => {
    function CurrencyFormatter({
        children
    }: {
        children: number;
    }): JSX.Element {
        return <span>{children}</span>;
    }
    return CurrencyFormatter;
});

jest.mock("Components/shared/Translate", () => {
    function Translate({ children }: { children: string }): JSX.Element {
        return <span>{children}</span>;
    }
    return Translate;
});

const mockProps = {
    backgroundColor: "#f0f0f0",
    title: "Test Product",
    price: 99.99,
    description: "Test description",
    buttonText: "Buy Now",
    buttonClick: jest.fn(),
    showPaymentType: true
};

describe("BasicProductTile", () => {
    it("renders correctly with all props", () => {
        render(<BasicProductTile {...mockProps} />);

        expect(
            screen.getByTestId("product_title_basic_label")
        ).toHaveTextContent("Test Product");
        expect(
            screen.getByTestId("product_price_basic_label")
        ).toHaveTextContent("99.99");
        expect(
            screen.getByTestId("product_description_basic_label")
        ).toHaveTextContent("Test description");
        expect(
            screen.getByTestId("payment_type_basic_label")
        ).toBeInTheDocument();
        expect(screen.getByTestId("get_basic_button")).toHaveTextContent(
            "Buy Now"
        );
    });

    it("does not show payment type when showPaymentType is false", () => {
        render(<BasicProductTile {...mockProps} showPaymentType={false} />);
        expect(
            screen.queryByTestId("payment_type_basic_label")
        ).not.toBeInTheDocument();
    });

    it("calls buttonClick when button is clicked", () => {
        const mockButtonClick = jest.fn();
        render(
            <BasicProductTile {...mockProps} buttonClick={mockButtonClick} />
        );
        fireEvent.click(screen.getByTestId("get_basic_button"));
        expect(mockButtonClick).toHaveBeenCalledTimes(1);
    });

    it("calls buttonClick when Enter key is pressed on button", () => {
        const mockButtonClick = jest.fn();
        render(
            <BasicProductTile {...mockProps} buttonClick={mockButtonClick} />
        );
        const button = screen.getByTestId("get_basic_button");
        fireEvent.keyUp(button, { key: "Enter" });
        expect(mockButtonClick).toHaveBeenCalledTimes(1);
    });

    it("does not call buttonClick when a non-Enter key is pressed on button", () => {
        const mockButtonClick = jest.fn();
        render(
            <BasicProductTile {...mockProps} buttonClick={mockButtonClick} />
        );
        const button = screen.getByTestId("get_basic_button");
        fireEvent.keyUp(button, { key: "Space" });
        expect(mockButtonClick).not.toHaveBeenCalled();
    });

    it("prevents default behavior when Enter key is pressed", () => {
        const mockButtonClick = jest.fn();
        render(
            <BasicProductTile {...mockProps} buttonClick={mockButtonClick} />
        );
        const button = screen.getByTestId("get_basic_button");

        const keyUpEvent = new KeyboardEvent("keyup", {
            key: "Enter",
            bubbles: true,
            cancelable: true
        });

        const preventDefaultMock = jest.fn();
        Object.defineProperty(keyUpEvent, "preventDefault", {
            value: preventDefaultMock
        });

        button.dispatchEvent(keyUpEvent);

        expect(preventDefaultMock).toHaveBeenCalledTimes(1);
        expect(mockButtonClick).toHaveBeenCalledTimes(1);
    });
});
