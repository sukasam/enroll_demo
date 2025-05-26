import { toast } from "react-toastify";
import showToast, { dismissAllErrorToasts } from "./index";

// Mock react-toastify
jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(() => "success-id"),
        error: jest.fn(() => "error-id"),
        info: jest.fn(() => "info-id"),
        warning: jest.fn(() => "warning-id"),
        dismiss: jest.fn()
    }
}));

describe("ShowToaster", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should show a success toast", () => {
        showToast("Success message", "success");
        expect(toast.success).toHaveBeenCalledWith(
            expect.any(Object),
            expect.objectContaining({
                icon: "✅",
                autoClose: 5000
            })
        );
    });

    it("should show an error toast", () => {
        showToast("Error message", "error");
        expect(toast.error).toHaveBeenCalledWith(
            expect.any(Object),
            expect.objectContaining({
                icon: "❌",
                autoClose: false
            })
        );
    });

    it("should show a warning toast", () => {
        showToast("Warning message", "warning");
        expect(toast.warning).toHaveBeenCalledWith(
            expect.any(Object),
            expect.objectContaining({
                icon: "⚠️",
                autoClose: 5000
            })
        );
    });

    it("should show an info toast", () => {
        showToast("Info message", "info");
        expect(toast.info).toHaveBeenCalledWith(
            expect.any(Object),
            expect.objectContaining({
                icon: "ℹ️",
                autoClose: 5000
            })
        );
    });

    it('should use default type "info" when no type is provided', () => {
        showToast("Default message");
        expect(toast.info).toHaveBeenCalled();
    });

    it("should render string content with dangerouslySetInnerHTML", () => {
        showToast("<p>HTML content</p>", "info");
        expect(toast.info).toHaveBeenCalledWith(
            expect.objectContaining({
                props: expect.objectContaining({
                    dangerouslySetInnerHTML: expect.any(Object)
                })
            }),
            expect.any(Object)
        );
    });

    it("should render React node content directly", () => {
        const content = <div>React content</div>;
        showToast(content, "info");
        expect(toast.info).toHaveBeenCalledWith(content, expect.any(Object));
    });

    it("should merge custom options with default options", () => {
        showToast("Custom options", "success", {
            position: "bottom-left" as const
        });
        expect(toast.success).toHaveBeenCalledWith(
            expect.any(Object),
            expect.objectContaining({
                position: "bottom-left",
                autoClose: 5000
            })
        );
    });

    describe("dismissAllErrorToasts", () => {
        it("should dismiss all error toasts", () => {
            showToast("Error 1", "error");
            showToast("Error 2", "error");

            dismissAllErrorToasts();

            expect(toast.dismiss).toHaveBeenCalledTimes(3);
            expect(toast.dismiss).toHaveBeenCalledWith("error-id");
        });

        it("should not dismiss non-error toasts", () => {
            showToast("Success", "success");
            showToast("Error", "error");
            showToast("Info", "info");

            dismissAllErrorToasts();

            expect(toast.dismiss).toHaveBeenCalledTimes(1);
            expect(toast.dismiss).toHaveBeenCalledWith("error-id");
        });
    });
});
