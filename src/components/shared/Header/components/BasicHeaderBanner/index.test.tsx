import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Alpha2 } from "Constants/countryConfig/enums";
import { useFlags } from "launchdarkly-react-client-sdk";
import { useRouter } from "next/router";
import BasicHeaderBanner from "./index";

// Mock the dependencies
jest.mock("launchdarkly-react-client-sdk", () => ({
    useFlags: jest.fn()
}));

jest.mock("next/router", () => ({
    useRouter: jest.fn()
}));

jest.mock(
    "Components/shared/BannerNotificationAlerts/index",
    (): any =>
        function MockBannerNotificationAlerts({
            currentMarket,
            bannerFlagLD
        }: any) {
            return (
                <div
                    data-testid="banner-notification-alerts"
                    data-currentmarket={currentMarket}
                    data-bannerflagld={bannerFlagLD.toString()}
                />
            );
        }
);

describe("BasicHeaderBanner", () => {
    const mockProps = {
        currentMarket: Alpha2.US,
        flagNameLD: "testFlag"
    };

    beforeEach(() => {
        (useFlags as jest.Mock).mockReturnValue({ testFlag: true });
        (useRouter as jest.Mock).mockReturnValue({ pathname: "/test" });
    });

    it("renders BannerNotificationAlerts when flag is true", () => {
        render(<BasicHeaderBanner {...mockProps} />);
        expect(
            screen.getByTestId("banner-notification-alerts")
        ).toBeInTheDocument();
    });

    it('does not render on home page when flagNameLD is "outOfStock"', () => {
        (useFlags as jest.Mock).mockReturnValue({ outOfStock: true });
        (useRouter as jest.Mock).mockReturnValue({ pathname: "/home" });
        const { container } = render(
            <BasicHeaderBanner {...mockProps} flagNameLD="outOfStock" />
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders on home page when flagNameLD is not "outOfStock"', () => {
        (useRouter as jest.Mock).mockReturnValue({ pathname: "/home" });
        render(<BasicHeaderBanner {...mockProps} />);
        expect(
            screen.getByTestId("banner-notification-alerts")
        ).toBeInTheDocument();
    });

    it("passes correct props to BannerNotificationAlerts", () => {
        render(<BasicHeaderBanner {...mockProps} />);
        const banner = screen.getByTestId("banner-notification-alerts");
        expect(banner).toHaveAttribute("data-currentmarket", Alpha2.US);
        expect(banner).toHaveAttribute("data-bannerflagld", "true");
    });

    it("matches snapshot when rendered", () => {
        const { container } = render(<BasicHeaderBanner {...mockProps} />);
        expect(container.firstChild).toMatchSnapshot();
    });
});
