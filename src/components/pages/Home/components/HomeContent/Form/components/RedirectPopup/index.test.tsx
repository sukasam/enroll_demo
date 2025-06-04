/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable react/function-component-definition */
import { fireEvent, render, screen } from "@testing-library/react";
import { Alpha2 } from "Constants/countryConfig/enums";
import RedirectPopup from "./index";

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
};

type TranslateProps = {
    children: string | ((variables: Record<string, unknown>) => string);
    variables?: Record<string, unknown>;
};

interface ImageProps {
    src: string;
    alt: string;
    "data-testid"?: string;
}

jest.mock("next/image", () => ({
    __esModule: true,
    default: ({
        src,
        alt,
        "data-testid": testId,
        ...props
    }: ImageProps): JSX.Element => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt}
            data-testid={testId || "next-image"}
            {...props}
        />
    )
}));

jest.mock("Components/shared/PrimaryButton", function () {
    return ({ children, ...props }: PrimaryButtonProps): React.ReactNode => (
        <button type="button" {...props}>
            {children}
        </button>
    );
});

jest.mock("Components/shared/Translate", function () {
    return ({ children, variables }: TranslateProps): React.ReactNode => (
        <span>
            {typeof children === "function"
                ? children(variables || {})
                : children}
        </span>
    );
});

jest.mock("Constants/countryConfig", () => ({
    getCountryConfig: jest.fn(() => ({ name: "Test Country" }))
}));

jest.mock("utils/cacheManager", () => ({
    CacheManager: {
        clearAllCache: jest.fn().mockResolvedValue(undefined)
    }
}));

describe("RedirectPopup", () => {
    const mockProps = {
        path: "/test-path",
        selectedCountry: Alpha2.US,
        onClose: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        delete (window as { location?: Location }).location;
        (window as { location: Partial<Location> }).location = {
            href: "",
            reload: jest.fn()
        };
    });

    it("renders the component with correct content", () => {
        render(<RedirectPopup {...mockProps} />);

        const image = screen.getByTestId("next-image");
        expect(image).toHaveAttribute("src", "/svg/hang-tight.svg");
        expect(image).toHaveAttribute("alt", "");

        expect(screen.getByText("home_modal_hang_tight")).toBeInTheDocument();
        expect(
            screen.getByTestId("home_modal_hang_tight_description")
        ).toBeInTheDocument();
        expect(screen.getByText("home_modal_lets_go_btn")).toBeInTheDocument();
        expect(screen.getByText("home_modal_cancel")).toBeInTheDocument();
    });

    it('redirects when clicking the "Let\'s Go" button', () => {
        render(<RedirectPopup {...mockProps} />);
        fireEvent.click(screen.getByText("home_modal_lets_go_btn"));

        expect(window.location.href).toBe("/test-path");
    });

    it("calls onClose when clicking the cancel button", async () => {
        render(<RedirectPopup {...mockProps} />);
        fireEvent.click(screen.getByText("home_modal_cancel"));
        // Wait for async operations to complete
        await Promise.resolve();
        expect(mockProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when pressing Enter or Space on the cancel button", async () => {
        render(<RedirectPopup {...mockProps} />);
        const cancelButton = screen.getByText("home_modal_cancel");

        fireEvent.keyDown(cancelButton, { key: "Enter" });
        // Wait for async operations to complete
        await Promise.resolve();
        expect(mockProps.onClose).toHaveBeenCalledTimes(1);

        fireEvent.keyDown(cancelButton, { key: "Space" });
        // Wait for async operations to complete
        await Promise.resolve();
        expect(mockProps.onClose).toHaveBeenCalledTimes(2);

        fireEvent.keyDown(cancelButton, { key: "Escape" });
        // Wait for async operations to complete
        await Promise.resolve();
        expect(mockProps.onClose).toHaveBeenCalledTimes(2);
    });
});
