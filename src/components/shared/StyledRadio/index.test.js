import { fireEvent, render, screen } from "@testing-library/react";
import StyledRadio from "./index";

// Mock the dependencies
jest.mock("@mui/material", () => ({
    Radio: ({ onChange, checkedIcon, icon, checked, ...props }) => (
        <div
            data-testid="mock-radio"
            onClick={onChange}
            onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                    onChange(e);
                }
            }}
            role="radio"
            tabIndex={0}
            aria-checked={checked}
        >
            <span data-testid="mock-radio-props">{JSON.stringify(props)}</span>
            <span data-testid="mock-radio-checked-icon">{checkedIcon}</span>
            <span data-testid="mock-radio-icon">{icon}</span>
        </div>
    )
}));

jest.mock(
    "Components/shared/LocalImage",
    () =>
        ({ src, alt = "", ...props }) => (
            <img
                data-testid={`mock-image-${src}`}
                src={src}
                alt={alt}
                {...props}
            />
        )
);

jest.mock("./styles", () => "mock-styles");

describe("StyledRadio", () => {
    it("renders checked and unchecked icons", () => {
        render(<StyledRadio />);

        expect(
            screen.getByTestId("mock-image-/checked-radio.svg")
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("mock-image-/unchecked-radio.svg")
        ).toBeInTheDocument();
    });

    it("calls onChange when provided", () => {
        const mockOnChange = jest.fn();
        render(<StyledRadio onChange={mockOnChange} />);

        fireEvent.click(screen.getByTestId("mock-radio"));
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it("calls onChange when Enter key is pressed", () => {
        const mockOnChange = jest.fn();
        render(<StyledRadio onChange={mockOnChange} />);

        fireEvent.keyDown(screen.getByTestId("mock-radio"), { key: "Enter" });
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it("does not throw when onChange is not provided", () => {
        render(<StyledRadio />);

        expect(() => {
            fireEvent.click(screen.getByTestId("mock-radio"));
        }).not.toThrow();
    });
});
