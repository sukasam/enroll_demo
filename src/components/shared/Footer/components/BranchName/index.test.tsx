import { render, screen } from "@testing-library/react";
import BranchName from "./index";

describe("BranchName", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it("should render null when NEXT_PUBLIC_APP_ENV is production", () => {
        process.env.NEXT_PUBLIC_APP_ENV = "production";
        process.env.NEXT_PUBLIC_BRANCH_NAME = "main";

        const { container } = render(<BranchName />);
        expect(container.firstChild).toBeNull();
    });

    it("should render branch name when NEXT_PUBLIC_APP_ENV is not production", () => {
        process.env.NEXT_PUBLIC_APP_ENV = "development";
        process.env.NEXT_PUBLIC_BRANCH_NAME = "feature-branch";

        render(<BranchName />);
        expect(screen.getByText("feature-branch")).toBeInTheDocument();
    });

    it("should render with correct styles", () => {
        process.env.NEXT_PUBLIC_APP_ENV = "development";
        process.env.NEXT_PUBLIC_BRANCH_NAME = "test-branch";

        render(<BranchName />);
        const branchNameElement = screen.getByText("test-branch");

        expect(branchNameElement).toHaveStyle({
            position: "absolute",
            right: 0,
            padding: "5px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            fontSize: "8px"
        });
    });

    it("should render empty div when NEXT_PUBLIC_BRANCH_NAME is not set", () => {
        process.env.NEXT_PUBLIC_APP_ENV = "development";
        process.env.NEXT_PUBLIC_BRANCH_NAME = undefined;

        const { container } = render(<BranchName />);
        const branchNameElement = container.firstChild as HTMLElement;

        expect(branchNameElement).toBeInTheDocument();
        expect(branchNameElement).toHaveTextContent("");
        expect(branchNameElement).toHaveStyle({
            position: "absolute",
            right: "0",
            padding: "5px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            fontSize: "8px"
        });
    });
});
