import { render, screen } from "@testing-library/react";
import { mockRouter, mockUseRouter } from "test-utils/router-mock";
import LoginContent from "./index";

jest.mock("Components/shared/Translate", () => ({
    useTranslate:
        () =>
        (key: string): string =>
            key
}));

jest.mock("../LoginForm", () => {
    const originalModule = jest.requireActual("../LoginForm");

    return {
        __esModule: true,
        ...originalModule,
        default: jest.fn(originalModule.default)
    };
});

describe("LoginContent", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseRouter.mockReturnValue(mockRouter);
        render(<LoginContent />);
    });

    it("renders the upgrade opportunity section", () => {
        expect(
            screen.getByTestId("upgrade_opportunity_section")
        ).toBeInTheDocument();
    });

    it("displays the correct title", () => {
        expect(
            screen.getByTestId("login_upgrade_your_opportunity")
        ).toHaveTextContent("login_upgrade_your_opportunity");
    });

    it("shows the starting Unicity business text", () => {
        expect(
            screen.getByTestId("login_starting_unicity_business")
        ).toHaveTextContent("login_starting_unicity_business");
    });

    it("displays the member sign in subtitle", () => {
        expect(screen.getByTestId("login_member_sign_in")).toHaveTextContent(
            "login_member_sign_in"
        );
    });

    it("renders the LoginForm component", () => {
        expect(screen.getByTestId("login-form")).toBeInTheDocument();
    });

    it("includes a forgot password link", () => {
        const forgotPasswordLink = screen.getByTestId("login_forgot_password");
        expect(forgotPasswordLink).toHaveAttribute(
            "href",
            "https://office.unicity.com/pwupdate/#/reset"
        );
        expect(forgotPasswordLink).toHaveAttribute("target", "_blank");
        expect(forgotPasswordLink).toHaveAttribute("rel", "noreferrer");
        expect(forgotPasswordLink).toHaveTextContent("login_forgot_password");
    });

    it("includes an enrollment link", () => {
        const enrollmentLink = screen.getByTestId("login_enroll_now");
        expect(enrollmentLink).toHaveAttribute("href", "/home");
        expect(enrollmentLink).toHaveAttribute("aria-label", "Enrollment Link");
        expect(enrollmentLink.innerHTML).toContain("login_dont_have_account");
        expect(enrollmentLink.innerHTML).toContain("login_enroll_now");
    });
});
