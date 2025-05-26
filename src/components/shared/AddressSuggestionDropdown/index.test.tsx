import { render } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import AddressSuggestionDropdown from "./index";

// Mock the dependencies
jest.mock("Services/addressSuggestions", () => ({
    getAddressById: jest.fn()
}));

jest.mock("Services/locale", () => ({
    toAlpha2: jest.fn()
}));

jest.mock("./hook", () => jest.fn());

function MockFormProvider({
    children
}: {
    children: React.ReactNode;
}): JSX.Element {
    const methods = useForm();
    return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("AddressSuggestionDropdown", () => {
    const mockProps = {
        suggestedAddresses: [
            {
                address1: "123 Main St",
                address2: "",
                city: "Anytown",
                state: "ST",
                zip: "12345",
                country: "US"
            },
            {
                address1: "456 Elm St",
                address2: "",
                city: "Othertown",
                state: "OT",
                zip: "67890",
                country: "US"
            }
        ],
        selectedCountry: "US",
        setSuggestedAddresses: jest.fn(),
        setHintsOpen: jest.fn(),
        hintsOpen: true,
        anchorEl: null,
        setLastAddressDebounce: jest.fn()
    };

    it("renders correctly", () => {
        const { asFragment } = render(
            <MockFormProvider>
                <AddressSuggestionDropdown {...mockProps} />
            </MockFormProvider>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders correctly when closed", () => {
        const { asFragment } = render(
            <MockFormProvider>
                <AddressSuggestionDropdown {...mockProps} hintsOpen={false} />
            </MockFormProvider>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders correctly with address IDs", () => {
        const propsWithAddressIds = {
            ...mockProps,
            suggestedAddresses: [
                {
                    addressId: "1",
                    address1: "123 Main St",
                    address2: "",
                    city: "Anytown",
                    state: "ST",
                    zip: "12345",
                    country: "US"
                },
                {
                    addressId: "2",
                    address1: "456 Elm St",
                    address2: "",
                    city: "Othertown",
                    state: "OT",
                    zip: "67890",
                    country: "US"
                }
            ]
        };
        const { asFragment } = render(
            <MockFormProvider>
                <AddressSuggestionDropdown {...propsWithAddressIds} />
            </MockFormProvider>
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
