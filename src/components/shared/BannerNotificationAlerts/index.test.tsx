import { Alpha2 } from "Constants/countryConfig/enums";
import { BasicBanner } from "Services/launchDarkly/types";
import { render } from "Shared/testUtils";
import BannerNotificationAlerts from "./index";

// Mock the useTranslate hook
jest.mock("Components/shared/Translate", () => ({
    useTranslate: (): ((key: string) => string) => (key: string) => key
}));

describe("BannerNotificationAlerts", () => {
    it("renders correctly", () => {
        const props = {
            currentMarket: Alpha2.US,
            rosettaAlterations: (message: string): string => message,
            bannerFlagLD: {
                markets: [Alpha2.US],
                rosettaTag: "test.message"
            } as BasicBanner
        };

        const { container } = render(<BannerNotificationAlerts {...props} />);
        expect(container).toMatchSnapshot();
    });
});
