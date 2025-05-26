import { act, fireEvent, render, screen } from "Shared/testUtils";
import UserFeedback from "./index";

jest.mock("Components/shared/Translate");
jest.mock("./components/Timer");

describe("UserFeedback", () => {
    const defaultProps = {
        value: null,
        onFeedbackChange: jest.fn(),
        onTimerComplete: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe("rendering", () => {
        it("renders in modal variant by default", () => {
            render(<UserFeedback {...defaultProps} />);

            expect(
                screen.getByText("thank_you_feedback_overlay_title")
            ).toBeInTheDocument();
            expect(
                screen.getByText("thank_you_feedback_overlay_prompt")
            ).toBeInTheDocument();
        });

        it("doesn't show title in aside variant", () => {
            render(<UserFeedback {...defaultProps} variant="aside" />);

            expect(
                screen.queryByText("thank_you_feedback_overlay_title")
            ).not.toBeInTheDocument();
            expect(
                screen.getByText("thank_you_feedback_overlay_prompt")
            ).toBeInTheDocument();
        });

        it("shows timer when showTimer is true", () => {
            render(<UserFeedback {...defaultProps} showTimer />);

            expect(screen.getByTestId("timer")).toBeInTheDocument();
        });
    });

    describe("feedback flow", () => {
        it("shows success message after rating", () => {
            render(<UserFeedback {...defaultProps} />);

            // Submit rating
            const fourthStar = screen.getByRole("radio", { name: "4 Stars" });
            fireEvent.click(fourthStar);

            // Check success message
            expect(
                screen.getByText("thank_you_feedback_overlay_success")
            ).toBeInTheDocument();
        });

        it("calls onFeedbackChange after success message delay", () => {
            render(<UserFeedback {...defaultProps} />);

            // Submit rating
            const fourthStar = screen.getByRole("radio", { name: "4 Stars" });
            fireEvent.click(fourthStar);

            // Fast-forward timers
            act(() => {
                jest.advanceTimersByTime(1500);
            });

            expect(defaultProps.onFeedbackChange).toHaveBeenCalled();
            const [, value] = defaultProps.onFeedbackChange.mock.calls[0];
            expect(value).toBe(4);
        });

        it("cleans up timeout on unmount", () => {
            const { unmount } = render(<UserFeedback {...defaultProps} />);

            // Submit rating
            const fourthStar = screen.getByRole("radio", { name: "4 Stars" });
            fireEvent.click(fourthStar);

            unmount();

            // Fast-forward timers
            act(() => {
                jest.advanceTimersByTime(1500);
            });

            expect(defaultProps.onFeedbackChange).not.toHaveBeenCalled();
        });
    });

    describe("timer interaction", () => {
        it("calls onTimerComplete when timer completes", () => {
            render(<UserFeedback {...defaultProps} showTimer />);

            act(() => {
                jest.advanceTimersByTime(0);
            });

            expect(defaultProps.onTimerComplete).toHaveBeenCalled();
        });

        it("cleans up timer on unmount", () => {
            const { unmount } = render(
                <UserFeedback {...defaultProps} showTimer />
            );

            unmount();

            act(() => {
                jest.advanceTimersByTime(0);
            });

            expect(defaultProps.onTimerComplete).not.toHaveBeenCalled();
        });
    });

    describe("state management", () => {
        it("maintains feedback state between renders", () => {
            const { rerender } = render(
                <UserFeedback {...defaultProps} value={3} />
            );

            // Check initial value
            const thirdStar = screen.getByRole("radio", { name: "3 Stars" });
            expect(thirdStar).toBeChecked();

            // Rerender with same value
            rerender(<UserFeedback {...defaultProps} value={3} />);
            expect(thirdStar).toBeChecked();
        });
    });
});
