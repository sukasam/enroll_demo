import "@testing-library/jest-dom";
import useAvailableLanguages from "Components/pages/Home/components/HomeContent/Form/hooks";
import { useTranslations } from "Contexts/translation";
import { useRouter } from "next/router";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import { fireEvent, render, screen, within } from "Shared/testUtils";
import LanguageSelect from "./index";

// Mock the dependencies
jest.mock("next/router", () => ({
    useRouter: jest.fn()
}));

jest.mock("Contexts/translation", () => ({
    useTranslations: jest.fn()
}));

jest.mock("Components/pages/Home/components/HomeContent/Form/hooks", () => ({
    __esModule: true,
    default: jest.fn()
}));

jest.mock("Services/mixpanel/initializeMixPanel", () => ({
    registerSuperProperties: jest.fn(),
    trackEvent: jest.fn()
}));

describe("LanguageSelect", () => {
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ pathname: "/login" });
        (useTranslations as jest.Mock).mockReturnValue({
            language: "en",
            setLanguage: jest.fn(),
            country: "US",
            fetchTranslations: jest.fn()
        });
        (useAvailableLanguages as jest.Mock).mockReturnValue([
            { label: "English", value: "en", defaultCountry: "US" },
            { label: "Spanish", value: "es", defaultCountry: "US" }
        ]);
    });

    it("renders on login, register, and thank-you pages", () => {
        const { rerender } = render(<LanguageSelect />);
        expect(screen.getByRole("combobox")).toBeInTheDocument();

        (useRouter as jest.Mock).mockReturnValue({ pathname: "/register" });
        rerender(<LanguageSelect />);
        expect(screen.getByRole("combobox")).toBeInTheDocument();

        (useRouter as jest.Mock).mockReturnValue({ pathname: "/thank-you" });
        rerender(<LanguageSelect />);
        expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("does not render on other pages", () => {
        (useRouter as jest.Mock).mockReturnValue({ pathname: "/home" });
        const { container } = render(<LanguageSelect />);
        expect(container.firstChild).toBeNull();
    });

    it("displays available languages", () => {
        (useRouter as jest.Mock).mockReturnValue({ pathname: "/register" });
        render(<LanguageSelect />);
        const selectElement = screen.getByRole("combobox");
        fireEvent.mouseDown(selectElement);

        // Use `within` to search for options within the opened dropdown
        const listbox = screen.getByRole("listbox");
        expect(within(listbox).getByText("English")).toBeInTheDocument();
        expect(within(listbox).getByText("Spanish")).toBeInTheDocument();
    });

    it("displays available languages on Login", () => {
        (useRouter as jest.Mock).mockReturnValue({ pathname: "/login" });
        (useAvailableLanguages as jest.Mock).mockReturnValue([
            { label: "English", value: "en", defaultCountry: "US" },
            { label: "Spanish", value: "es", defaultCountry: "US" },
            { label: "French", value: "fr", defaultCountry: "CA" }
        ]);

        render(<LanguageSelect />);
        const selectElement = screen.getByRole("combobox");
        fireEvent.mouseDown(selectElement);

        // Use `within` to search for options within the opened dropdown
        const listbox = screen.getByRole("listbox");
        expect(within(listbox).getByText("English")).toBeInTheDocument();
        expect(within(listbox).getByText("Spanish")).toBeInTheDocument();
        expect(within(listbox).getByText("French")).toBeInTheDocument();
    });

    it("calls setLanguage and fetchTranslations when language is changed", () => {
        const { setLanguage, fetchTranslations } = useTranslations() as any;
        render(<LanguageSelect />);
        const selectElement = screen.getByRole("combobox");
        fireEvent.mouseDown(selectElement);

        const listbox = screen.getByRole("listbox");
        fireEvent.click(within(listbox).getByText("Spanish"));

        expect(setLanguage).toHaveBeenCalledWith("es");
        expect(fetchTranslations).toHaveBeenCalledWith("US", "es");
    });

    it("tracks language change event in mixpanel", () => {
        render(<LanguageSelect />);
        const selectElement = screen.getByRole("combobox");
        fireEvent.mouseDown(selectElement);

        const listbox = screen.getByRole("listbox");
        fireEvent.click(within(listbox).getByText("Spanish"));

        expect(mixpanelService.registerSuperProperties).toHaveBeenCalledWith({
            user_language: "es"
        });
        expect(mixpanelService.trackEvent).toHaveBeenCalledWith(
            "enr_user_language_changed",
            expect.objectContaining({
                previous_user_language: "en",
                user_language: "es"
            })
        );
    });

    it("matches snapshot", () => {
        const { container } = render(<LanguageSelect />);
        expect(container.firstChild).toMatchSnapshot();
    });
});
