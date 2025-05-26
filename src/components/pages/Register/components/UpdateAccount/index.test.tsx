import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UpdateAccount from "./index";

// Mock the imported components
jest.mock(
    "Components/shared/PageLoader",
    () =>
        function PageLoader(): JSX.Element {
            return <div>Loading...</div>;
        }
);

jest.mock(
    "Components/shared/Translate",
    () =>
        function Translate({ children }: { children: string }): JSX.Element {
            return <span>{children}</span>;
        }
);

jest.mock(
    "./components/Form",
    () =>
        function Form({
            setIsLoading,
            isLoading
        }: {
            setIsLoading: (isLoading: boolean) => void;
            isLoading: boolean;
        }): JSX.Element {
            return (
                <form
                    aria-label="Update Account Form"
                    onSubmit={(e): void => {
                        e.preventDefault();
                        setIsLoading(true);
                    }}
                >
                    <button type="submit">Submit</button>
                </form>
            );
        }
);

describe("UpdateAccount", () => {
    it("renders the component with correct elements", () => {
        render(<UpdateAccount />);

        expect(
            screen.getByText("create_account_account_information")
        ).toBeInTheDocument();
        expect(
            screen.getByRole("form", { name: "Update Account Form" })
        ).toBeInTheDocument();
    });

    it("does not show loading state initially", () => {
        render(<UpdateAccount />);

        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    it("shows loading state when form is submitted", async () => {
        render(<UpdateAccount />);

        const submitButton = screen.getByRole("button", { name: "Submit" });
        userEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("Loading...")).toBeInTheDocument();
        });
    });
});
