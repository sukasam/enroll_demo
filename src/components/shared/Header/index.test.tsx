import { useUser } from "Contexts/UserContext";
import { useTranslations } from "Contexts/translation";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import { fireEvent, render, screen } from "Shared/testUtils";
import { useRouter } from "next/router";
import useReferralBarVisibility from "./hooks/useReferralBarVisibility";
import Header from "./index";

// Mock the required hooks and services
jest.mock("next/router", () => ({
    useRouter: jest.fn()
}));
jest.mock("Contexts/UserContext", () => ({
    useUser: jest.fn()
}));
jest.mock("Contexts/translation", () => ({
    useTranslations: jest.fn()
}));
jest.mock("./hooks/useReferralBarVisibility", () => jest.fn());
jest.mock("Services/mixpanel/initializeMixPanel", () => ({
    trackEvent: jest.fn()
}));
jest.mock("Components/shared/Translate", () => ({
    useTranslate: (): ((key: string) => string) => (key: string) => key
}));

jest.mock("./components/LanguageSelect", () => ({
    __esModule: true,
    default: (): JSX.Element => <div data-testid="language-select" />
}));
jest.mock("./components/Avatar", () => ({
    __esModule: true,
    default: (): JSX.Element => <div data-testid="avatar" />
}));
jest.mock("./components/RefBar", () => ({
    __esModule: true,
    default: (): JSX.Element => <div data-testid="referral-bar" />
}));
jest.mock("./components/MaintenanceBanner", () => ({
    __esModule: true,
    default: (): JSX.Element => <div data-testid="maintenance-banner" />
}));
jest.mock("./components/BasicHeaderBanner", () => ({
    __esModule: true,
    default: ({ flagNameLD }: { flagNameLD: string }): JSX.Element => (
        <div data-testid={`${flagNameLD}-banner`} />
    )
}));

describe("Header", () => {
    beforeEach((): void => {
        (useRouter as jest.Mock).mockReturnValue({ pathname: "/" });
        (useUser as jest.Mock).mockReturnValue({
            isLoggedIn: false,
            enrollerId: null
        });
        (useTranslations as jest.Mock).mockReturnValue({ country: "US" });
        (useReferralBarVisibility as jest.Mock).mockReturnValue(false);
    });

    it("renders the Unicity logo", (): void => {
        render(<Header />);
        const logo = screen.getByAltText("Unicity-Logo");
        expect(logo).toBeInTheDocument();
    });

    it("does not render CountryDisplay on home page", (): void => {
        (useRouter as jest.Mock).mockReturnValue({ pathname: "/home" });
        render(<Header />);
        expect(screen.queryByTestId("country-display")).not.toBeInTheDocument();
    });

    it("renders LanguageSelect", (): void => {
        render(<Header />);
        expect(screen.getByTestId("language-select")).toBeInTheDocument();
    });

    it("renders Avatar and logout button when user is logged in", (): void => {
        (useUser as jest.Mock).mockReturnValue({
            isLoggedIn: true,
            enrollerId: "123"
        });
        render(<Header />);
        expect(screen.getByTestId("avatar")).toBeInTheDocument();
        expect(screen.getByText("header_logout")).toBeInTheDocument();
    });

    it("does not render Avatar and logout button when user is not logged in", (): void => {
        render(<Header />);
        expect(screen.queryByTestId("avatar")).not.toBeInTheDocument();
        expect(screen.queryByText("header_logout")).not.toBeInTheDocument();
    });

    it("renders ReferralBar when conditions are met", (): void => {
        (useUser as jest.Mock).mockReturnValue({
            isLoggedIn: true,
            enrollerId: "123"
        });
        (useReferralBarVisibility as jest.Mock).mockReturnValue(true);
        (useRouter as jest.Mock).mockReturnValue({ pathname: "/" });
        render(<Header />);
        expect(screen.getByTestId("referral-bar")).toBeInTheDocument();
    });

    it("calls logout function and tracks event when logout button is clicked", (): void => {
        (useUser as jest.Mock).mockReturnValue({
            isLoggedIn: true,
            enrollerId: "123"
        });
        (useRouter as jest.Mock).mockReturnValue({ pathname: "/dashboard" });

        const { getByText } = render(<Header />);
        fireEvent.click(getByText("header_logout"));

        expect(mixpanelService.trackEvent).toHaveBeenCalledWith("enr_logout", {
            event_location: "dashboard"
        });
    });

    it("renders MaintenanceBanner and BasicHeaderBanners", (): void => {
        render(<Header />);
        expect(screen.getByTestId("maintenance-banner")).toBeInTheDocument();
        expect(
            screen.getByTestId("technicalDifficultyBanner-banner")
        ).toBeInTheDocument();
        expect(screen.getByTestId("outOfStock-banner")).toBeInTheDocument();
    });
});
