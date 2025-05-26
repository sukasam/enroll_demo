import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { UserContextState } from "Contexts/types/UserContextTypes";
import { useUser } from "Contexts/UserContext";
import React from "react";
import Home from "./index";
// Mock the useUser hook
jest.mock("Contexts/UserContext", () => ({
    useUser: jest.fn()
}));

// Mock child components (unchanged)
jest.mock("./components/PackSection", () => ({
    __esModule: true,
    default: (): JSX.Element => (
        <div data-testid="pack-section">Pack Section</div>
    )
}));
jest.mock("./components/NotReadySection", () => ({
    __esModule: true,
    default: ({ enrollerId }: { enrollerId: string }): JSX.Element => (
        <div data-testid="not-ready-section">
            Not Ready Section: {enrollerId}
        </div>
    )
}));
jest.mock("./components/CustomizerModal", () => ({
    __esModule: true,
    default: ({
        customizerModalID,
        setCustomizerModalID
    }: {
        customizerModalID: number;
        setCustomizerModalID: (id: number | null) => void;
    }): JSX.Element => (
        <div data-testid="customizer-modal">
            Customizer Modal: {customizerModalID}
        </div>
    )
}));

describe("Home component", () => {
    const mockEnrollerId = "test-enroller-id";

    const mockUserContextValue: Partial<UserContextState> = {
        enrollerId: mockEnrollerId,
        isUserContextLoading: false
    };

    beforeEach(() => {
        (useUser as jest.Mock).mockReturnValue(mockUserContextValue);
    });

    test("renders PackSection component", () => {
        render(<Home />);
        expect(screen.getByTestId("pack-section")).toBeInTheDocument();
    });

    test("renders NotReadySection component with correct enrollerId", () => {
        render(<Home />);
        const notReadySection = screen.getByTestId("not-ready-section");
        expect(notReadySection).toBeInTheDocument();
        expect(notReadySection).toHaveTextContent(
            `Not Ready Section: ${mockEnrollerId}`
        );
    });

    test("does not render CustomizerModal by default", () => {
        render(<Home />);
        expect(
            screen.queryByTestId("customizer-modal")
        ).not.toBeInTheDocument();
    });

    // Add this new test
    test("renders CustomizerModal when customizerModalID is not null", () => {
        jest.spyOn(React, "useState").mockImplementation(() => [1, jest.fn()]);
        render(<Home />);
        expect(screen.getByTestId("customizer-modal")).toBeInTheDocument();
        expect(screen.getByTestId("customizer-modal")).toHaveTextContent(
            "Customizer Modal: 1"
        );
    });
});
