import { fireEvent, render, screen } from "@testing-library/react";
import RadioContainer from "./index";

// Mock the dependencies
jest.mock("@mui/material", () => ({
    Grid: ({ children, ...props }) => <div {...props}>{children}</div>
}));
jest.mock("Components/shared/LocalImage", () => ({ src, ...props }) => (
    <img src={src} {...props} alt="test" />
));
jest.mock("Components/shared/StyledRadio", () => ({ checked }) => (
    <input type="radio" checked={checked} alt="test" />
));
jest.mock("./styles", () => ({
    __esModule: true,
    default: {},
    errorMessageStyles: {}
}));

describe("RadioContainer", () => {
    const defaultProps = {
        label: "Test Label",
        value: "test",
        checked: "",
        setChecked: jest.fn(),
        dataTest: "radio-container"
    };

    it("renders with basic props", () => {
        render(<RadioContainer {...defaultProps} />);
        expect(screen.getByText("Test Label")).toBeInTheDocument();
        expect(screen.getByTestId("radio-container")).toBeInTheDocument();
    });

    it("calls setChecked when clicked", () => {
        render(<RadioContainer {...defaultProps} />);
        fireEvent.click(screen.getByTestId("radio-container"));
        expect(defaultProps.setChecked).toHaveBeenCalledWith("test");
    });

    it("applies checked class when isChecked is true", () => {
        render(<RadioContainer {...defaultProps} checked="test" />);
        expect(screen.getByTestId("radio-container").parentElement).toHaveClass(
            "checked"
        );
    });

    it("renders icon when provided", () => {
        render(<RadioContainer {...defaultProps} icon="test-icon.png" />);
        expect(screen.getByRole("img")).toHaveAttribute("src", "test-icon.png");
    });

    it("renders edit component when provided", () => {
        const EditComponent = () => <span>Edit</span>;
        render(<RadioContainer {...defaultProps} edit={<EditComponent />} />);
        expect(screen.getByText("Edit")).toBeInTheDocument();
    });

    it("renders error message when error prop is provided", () => {
        render(<RadioContainer {...defaultProps} error="Error message" />);
        expect(screen.getByText("Error message")).toBeInTheDocument();
    });

    it("applies noBoldLabel class when not checked and noBoldLabel is true", () => {
        render(<RadioContainer {...defaultProps} noBoldLabel />);
        expect(screen.getByText("Test Label")).toHaveClass("noBoldLabel");
    });

    it("renders children when alwaysShowChildren is true", () => {
        render(
            <RadioContainer {...defaultProps} alwaysShowChildren>
                <div>Child content</div>
            </RadioContainer>
        );
        expect(screen.getByText("Child content")).toBeInTheDocument();
    });

    it("renders children when checked", () => {
        render(
            <RadioContainer {...defaultProps} checked="test">
                <div>Child content</div>
            </RadioContainer>
        );
        expect(screen.getByText("Child content")).toBeInTheDocument();
    });

    it("does not render children when not checked and alwaysShowChildren is false", () => {
        render(
            <RadioContainer {...defaultProps}>
                <div>Child content</div>
            </RadioContainer>
        );
        expect(screen.queryByText("Child content")).not.toBeInTheDocument();
    });
});
