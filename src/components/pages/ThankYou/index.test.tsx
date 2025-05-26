import { render } from "@testing-library/react";
import ThankYou from "./index";

// Mock the necessary dependencies
jest.mock("Constants/countryConfig", () => ({
    useCountryConfig: (): {
        marketExceptions: { showOnboardingGuide: boolean };
    } => ({
        marketExceptions: { showOnboardingGuide: true }
    })
}));

jest.mock("cookies-next", () => ({
    deleteCookie: jest.fn()
}));

// Mock MixpanelService
jest.mock("../../../services/mixpanel/initializeMixPanel", () => ({
    __esModule: true,
    default: {
        trackPageView: jest.fn(),
        isInitialized: true,
        get_property: jest.fn(),
        initializeSuperProperties: jest.fn()
    }
}));

// Mock child components
jest.mock("./components/Aside", () => {
    function Aside(): JSX.Element {
        return <div data-testid="aside" />;
    }
    return Aside;
});

jest.mock("./components/Guide", () => {
    function Guide(): JSX.Element {
        return <div data-testid="guide" />;
    }
    return Guide;
});

jest.mock("./components/Summary", () => {
    function Summary(): JSX.Element {
        return <div data-testid="summary" />;
    }
    return Summary;
});

describe("ThankYou", () => {
    it("renders correctly", () => {
        const { container } = render(<ThankYou />);
        expect(container).toMatchSnapshot();
    });
});
