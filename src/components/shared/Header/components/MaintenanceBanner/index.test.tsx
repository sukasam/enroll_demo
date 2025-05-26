import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { useCountryConfig } from "Constants/countryConfig";
import { Alpha2 } from "Constants/countryConfig/enums";
import { useFlags } from "launchdarkly-react-client-sdk";
import convertDateToCustomFormat from "Services/utils/dateFormatter";
import MaintenanceBanner from "./index";

// Mock the dependencies
jest.mock("launchdarkly-react-client-sdk", () => ({
    useFlags: jest.fn()
}));

jest.mock("Constants/countryConfig", () => ({
    useCountryConfig: jest.fn()
}));

jest.mock("Services/utils/dateFormatter", () => ({
    __esModule: true,
    default: jest.fn()
}));

jest.mock(
    "Components/shared/BannerNotificationAlerts/index",
    () =>
        function MockBannerNotificationAlerts(props: any): JSX.Element {
            return <div data-testid="banner-notification-alerts" {...props} />;
        }
);

describe("MaintenanceBanner", () => {
    const mockProps = {
        currentMarket: Alpha2.US
    };

    const mockMaintenanceBanner = {
        messageStartTime: "2023-05-01T10:00:00Z",
        messageDuration: 60
    };

    beforeEach(() => {
        (useFlags as jest.Mock).mockReturnValue({
            maintenanceBanner: mockMaintenanceBanner
        });
        (useCountryConfig as jest.Mock).mockReturnValue({
            dateFormat: "MM/dd/yyyy HH:mm"
        });
        (convertDateToCustomFormat as jest.Mock).mockReturnValue(
            "05/01/2023 10:00"
        );
    });

    it("renders BannerNotificationAlerts with correct props", () => {
        const { getByTestId } = render(<MaintenanceBanner {...mockProps} />);
        const banner = getByTestId("banner-notification-alerts");

        expect(banner).toHaveAttribute("currentMarket", Alpha2.US);
        expect(banner).toHaveAttribute("bannerFlagLD");
        const bannerFlagLD = banner.getAttribute("bannerFlagLD");
        expect(bannerFlagLD).toBe("[object Object]");
    });
});
