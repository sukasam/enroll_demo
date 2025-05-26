import { act, render, screen } from "@testing-library/react";
import Timer from "./index";

jest.mock("Components/shared/Translate");

describe("Timer", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    describe("rendering", () => {
        it("renders with default props", () => {
            const mockOnComplete = jest.fn();
            render(<Timer onComplete={mockOnComplete} />);

            expect(screen.getByRole("progressbar")).toBeInTheDocument();
            expect(screen.getByText("60")).toBeInTheDocument();
            expect(
                screen.getByText("thank_you_feedback_overlay_timer")
            ).toBeInTheDocument();
        });

        it("renders timer with all expected elements", () => {
            const mockOnComplete = jest.fn();
            render(<Timer onComplete={mockOnComplete} />);

            const progressBar = screen.getByRole("progressbar");
            expect(progressBar).toBeInTheDocument();
            expect(progressBar).toHaveAttribute("aria-valuenow", "100");

            const timerNumber = screen.getByText("60");
            expect(timerNumber).toBeInTheDocument();
            expect(timerNumber).toHaveClass("timer-number");

            const timerText = screen.getByText(
                "thank_you_feedback_overlay_timer"
            );
            expect(timerText).toBeInTheDocument();
            expect(timerText).toHaveClass("timer-text");
        });

        it("renders with custom duration", () => {
            const mockOnComplete = jest.fn();
            render(<Timer duration={30} onComplete={mockOnComplete} />);

            expect(screen.getByText("30")).toBeInTheDocument();
        });
    });

    describe("countdown behavior", () => {
        it("updates timer every second", () => {
            const mockOnComplete = jest.fn();
            render(<Timer duration={3} onComplete={mockOnComplete} />);

            expect(screen.getByText("3")).toBeInTheDocument();

            act(() => {
                jest.advanceTimersByTime(1000);
            });
            expect(screen.getByText("2")).toBeInTheDocument();
        });

        it("calls onComplete when timer reaches zero", () => {
            const mockOnComplete = jest.fn();
            render(<Timer duration={2} onComplete={mockOnComplete} />);

            act(() => {
                jest.advanceTimersByTime(2000);
            });

            expect(mockOnComplete).toHaveBeenCalledTimes(1);
        });
    });

    describe("progress indicator", () => {
        it("shows correct progress percentage", () => {
            const mockOnComplete = jest.fn();
            render(<Timer duration={4} onComplete={mockOnComplete} />);

            const getProgress = () =>
                screen.getByRole("progressbar").getAttribute("aria-valuenow");

            expect(getProgress()).toBe("100");

            act(() => {
                jest.advanceTimersByTime(2000);
            });
            expect(getProgress()).toBe("50");
        });
    });

    describe("cleanup", () => {
        it("cleans up interval on unmount", () => {
            const clearIntervalSpy = jest.spyOn(window, "clearInterval");
            const mockOnComplete = jest.fn();

            const { unmount } = render(
                <Timer duration={5} onComplete={mockOnComplete} />
            );

            unmount();
            expect(clearIntervalSpy).toHaveBeenCalled();
            clearIntervalSpy.mockRestore();
        });
    });
});
