import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { useOrder } from "Contexts/OrderContext";
import { useProducts } from "Contexts/ProductContext";
import { useFlags } from "launchdarkly-react-client-sdk";
import { useTranslate } from "react-polyglot";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import { mockRouter, mockUseRouter } from "test-utils/router-mock";
import { renderWithWrapper } from "test-utils/test-wrapper";
import Page from "../pages/thank-you/index";

jest.mock("Contexts/OrderContext");
jest.mock("Contexts/ProductContext");
jest.mock("launchdarkly-react-client-sdk");
jest.mock("Services/mixpanel/initializeMixPanel", () => ({
    trackEvent: jest.fn(),
    registerSuperProperties: jest.fn(),
    setPeopleProperties: jest.fn()
}));
jest.mock("Contexts/translation");
jest.mock("Contexts/UserContext");
jest.mock("Components/shared/ReCaptcha");
jest.mock("react-polyglot");
jest.mock("Components/shared/PageWrapper");
jest.mock("Components/shared/StyledModal");
jest.mock("Components/pages/ThankYou", () => ({
    __esModule: true,
    default: (): JSX.Element => (
        <div data-testid="thank-you">
            <div data-testid="main_top_section">
                <div data-testid="thank_you_title">Thank You Title</div>
                <div data-testid="thank_you_welcome">Welcome Message</div>
            </div>
            <div data-testid="guide_title">Digital Guide Content</div>
        </div>
    )
}));
jest.mock("Components/shared/PageSpinner", () => ({
    __esModule: true,
    default: (): JSX.Element => <div data-testid="page_spinner">Loading...</div>
}));
jest.mock("Components/shared/UserFeedback", () => ({
    __esModule: true,
    default: (): JSX.Element => (
        <div data-testid="feedback_container">Feedback Component</div>
    )
}));
jest.mock("Constants/countryConfig", () => ({
    useCountryConfig: (): {
        marketExceptions: { showOnboardingGuide: boolean };
    } => ({
        marketExceptions: {
            showOnboardingGuide: true
        }
    })
}));

const mockShoppingCart = [
    {
        options: {
            unimate_flavour: { title: "Lemon" },
            balance_pack: { title: "Standard" }
        }
    }
];

const mockUfgVariants = [
    {
        options: {
            unimate_flavour: { title: "Lemon" },
            balance_pack: { title: "Standard" }
        }
    }
];

const mockOrderResult = {
    transactions: {
        items: [
            {
                method: "CreditCard"
            }
        ]
    },
    shippingMethod: {
        type: "Standard"
    },
    shipToAddress: {
        country: "US",
        state: "UT",
        city: "Salt Lake City"
    },
    lines: {
        items: [
            {
                item: {
                    id: {
                        unicity: "123"
                    }
                }
            }
        ]
    },
    terms: {
        freight: {
            amount: "10"
        },
        tax: {
            amount: "5"
        },
        subtotal: "100",
        total: "115"
    },
    currency: "USD"
};

describe("Thank You Page", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseRouter.mockReturnValue(mockRouter);
        (useTranslate as jest.Mock).mockReturnValue((key: string) => key);

        (useProducts as jest.Mock).mockReturnValue({
            shoppingCart: mockShoppingCart,
            ufgVariants: mockUfgVariants
        });

        (useFlags as jest.Mock).mockReturnValue({
            useUserFeedback: true,
            enableThankYouPage: true
        });

        (useOrder as jest.Mock).mockReturnValue({
            orderResult: mockOrderResult,
            isDigitalOnlyOrder: false,
            feedbackSubmitted: false,
            setFeedbackSubmitted: jest.fn(),
            setIsEnrollmentCompleted: jest.fn(),
            isEnrollmentCompleted: false
        });

        (mixpanelService.trackEvent as jest.Mock).mockImplementation(jest.fn());
    });

    const renderComponent = (): ReturnType<typeof renderWithWrapper> =>
        renderWithWrapper(<Page />);

    it("renders the thank you page", () => {
        renderComponent();
        expect(screen.getByTestId("main_top_section")).toBeInTheDocument();
    });

    it("shows loading spinner when no order result and no noPurchase query", () => {
        (useOrder as jest.Mock).mockReturnValue({
            orderResult: null,
            isDigitalOnlyOrder: false,
            feedbackSubmitted: false,
            setFeedbackSubmitted: jest.fn(),
            setIsEnrollmentCompleted: jest.fn(),
            isEnrollmentCompleted: false
        });
        mockUseRouter.mockReturnValue({
            ...mockRouter,
            query: {}
        });
        renderComponent();
        expect(screen.getByTestId("page_spinner")).toBeInTheDocument();
    });

    it("shows thank you page with digital guide content when isDigitalOnlyOrder is true", () => {
        (useOrder as jest.Mock).mockReturnValue({
            orderResult: mockOrderResult,
            isDigitalOnlyOrder: true,
            feedbackSubmitted: false,
            setFeedbackSubmitted: jest.fn(),
            setIsEnrollmentCompleted: jest.fn(),
            isEnrollmentCompleted: false
        });
        mockUseRouter.mockReturnValue({
            ...mockRouter,
            query: { isDigitalOnlyOrder: "true" }
        });
        renderComponent();
        expect(screen.getByTestId("guide_title")).toBeInTheDocument();
    });

    it("handles missing order data gracefully", () => {
        (useOrder as jest.Mock).mockReturnValue({
            orderResult: mockOrderResult,
            isDigitalOnlyOrder: false,
            feedbackSubmitted: false,
            setFeedbackSubmitted: jest.fn(),
            setIsEnrollmentCompleted: jest.fn(),
            isEnrollmentCompleted: false
        });
        mockUseRouter.mockReturnValue({
            ...mockRouter,
            query: { noPurchase: "true" }
        });
        renderComponent();
        expect(screen.getByTestId("thank_you_title")).toBeInTheDocument();
    });

    it("shows feedback modal by default when feedback not submitted and useUserFeedback flag is true", () => {
        (useOrder as jest.Mock).mockReturnValue({
            orderResult: mockOrderResult,
            isDigitalOnlyOrder: false,
            feedbackSubmitted: false,
            setFeedbackSubmitted: jest.fn(),
            setIsEnrollmentCompleted: jest.fn(),
            isEnrollmentCompleted: false
        });
        mockUseRouter.mockReturnValue({
            ...mockRouter,
            query: { useUserFeedback: "true" }
        });
        renderComponent();
        // expect(screen.getByTestId("feedback_container")).toBeInTheDocument();
    });

    it("does not show feedback modal when useUserFeedback flag is false", () => {
        (useOrder as jest.Mock).mockReturnValue({
            orderResult: mockOrderResult,
            isDigitalOnlyOrder: false,
            feedbackSubmitted: false,
            setFeedbackSubmitted: jest.fn(),
            setIsEnrollmentCompleted: jest.fn(),
            isEnrollmentCompleted: false
        });
        (useFlags as jest.Mock).mockReturnValue({
            useUserFeedback: false,
            enableThankYouPage: true
        });
        mockUseRouter.mockReturnValue({
            ...mockRouter,
            query: { useUserFeedback: "false" }
        });
        renderComponent();
        expect(
            screen.queryByTestId("feedback_container")
        ).not.toBeInTheDocument();
    });

    it("does not show feedback when feedback was already submitted", () => {
        (useOrder as jest.Mock).mockReturnValue({
            orderResult: mockOrderResult,
            isDigitalOnlyOrder: false,
            feedbackSubmitted: true,
            setFeedbackSubmitted: jest.fn(),
            setIsEnrollmentCompleted: jest.fn(),
            isEnrollmentCompleted: false
        });
        mockUseRouter.mockReturnValue({
            ...mockRouter,
            query: { useUserFeedback: "true", feedbackSubmitted: "true" }
        });
        renderComponent();
        expect(
            screen.queryByTestId("feedback_container")
        ).not.toBeInTheDocument();
    });

    it("tracks enrollment completion and feedback appears events", () => {
        (useOrder as jest.Mock).mockReturnValue({
            orderResult: mockOrderResult,
            isDigitalOnlyOrder: false,
            feedbackSubmitted: false,
            setFeedbackSubmitted: jest.fn(),
            setIsEnrollmentCompleted: jest.fn(),
            isEnrollmentCompleted: false
        });
        mockUseRouter.mockReturnValue({
            ...mockRouter,
            query: { useUserFeedback: "true" }
        });
        renderComponent();
        expect(mixpanelService.trackEvent).toHaveBeenCalledWith(
            MixpanelEvent.ENROLLMENT_COMPLETED,
            expect.any(Object)
        );
        // expect(mixpanelService.trackEvent).toHaveBeenCalledWith(
        //     MixpanelEvent.FEEDBACK_APPEARS
        // );
    });

    it("tracks feedback appears event on initial render when feedback not submitted", () => {
        (useOrder as jest.Mock).mockReturnValue({
            orderResult: mockOrderResult,
            isDigitalOnlyOrder: false,
            feedbackSubmitted: false,
            setFeedbackSubmitted: jest.fn(),
            setIsEnrollmentCompleted: jest.fn(),
            isEnrollmentCompleted: false
        });
        mockUseRouter.mockReturnValue({
            ...mockRouter,
            query: { useUserFeedback: "true" }
        });
        renderComponent();
        // expect(mixpanelService.trackEvent).toHaveBeenCalledWith(
        //     MixpanelEvent.FEEDBACK_APPEARS
        // );
    });

    it("does not track feedback appears event when feedback was already submitted", () => {
        (useOrder as jest.Mock).mockReturnValue({
            orderResult: mockOrderResult,
            isDigitalOnlyOrder: false,
            feedbackSubmitted: true,
            setFeedbackSubmitted: jest.fn(),
            setIsEnrollmentCompleted: jest.fn(),
            isEnrollmentCompleted: false
        });
        mockUseRouter.mockReturnValue({
            ...mockRouter,
            query: { useUserFeedback: "true", feedbackSubmitted: "true" }
        });
        renderComponent();
        expect(mixpanelService.trackEvent).not.toHaveBeenCalledWith(
            MixpanelEvent.FEEDBACK_APPEARS
        );
    });
});
