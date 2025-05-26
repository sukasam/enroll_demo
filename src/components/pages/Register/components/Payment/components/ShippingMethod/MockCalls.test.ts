import { Alpha2 } from "Constants/countryConfig/enums";
import {
    mappedShippingMethodsMock,
    quotes2DaysResponce,
    quotesEconomyResponce,
    quotesWillCallResponce,
    shippingMethodsResponce,
    shipToAddressCaMock,
    shipToAddressUsMock
} from "./MockCalls";

describe("MockCalls", () => {
    describe("shippingMethodsResponce", () => {
        it("should have the correct structure", () => {
            expect(shippingMethodsResponce).toHaveProperty("items");
            expect(Array.isArray(shippingMethodsResponce.items)).toBeTruthy();
            expect(shippingMethodsResponce.items).toHaveLength(3);
        });

        it("should have the correct shipping methods", () => {
            const methods = shippingMethodsResponce.items.map(
                item => item.type
            );
            expect(methods).toEqual(["Economy", "WillCall", "2Days"]);
        });
    });

    describe("quotesEconomyResponce", () => {
        it("should have the correct structure", () => {
            expect(quotesEconomyResponce).toHaveProperty("items");
            expect(Array.isArray(quotesEconomyResponce.items)).toBeTruthy();
            expect(quotesEconomyResponce.items).toHaveLength(1);
        });

        it("should have the correct shipping method", () => {
            expect(quotesEconomyResponce.items[0].shippingMethod.type).toBe(
                "Economy"
            );
        });

        it("should have the correct number of line items", () => {
            expect(quotesEconomyResponce.items[0].lines.items).toHaveLength(2);
        });
    });

    describe("quotes2DaysResponce", () => {
        it("should have the correct structure", () => {
            expect(quotes2DaysResponce).toHaveProperty("items");
            expect(Array.isArray(quotes2DaysResponce.items)).toBeTruthy();
            expect(quotes2DaysResponce.items).toHaveLength(1);
        });

        it("should have the correct shipping method", () => {
            expect(quotes2DaysResponce.items[0].shippingMethod.type).toBe(
                "2Days"
            );
        });

        it("should have the correct number of line items", () => {
            expect(quotes2DaysResponce.items[0].lines.items).toHaveLength(2);
        });
    });

    describe("quotesWillCallResponce", () => {
        it("should have the correct error structure", () => {
            expect(quotesWillCallResponce).toHaveProperty("error");
            expect(quotesWillCallResponce.error).toHaveProperty("code", 400);
            expect(quotesWillCallResponce.error).toHaveProperty(
                "message",
                "Bad Request"
            );
            expect(quotesWillCallResponce.error).toHaveProperty(
                "error_code",
                "4009"
            );
            expect(quotesWillCallResponce.error).toHaveProperty(
                "error_message"
            );
        });
    });

    describe("shipToAddressUsMock", () => {
        it("should have the correct structure", () => {
            expect(shipToAddressUsMock).toEqual({
                name: "First Last",
                country: Alpha2.US,
                state: "AZ",
                city: "Phoenix",
                zip: "85016-2821",
                address1: "16 Biltmore Est",
                address2: ""
            });
        });
    });

    describe("shipToAddressCaMock", () => {
        it("should have the correct structure", () => {
            expect(shipToAddressCaMock).toEqual({
                country: Alpha2.CA,
                state: "",
                city: "Bayfield",
                zip: "NB E4M 6N4",
                address1: "592 Railroad St.",
                address2: ""
            });
        });
    });

    describe("mappedShippingMethodsMock", () => {
        it("should have the correct structure", () => {
            expect(mappedShippingMethodsMock).toEqual({
                market: Alpha2.US,
                type: "Economy",
                location: "Mocked Location",
                productPrice: "11",
                shipping: "22",
                subtotal: "33",
                tax: "44",
                orderTotal: "55"
            });
        });
    });
});
