import { fireEvent, render, screen } from "@testing-library/react";
import { Alpha2 } from "Constants/countryConfig/enums.js";
import { Customer } from "Hydra/getRefID";
import { useRouter } from "next/router";
import { act } from "react-dom/test-utils";
import Form from "../index";

jest.mock(
    "Components/shared/Form/components/TextField",
    () =>
        function MockTextField({
            name,
            label
        }: {
            name: string;
            label: string;
        }): JSX.Element {
            return <input data-testid={name} placeholder={label} />;
        }
);
jest.mock("Services/mixpanel/initializeMixPanel");
jest.mock(
    "Components/shared/PrimaryButton",
    () =>
        function MockPrimaryButton({
            children,
            ...props
        }: React.PropsWithChildren<any>): JSX.Element {
            return (
                <button {...props} type="button">
                    {children}
                </button>
            );
        }
);
jest.mock(
    "Components/shared/SelectDropdown",
    () =>
        function MockSelectDropdown({
            name,
            label,
            options
        }: {
            name: string;
            label: string;
            options: Array<{ label: string; value: string }>;
        }): JSX.Element {
            return (
                <select data-testid={name}>
                    <option value="">{label}</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }
);
jest.mock(
    "Components/shared/StyledCheckbox",
    () =>
        function MockStyledCheckbox({
            id,
            name,
            onChange
        }: {
            id: string;
            name: string;
            onChange: () => void;
        }): JSX.Element {
            return (
                <input
                    type="checkbox"
                    id={id}
                    name={name}
                    onChange={onChange}
                />
            );
        }
);
jest.mock(
    "Components/shared/Spinner",
    () =>
        function MockSpinner(): JSX.Element {
            return <div data-testid="spinner">Loading...</div>;
        }
);
jest.mock("Components/shared/Translate", () => ({
    useTranslate: (): ((key: string) => string) => (key: string) => key
}));
jest.mock("Contexts/UserContext", () => ({
    useUser: (): {
        setEnrollerId: jest.Mock;
        setEnrollerFullName: jest.Mock;
        setSponsorId: jest.Mock;
        setSponsorFullName: jest.Mock;
        enrollerId: string;
        sponsorFullName: string;
        enrollerFullName: string;
        isUserContextLoading: boolean;
    } => ({
        setEnrollerId: jest.fn(),
        setEnrollerFullName: jest.fn(),
        setSponsorId: jest.fn(),
        setSponsorFullName: jest.fn(),
        enrollerId: "",
        sponsorFullName: "",
        enrollerFullName: "",
        isUserContextLoading: false
    })
}));
jest.mock("Contexts/translation", () => ({
    useTranslations: (): {
        country: Alpha2;
        language: string;
        setCountry: jest.Mock;
        setLanguage: jest.Mock;
        fetchTranslations: jest.Mock;
    } => ({
        country: "US" as Alpha2,
        language: "en",
        setCountry: jest.fn(),
        setLanguage: jest.fn(),
        fetchTranslations: jest.fn()
    })
}));
jest.mock("next/router", () => ({
    useRouter: jest.fn()
}));
jest.mock("cookies-next", () => ({
    getCookie: jest.fn(),
    setCookie: jest.fn()
}));
jest.mock("./hooks", () => ({
    __esModule: true,
    default: (): {
        label: string;
        value: string;
    }[] => [{ label: "English", value: "en" }],
    checkRefID: jest.fn().mockResolvedValue("valid"),
    checkSponsor: jest.fn().mockResolvedValue("valid"),
    useDebounce: (value: any): any => value
}));

describe("Form", () => {
    beforeEach(() => {
        (useRouter as jest.Mock).mockImplementation(() => ({
            events: {
                on: jest.fn(),
                off: jest.fn()
            },
            query: {},
            push: jest.fn()
        }));
    });

    const defaultProps: { refId: string; referrer: Customer } = {
        refId: "",
        referrer: {} as Customer
    };

    it("renders correctly", () => {
        const { asFragment } = render(<Form {...defaultProps} />);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders country and language dropdowns", () => {
        render(<Form {...defaultProps} />);
        expect(screen.getByTestId("country")).toBeInTheDocument();
        expect(screen.getByTestId("language")).toBeInTheDocument();
    });

    it("renders enroller ID field", () => {
        render(<Form {...defaultProps} />);
        expect(screen.getByTestId("enrollerId")).toBeInTheDocument();
    });

    it("renders sponsor checkbox", () => {
        render(<Form {...defaultProps} />);
        expect(
            screen.getByLabelText("home_sponsor_different_enroller")
        ).toBeInTheDocument();
    });

    it("shows sponsor ID field when checkbox is checked", async () => {
        render(<Form {...defaultProps} />);
        const checkbox = screen.getByLabelText(
            "home_sponsor_different_enroller"
        );

        await act(async () => {
            fireEvent.click(checkbox);
        });

        expect(screen.getByTestId("sponsorId")).toBeInTheDocument();
    });
});
