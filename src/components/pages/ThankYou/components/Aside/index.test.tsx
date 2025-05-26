import { render, screen } from "@testing-library/react";
import { useCountryConfig } from "Constants/countryConfig";
import Aside from "./index";

jest.mock("Components/shared/Translate");

jest.mock("Constants/countryConfig");

jest.mock("next/image", () => ({
    __esModule: true,
    default: (props: any): JSX.Element => <img {...props} alt="" />
}));

describe("Aside", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders office section", () => {
        render(<Aside />);
        expect(screen.getByTestId("office_image")).toBeInTheDocument();
        expect(screen.getByTestId("office_title")).toBeInTheDocument();
        expect(screen.getByTestId("office_description")).toBeInTheDocument();
        expect(screen.getByTestId("office_button")).toBeInTheDocument();
    });

    it("renders onboarding guide when showOnboardingGuide is true", () => {
        render(<Aside />);
        expect(screen.getByTestId("guide_image_mobile")).toBeInTheDocument();
        expect(screen.getByTestId("guide_title")).toBeInTheDocument();
        expect(screen.getByTestId("guide_description")).toBeInTheDocument();
        expect(screen.getByTestId("guide_button_mobile")).toBeInTheDocument();
    });

    it("does not render onboarding guide when showOnboardingGuide is false", () => {
        (useCountryConfig as jest.Mock).mockReturnValueOnce({
            marketExceptions: {
                showOnboardingGuide: false
            }
        });

        render(<Aside />);
        expect(
            screen.queryByTestId("guide_image_mobile")
        ).not.toBeInTheDocument();
    });

    it("renders contact section", () => {
        render(<Aside />);
        expect(screen.getByTestId("contact_title")).toBeInTheDocument();
        expect(screen.getByTestId("contact_phone_image")).toBeInTheDocument();
        expect(screen.getByTestId("contact_phone_value")).toBeInTheDocument();
        expect(screen.getByTestId("contact_email_image")).toBeInTheDocument();
        expect(screen.getByTestId("contact_email_value")).toBeInTheDocument();
    });

    it("hides Unicity phone when hideUnicityPhone is true", () => {
        (useCountryConfig as jest.Mock).mockReturnValueOnce({
            marketExceptions: {
                hideUnicityPhone: true
            }
        });
        render(<Aside />);
        expect(
            screen.queryByTestId("contact_phone_image")
        ).not.toBeInTheDocument();
        expect(
            screen.queryByTestId("contact_phone_value")
        ).not.toBeInTheDocument();
    });

    it("uses custom thankYouImage when provided", () => {
        render(<Aside />);
        const guideImage = screen.getByTestId("guide_image_mobile");
        expect(guideImage).toHaveAttribute("src", "/img/custom-image.jpg");
    });

    it("uses default image when thankYouImage is not provided", () => {
        (useCountryConfig as jest.Mock).mockReturnValueOnce({
            marketExceptions: {
                showOnboardingGuide: true,
                hideUnicityPhone: false,
                thankYouImage: null
            }
        });

        render(<Aside />);
        const guideImage = screen.getByTestId("guide_image_mobile");
        expect(guideImage).toHaveAttribute("src", "/img/feel-great-guide.jpg");
    });
});
