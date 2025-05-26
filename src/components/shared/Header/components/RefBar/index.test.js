import { render, screen, waitFor } from "@testing-library/react";
import { getCookie } from "cookies-next";
import ReferralBar from "./index";

const mockUseUser = jest.fn();
jest.mock("Contexts/UserContext", () => ({
    useUser: () => mockUseUser()
}));

jest.mock("Components/shared/Spinner", () => () => (
    <div data-testid="spinner" />
));
jest.mock("Components/shared/Translate", () => ({ children }) => (
    <span>{children}</span>
));
jest.mock("./styles", () => ({}));

// Mock getCookie
jest.mock("cookies-next", () => ({
    getCookie: jest.fn()
}));

describe("ReferralBar", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getCookie.mockReturnValue("en");
    });

    it("renders spinner when no enroller name is available", () => {
        mockUseUser.mockReturnValue({
            enrollerFullName: null,
            enrollerAllFullName: null
        });
        render(<ReferralBar />);
        expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });

    it("renders referral information using enrollerFullName when enrollerAllFullName is not available", async () => {
        const enrollerName = "John Doe";
        mockUseUser.mockReturnValue({
            enrollerFullName: enrollerName,
            enrollerAllFullName: null
        });

        render(<ReferralBar />);

        await waitFor(
            () => {
                const enrollerNameElement = screen.getByTestId(
                    "referral_bar_enroller_name"
                );
                expect(enrollerNameElement).toBeInTheDocument();
                expect(enrollerNameElement.textContent.trim()).toBe(
                    enrollerName
                );
            },
            { timeout: 2000 }
        );
    });

    it("renders referral information using language-specific name from enrollerAllFullName", async () => {
        const enrollerName = "John Doe";
        const languageSpecificName = "John Doe (EN)";
        mockUseUser.mockReturnValue({
            enrollerFullName: enrollerName,
            enrollerAllFullName: { "fullName@en": languageSpecificName }
        });

        render(<ReferralBar />);

        await waitFor(
            () => {
                expect(
                    screen.getByTestId("referral_bar_text")
                ).toHaveTextContent("create_account_referred_by");
                expect(
                    screen.getByTestId("referral_bar_enroller_name")
                ).toHaveTextContent(languageSpecificName);
            },
            { timeout: 2000 }
        );
    });

    it("falls back to enrollerFullName when language-specific name is not available", async () => {
        const enrollerName = "John Doe";
        mockUseUser.mockReturnValue({
            enrollerFullName: enrollerName,
            enrollerAllFullName: { "fullName@fr": "John Doe (FR)" }
        });

        render(<ReferralBar />);

        expect(screen.getByTestId("referral_bar_text")).toHaveTextContent(
            "create_account_referred_by"
        );
        expect(
            screen.getByTestId("referral_bar_enroller_name")
        ).toHaveTextContent(enrollerName);
    });

    it("matches snapshot when enroller name is available", async () => {
        const enrollerName = "Jane Smith";
        mockUseUser.mockReturnValue({
            enrollerFullName: enrollerName,
            enrollerAllFullName: { "fullName@en": enrollerName }
        });

        const { container } = render(<ReferralBar />);
        expect(container).toMatchSnapshot();
    });

    it("matches snapshot when no enroller name is available", () => {
        mockUseUser.mockReturnValue({
            enrollerFullName: null,
            enrollerAllFullName: null
        });
        const { container } = render(<ReferralBar />);
        expect(container).toMatchSnapshot();
    });
});
