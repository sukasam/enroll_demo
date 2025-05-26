import { render, screen } from "@testing-library/react";
import PasswordRequirements from "./index";

// Mock the useTranslate hook
jest.mock("Components/shared/Translate", () => ({
    useTranslate: (): ((key: string) => string) => (key: string) => key
}));

describe("PasswordRequirements", () => {
    const defaultProps = {
        password: "",
        touchedFields: { password: false }
    };

    it("renders correctly", () => {
        render(<PasswordRequirements {...defaultProps} />);
        expect(
            screen.getByTestId("create_account_password_must")
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("create_account_password_requirement_1")
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("create_account_password_requirement_2")
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("create_account_password_requirement_3")
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("create_account_password_requirement_4")
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("create_account_password_requirement_5")
        ).toBeInTheDocument();
    });

    it("applies correct classes when password is empty and untouched", () => {
        render(<PasswordRequirements {...defaultProps} />);
        expect(
            screen.getByTestId("create_account_password_requirement_1")
        ).toHaveClass("initial");
        expect(
            screen.getByTestId("create_account_password_requirement_2")
        ).toHaveClass("initial");
        expect(
            screen.getByTestId("create_account_password_requirement_3")
        ).toHaveClass("initial");
        expect(
            screen.getByTestId("create_account_password_requirement_4")
        ).toHaveClass("initial");
        expect(
            screen.getByTestId("create_account_password_requirement_5")
        ).toHaveClass("initial");
    });

    it("applies correct classes when password is invalid and touched", () => {
        render(
            <PasswordRequirements
                password="weak"
                touchedFields={{ password: true }}
            />
        );
        expect(
            screen.getByTestId("create_account_password_requirement_1")
        ).toHaveClass("invalid");
        expect(
            screen.getByTestId("create_account_password_requirement_2")
        ).toHaveClass("valid");
        expect(
            screen.getByTestId("create_account_password_requirement_3")
        ).toHaveClass("invalid");
        expect(
            screen.getByTestId("create_account_password_requirement_4")
        ).toHaveClass("invalid");
        expect(
            screen.getByTestId("create_account_password_requirement_5")
        ).toHaveClass("invalid");
    });

    it("applies correct classes when password is valid", () => {
        render(
            <PasswordRequirements
                password="StrongP@ss1"
                touchedFields={{ password: true }}
            />
        );
        expect(
            screen.getByTestId("create_account_password_requirement_1")
        ).toHaveClass("valid");
        expect(
            screen.getByTestId("create_account_password_requirement_2")
        ).toHaveClass("valid");
        expect(
            screen.getByTestId("create_account_password_requirement_3")
        ).toHaveClass("valid");
        expect(
            screen.getByTestId("create_account_password_requirement_4")
        ).toHaveClass("valid");
        expect(
            screen.getByTestId("create_account_password_requirement_5")
        ).toHaveClass("valid");
    });

    it("updates classes when password changes", () => {
        const { rerender } = render(<PasswordRequirements {...defaultProps} />);
        expect(
            screen.getByTestId("create_account_password_requirement_1")
        ).toHaveClass("initial");

        rerender(
            <PasswordRequirements
                password="StrongP@ss1"
                touchedFields={{ password: true }}
            />
        );
        expect(
            screen.getByTestId("create_account_password_requirement_1")
        ).toHaveClass("valid");
    });

    // Snapshot test
    it("matches snapshot", () => {
        const { container } = render(
            <PasswordRequirements {...defaultProps} />
        );
        expect(container.firstChild).toMatchSnapshot();
    });
});
