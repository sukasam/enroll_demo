import { fireEvent, render, screen } from "@testing-library/react";
import LoginErrorModal from "./index";

jest.mock("Components/shared/Translate", () => ({
    useTranslate:
        () =>
        (key: string): string =>
            `Translated ${key}`,
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }): JSX.Element => (
        <span>{children}</span>
    )
}));

describe("LoginErrorModal", () => {
    const mockOnClose = jest.fn();
    const defaultProps = {
        title: "Error Title",
        description: "Error Description",
        onClose: mockOnClose
    };

    beforeEach(() => {
        render(<LoginErrorModal {...defaultProps} />);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders the error title", () => {
        expect(screen.getByTestId("login_error_modal_title")).toHaveTextContent(
            "Error Title"
        );
    });

    it("renders the translated error description", () => {
        expect(
            screen.getByTestId("login_error_modal_description")
        ).toHaveTextContent("Translated Error Description");
    });

    it("renders the cancel button with correct text", () => {
        expect(
            screen.getByTestId("login_error_modal_cancel")
        ).toHaveTextContent("home_modal_cancel");
    });

    it("calls onClose when clicking the cancel button", () => {
        fireEvent.click(screen.getByTestId("login_error_modal_cancel"));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when pressing Enter on the cancel button", () => {
        fireEvent.keyDown(screen.getByTestId("login_error_modal_cancel"), {
            key: "Enter"
        });
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when pressing Space on the cancel button", () => {
        fireEvent.keyDown(screen.getByTestId("login_error_modal_cancel"), {
            key: "Space"
        });
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose when pressing other keys on the cancel button", () => {
        fireEvent.keyDown(screen.getByTestId("login_error_modal_cancel"), {
            key: "A"
        });
        expect(mockOnClose).not.toHaveBeenCalled();
    });
});
