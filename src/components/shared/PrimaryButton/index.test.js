import { fireEvent, render } from "@testing-library/react";
import PrimaryButton from "./index";

// Mock the styles import
jest.mock("./styles", () => () => ({}));

describe("PrimaryButton", () => {
    it("renders children correctly", () => {
        const { getByText } = render(
            <PrimaryButton>Test Button</PrimaryButton>
        );
        expect(getByText("Test Button")).toBeInTheDocument();
    });

    it("applies dark class when dark prop is true", () => {
        const { container } = render(
            <PrimaryButton dark>Dark Button</PrimaryButton>
        );
        expect(container.firstChild).toHaveClass("dark");
    });

    it("applies custom className when provided", () => {
        const { container } = render(
            <PrimaryButton className="custom-class">
                Custom Class Button
            </PrimaryButton>
        );
        expect(container.firstChild).toHaveClass("custom-class");
    });

    it("calls onClick handler when clicked", () => {
        const handleClick = jest.fn();
        const { getByText } = render(
            <PrimaryButton onClick={handleClick}>Click Me</PrimaryButton>
        );
        fireEvent.click(getByText("Click Me"));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("renders as a link when href is provided", () => {
        const { container } = render(
            <PrimaryButton href="/test">Link Button</PrimaryButton>
        );
        expect(container.firstChild).toHaveAttribute("href", "/test");
    });
});
