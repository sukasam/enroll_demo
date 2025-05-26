import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useUser } from "Contexts/UserContext";
import { mockRouter, mockUseRouter } from "test-utils/router-mock";
import { TestWrapper } from "test-utils/test-wrapper";
import LoginForm from "./index";

jest.mock("Contexts/UserContext");
jest.mock("Components/shared/Translate", () => ({
    useTranslate: (): ((key: string) => string) => (key: string) => key
}));

describe("LoginForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseRouter.mockReturnValue(mockRouter);
        (useUser as jest.Mock).mockReturnValue({
            userData: null,
            setUserToken: jest.fn(),
            userToken: null,
            setLoggedInData: jest.fn()
        });
    });

    it("renders the login form", () => {
        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>
        );
        expect(screen.getByTestId("login-form")).toBeInTheDocument();
    });
});
