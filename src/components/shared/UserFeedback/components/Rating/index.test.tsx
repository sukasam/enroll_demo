import { fireEvent, render, screen } from "@testing-library/react";
import Rating from "./index";

jest.mock("Components/shared/Translate");

describe("Rating", () => {
    const defaultProps = {
        value: null,
        onRate: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("rendering", () => {
        it("renders rating container with labels", () => {
            render(<Rating {...defaultProps} />);

            const container = screen.getByTestId("rating-container");
            expect(container).toBeInTheDocument();

            expect(
                screen.getByText("thank_you_feedback_overlay_star_label_1")
            ).toBeInTheDocument();
            expect(
                screen.getByText("thank_you_feedback_overlay_star_label_5")
            ).toBeInTheDocument();
        });

        it("passes correct value to MuiRating", () => {
            const value = 4;
            render(<Rating {...defaultProps} value={value} />);

            const ratingInput = screen.getByRole("radio", { name: "4 Stars" });
            expect(ratingInput).toBeChecked();
        });
    });

    describe("interaction", () => {
        it("calls onRate callback with correct value", () => {
            const mockOnRate = jest.fn();
            render(<Rating {...defaultProps} onRate={mockOnRate} />);

            // Click on a star (we don't need to test all interactions, just that our callback works)
            const fourthStar = screen.getByRole("radio", { name: "4 Stars" });
            fireEvent.click(fourthStar);

            expect(mockOnRate).toHaveBeenCalled();
            expect(mockOnRate.mock.calls[0][1]).toBe(4);
        });
    });

    describe("accessibility", () => {
        it("has correct ARIA labels", () => {
            render(<Rating {...defaultProps} />);

            const container = screen.getByTestId("rating-container");
            expect(container).toHaveAttribute(
                "aria-label",
                "Rating feedback section"
            );
        });

        it("hides visual labels from screen readers", () => {
            render(<Rating {...defaultProps} />);

            const labelsContainer = screen
                .getByTestId("rating-container")
                .querySelector(".rating-labels-container");
            expect(labelsContainer).toHaveAttribute("aria-hidden", "true");
        });
    });
});
