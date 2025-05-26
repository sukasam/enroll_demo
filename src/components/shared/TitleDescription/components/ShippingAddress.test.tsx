import { render, screen } from "@testing-library/react";
import { useCountryConfig } from "Constants/countryConfig";
import { useOrder } from "Contexts/OrderContext";
import { useUser } from "Contexts/UserContext";
import ShippingAddress from "./ShippingAddress";

// Mock the hooks
jest.mock("Constants/countryConfig");
jest.mock("Contexts/OrderContext");
jest.mock("Contexts/UserContext");

const mockAddress = {
    address1: "123 Main St",
    address2: "Apt 4B",
    city: "Springfield",
    state: "IL",
    zip: "62701",
    country: "US"
};

describe("ShippingAddress", () => {
    beforeEach(() => {
        (useCountryConfig as jest.Mock).mockReset();
        (useOrder as jest.Mock).mockReset();
        (useUser as jest.Mock).mockReset();
    });

    it("uses default format when no country format is provided", () => {
        (useCountryConfig as jest.Mock).mockReturnValue({});
        (useOrder as jest.Mock).mockReturnValue({ shipToAddress: mockAddress });
        (useUser as jest.Mock).mockReturnValue({ mainAddress: null });

        render(<ShippingAddress />);
        expect(
            screen.getByText("123 Main St, Apt 4B, Springfield, IL, 62701, US")
        ).toBeInTheDocument();
    });

    it("uses Japanese address format", () => {
        (useCountryConfig as jest.Mock).mockReturnValue({
            addressFormat: "{zip}, {country}, {address1}, {address2}"
        });
        (useOrder as jest.Mock).mockReturnValue({
            shipToAddress: {
                ...mockAddress,
                country: "JP",
                state: "",
                city: ""
            }
        });
        (useUser as jest.Mock).mockReturnValue({ mainAddress: null });

        render(<ShippingAddress />);
        expect(
            screen.getByText("62701, JP, 123 Main St, Apt 4B")
        ).toBeInTheDocument();
    });

    it("handles address without state", () => {
        (useCountryConfig as jest.Mock).mockReturnValue({});
        (useOrder as jest.Mock).mockReturnValue({
            shipToAddress: {
                ...mockAddress,
                state: null,
                country: "GB"
            }
        });
        (useUser as jest.Mock).mockReturnValue({ mainAddress: null });

        render(<ShippingAddress />);
        expect(
            screen.getByText("123 Main St, Apt 4B, Springfield, 62701, GB")
        ).toBeInTheDocument();
    });

    it("uses mainAddress for no-purchase market", () => {
        (useCountryConfig as jest.Mock).mockReturnValue({
            isNoPurchaseMarket: true
        });
        (useOrder as jest.Mock).mockReturnValue({ shipToAddress: null });
        (useUser as jest.Mock).mockReturnValue({
            mainAddress: {
                ...mockAddress,
                country: "IN",
                state: "Osaka"
            }
        });

        render(<ShippingAddress />);
        expect(
            screen.getByText(
                "123 Main St, Apt 4B, Springfield, Osaka, 62701, IN"
            )
        ).toBeInTheDocument();
    });
});
