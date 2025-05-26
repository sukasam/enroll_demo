import { Alpha2 } from "Constants/countryConfig/enums";
import { useOrder } from "Contexts/OrderContext";
import { useProducts } from "Contexts/ProductContext";
import { ShippingMethodQuoteType } from "Contexts/types/OrderContextTypes";
import calculateOrder from "Hydra/calculateOrder";
import getShipMethods from "Hydra/shipMethods";
import { useCallback, useMemo } from "react";
import { CustomerType } from "types/enums";

type UseFetchQoutesReturnType = {
    getShipping: (shippingData: {
        country: Alpha2;
        state: string;
        city: string;
        address1: string;
        address2?: string;
        zip: string;
    }) => Promise<void>;
};

export default function useFetchQoutes(): UseFetchQoutesReturnType {
    const { shoppingCart } = useProducts();
    const {
        setShippingMethodQuotes,
        setSelectedShippingMethod,
        isShipToOffice
    } = useOrder();
    const shoppingCartSkus = useMemo(
        () => shoppingCart.map(item => item?.sku),
        [shoppingCart]
    );

    const getShipping = useCallback(
        async (shippingData: {
            country: Alpha2;
            state?: string;
            city?: string;
            address1: string;
            address2?: string;
            zip: string;
        }) => {
            const { country, state, city, address1, address2, zip } =
                shippingData;

            if (!shoppingCartSkus.length || !country) {
                throw new Error(
                    "Invalid shipping data or empty shopping cart."
                );
            }

            setShippingMethodQuotes([]);
            setSelectedShippingMethod(null);
            const alpha2 = country;
            try {
                const methods = await getShipMethods({ alpha2, state });

                if (!methods) {
                    throw new Error("No shipping methods available.");
                }

                methods.items = methods.items.filter(method =>
                    isShipToOffice
                        ? method.type === "WillCall" &&
                          method.location !== "Nevada Office"
                        : method.type !== "WillCall"
                );

                const mappedMethodsNames = methods.items.map(method => ({
                    ...method,
                    shipping: "Loading"
                })) as ShippingMethodQuoteType[];
                setShippingMethodQuotes(mappedMethodsNames);

                const promises = methods.items.map(method => {
                    const country: Alpha2 =
                        alpha2 === Alpha2.PR ? Alpha2.US : alpha2;

                    return calculateOrder({
                        items: shoppingCartSkus,
                        shippingMethod: method,
                        shipToAddress: {
                            city,
                            country,
                            state,
                            address1,
                            address2,
                            zip
                        },
                        customerType: CustomerType.MEMBER
                    });
                });

                const results = await Promise.allSettled(promises);
                const mappedMethods = methods.items.reduce(
                    (acc, method, index) => {
                        const result = results[index];
                        if (result.status === "fulfilled") {
                            const calculatedMethod = result.value as {
                                subtotal: number;
                                shipping: number;
                                tax: number;
                                total: number;
                            };
                            acc.push({
                                ...method,
                                productPrice: "0",
                                subtotal: calculatedMethod.subtotal.toString(),
                                shipping: calculatedMethod.shipping.toString(),
                                tax: calculatedMethod.tax.toString(),
                                orderTotal: calculatedMethod.total.toString()
                            });
                        } else {
                            throw new Error(
                                `Failed to calculate order for method: ${method.type}`
                            );
                        }
                        return acc;
                    },
                    [] as Array<{ [key: string]: any }>
                );

                const filteredMethods =
                    mappedMethods.filter<ShippingMethodQuoteType>(
                        (value): value is ShippingMethodQuoteType =>
                            Boolean(value)
                    );

                setSelectedShippingMethod(filteredMethods[0] || null);
                setShippingMethodQuotes(filteredMethods);
            } catch (error) {
                console.error("Error fetching shipping methods:", error);
                throw error; // Re-throw the error to be handled by the caller
            }
        },
        [
            shoppingCartSkus,
            setShippingMethodQuotes,
            setSelectedShippingMethod,
            isShipToOffice
        ]
    );

    return { getShipping };
}
