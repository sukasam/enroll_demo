import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useTranslate } from "react-polyglot";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import { mockRouter, mockUseRouter } from "test-utils/router-mock";
import { TestWrapper } from "test-utils/test-wrapper";
import CreateAccountForm from "./index";
// import { useUser } from "Contexts/UserContext";

// Setup mocks before tests
jest.mock("Services/mixpanel/initializeMixPanel", () => ({
    trackEvent: jest.fn(),
    registerSuperProperties: jest.fn(),
    setPeopleProperties: jest.fn()
}));
jest.mock("Contexts/translation");
jest.mock("Contexts/UserContext");
jest.mock("Components/shared/ReCaptcha");
jest.mock("react-polyglot");
jest.mock("Constants/countryConfig", () => ({
    useCountryConfig: (): {
        marketExceptions: {
            notificationType: string;
            showMemberApplicationGuide: boolean;
        };
    } => ({
        marketExceptions: {
            notificationType: "EMAIL",
            showMemberApplicationGuide: false
        }
    })
}));

const mockSetIsLoading = jest.fn();

describe("CreateAccountForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseRouter.mockReturnValue(mockRouter);
        (useTranslate as jest.Mock).mockReturnValue((key: string) => key);
    });

    const renderComponent = (): ReturnType<typeof render> =>
        render(
            <TestWrapper>
                <CreateAccountForm
                    setIsLoading={mockSetIsLoading}
                    isLoading={false}
                />
            </TestWrapper>
        );

    it("renders the form correctly", () => {
        renderComponent();
        expect(
            screen.getByTestId("create_account_first_name")
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("create_account_last_name")
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("create_account_phone_number")
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("create_account_email_address")
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("create_account_password")
        ).toBeInTheDocument();
    });

    describe("Registration Started Event Tracking", () => {
        it("should trigger mixpanel event when form values change for the first time", () => {
            renderComponent();
            const firstNameInput = screen.getByLabelText(
                "create_account_first_name"
            );
            fireEvent.change(firstNameInput, { target: { value: "John" } });
            expect(mixpanelService.trackEvent).toHaveBeenCalledWith(
                MixpanelEvent.REGISTRATION_STARTED
            );
        });

        it("should only trigger mixpanel event once even with multiple value changes", () => {
            renderComponent();
            const firstNameInput = screen.getByLabelText(
                "create_account_first_name"
            );
            const lastNameInput = screen.getByLabelText(
                "create_account_last_name"
            );
            fireEvent.change(firstNameInput, { target: { value: "John" } });
            fireEvent.change(lastNameInput, { target: { value: "Doe" } });
            expect(mixpanelService.trackEvent).toHaveBeenCalledTimes(1);
            expect(mixpanelService.trackEvent).toHaveBeenCalledWith(
                MixpanelEvent.REGISTRATION_STARTED
            );
        });

        it("should not trigger mixpanel event if no form values are changed", () => {
            renderComponent();
            expect(mixpanelService.trackEvent).not.toHaveBeenCalled();
        });
    });

    describe("Form Validation Error Tracking", () => {
        it("should track validation errors when form is submitted with empty fields", async () => {
            renderComponent();
            const form = screen.getByTestId("create-account-form");
            expect(form).toBeInTheDocument();

            // Submit the form with empty fields
            await act(async () => {
                fireEvent.submit(form);
            });

            expect(mixpanelService.trackEvent).toHaveBeenCalledWith(
                MixpanelEvent.REGISTRATION_VALIDATION_ERROR_AFTER_CLICK,
                {
                    error_name: [
                        "first_name",
                        "last_name",
                        "full_name",
                        "full_name_en",
                        "phone_number",
                        "email",
                        "password",
                        "TandC",
                        "online_registration",
                        "member_application_guide"
                    ]
                }
            );
        });
    });
});
