import { useRouter } from "next/router";
import { render } from "Shared/testUtils";
import RegisterPage from "./index";

// Mock external dependencies and hooks
jest.mock("Contexts/UserContext", () => ({
    useUser: (): { isLoggedIn: boolean; activeAccordionSection: number } => ({
        isLoggedIn: false,
        activeAccordionSection: 1
    })
}));
jest.mock(
    "Services/mixpanel/initializeMixPanel",
    (): {
        trackPageView: jest.Mock<() => void>;
    } => ({
        trackPageView: jest.fn()
    })
);
jest.mock("Constants/countryConfig", () => ({
    useCountryConfig: (): {
        isNoPurchaseMarket: boolean;
        marketExceptions: { hiddenShippingProvince: boolean };
    } => ({
        isNoPurchaseMarket: false,
        marketExceptions: { hiddenShippingProvince: false }
    })
}));
jest.mock("next/router", () => ({
    useRouter: jest.fn()
}));

// Mock custom hooks
jest.mock("./components/Catalog/hooks", () => ({
    __esModule: true,
    default: jest.fn()
}));
jest.mock("./hooks", () => ({
    useSectionsConfig: jest.fn(() => []),
    SectionFactory: jest.fn(() => null)
}));

describe("RegisterPage", () => {
    beforeEach(() => {
        // Setup router mock for each test
        (useRouter as jest.Mock).mockImplementation(() => ({
            replace: jest.fn(),
            prefetch: jest.fn(),
            pathname: "/register"
        }));
    });

    it("renders correctly", () => {
        const { container } = render(<RegisterPage />);
        expect(container).toMatchSnapshot();
    });
});
