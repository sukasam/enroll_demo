import { render, screen } from "@testing-library/react";
import CreateAccount from "./index";

// Mock the required components and hooks
jest.mock(
    "Components/shared/PageLoader",
    () =>
        function PageLoader(): JSX.Element {
            return <div data-testid="page-loader" />;
        }
);
jest.mock("Components/shared/Translate", () => ({
    useTranslate: (): ((key: string) => string) => (key: string) => key
}));
jest.mock(
    "./components/Form",
    () =>
        function CreateAccountForm({
            setIsLoading,
            isLoading
        }: {
            setIsLoading: (value: boolean) => void;
            isLoading: boolean;
        }): JSX.Element {
            return (
                <div data-testid="create-account-form">
                    <button
                        onClick={(): void => setIsLoading(!isLoading)}
                        type="button"
                    >
                        Toggle Loading
                    </button>
                </div>
            );
        }
);

describe("CreateAccount", () => {
    it("renders the component with correct title", () => {
        render(<CreateAccount />);
        expect(
            screen.getByText("create_account_account_information")
        ).toBeInTheDocument();
    });

    it("renders CreateAccountForm", () => {
        render(<CreateAccount />);
        expect(screen.getByTestId("create-account-form")).toBeInTheDocument();
    });

    it("does not show PageLoader by default", () => {
        render(<CreateAccount />);
        expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });
});
