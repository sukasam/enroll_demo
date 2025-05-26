import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useUser } from "Contexts/UserContext";
import Avatar from "./index";

// Mock the useUser hook
jest.mock("Contexts/UserContext", () => ({
    useUser: jest.fn()
}));

describe("Avatar", () => {
    it("renders correctly with full name", () => {
        (useUser as jest.Mock).mockReturnValue({
            userData: { fullName: "John Doe" }
        });

        const { container } = render(<Avatar />);
        expect(screen.getByText("JD")).toBeInTheDocument();
        expect(container.firstChild).toMatchSnapshot();
    });

    it("renders correctly with single name", () => {
        (useUser as jest.Mock).mockReturnValue({
            userData: { fullName: "John" }
        });

        render(<Avatar />);
        expect(screen.getByText("J")).toBeInTheDocument();
    });

    it("renders default avatar icon with empty name", () => {
        (useUser as jest.Mock).mockReturnValue({
            userData: { fullName: "" }
        });

        render(<Avatar />);
        expect(screen.getByTestId("PersonIcon")).toBeInTheDocument();
    });

    it("renders default avatar icon with undefined userData", () => {
        (useUser as jest.Mock).mockReturnValue({
            userData: undefined
        });

        render(<Avatar />);
        expect(screen.getByTestId("PersonIcon")).toBeInTheDocument();
    });

    it("applies correct styles", () => {
        (useUser as jest.Mock).mockReturnValue({
            userData: { fullName: "John Doe" }
        });

        render(<Avatar />);
        const avatar = screen.getByText("JD");
        expect(avatar).toHaveStyle({
            backgroundColor: "#75a4d3",
            width: "24px",
            height: "24px",
            fontSize: "12px",
            marginRight: "8px"
        });
    });
});
