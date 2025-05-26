import { useCountryConfig } from "Constants/countryConfig";
import { useOrder } from "Contexts/OrderContext";
import { useProducts } from "Contexts/ProductContext";
import { useUser } from "Contexts/UserContext";
import { useTranslations } from "Contexts/translation";
import { useEffect, useMemo, useState } from "react";

export default function useUserDataMapper(): any {
    const {
        userSignature,
        shipToAddress,
        billingAddress,
        selectedShippingMethod,
        selectedPaymentMethod,
        payPal,
        cashPayment,
        bankWire,
        paymentMethod
    } = useOrder();
    const { shoppingCart } = useProducts();
    const { country } = useTranslations();
    const { userData, userLocale } = useUser();
    const countryConfig = useCountryConfig();

    const [orderData, setOrderData] = useState<any>(null);
    const billingName = useMemo(() => {
        if (billingAddress?.name) {
            const [firstName, ...lastNameParts] = billingAddress.name
                .trim()
                .split(" ");
            return { firstName, lastName: lastNameParts.join(" ") };
        }

        return {
            firstName: userData?.firstName || "",
            lastName: userData?.lastName || ""
        };
    }, [billingAddress, userData]);

    useEffect(() => {
        const cartItems = shoppingCart.map(item => ({
            sku: item.sku,
            qty: 1
        }));

        const address1 = shipToAddress?.address1 || "";
        const address2 = shipToAddress?.address2 || "";
        let city = shipToAddress?.city || "";
        let state = shipToAddress?.state || "";
        const zip = shipToAddress?.zip || "";

        if (shipToAddress?.country === "JP") {
            city = "";
            state = "";
        }

        const data = {
            customer: {
                signature: { value: userSignature || "" },
                status: "Active",
                type: "Associate"
            },
            cartItems,
            payment: {
                firstName: billingName.firstName,
                lastName: billingName.lastName,
                email: userData?.email,
                phone: userData?.phoneNumber,
                address1: billingAddress?.address1 || shipToAddress?.address1,
                address2: billingAddress?.address2 || shipToAddress?.address2,
                city: billingAddress?.city || shipToAddress?.city,
                state: billingAddress?.state || shipToAddress?.state,
                zip: billingAddress?.zip || shipToAddress?.zip,
                country:
                    shipToAddress?.country === "PR"
                        ? "US"
                        : shipToAddress?.country || "",
                method: selectedPaymentMethod,
                ...paymentMethod,
                ...(countryConfig?.marketExceptions.directWorldPay && {
                    bankName: "WorldPay"
                })
            },
            shipToAddress: {
                city,
                country:
                    shipToAddress?.country === "PR"
                        ? "US"
                        : shipToAddress?.country || "",
                state,
                address1,
                address2,
                zip
            },
            shipToName: {
                firstName: shipToAddress?.name,
                lastName: ""
            },
            shipToPhone: userData?.phoneNumber,
            shipToEmail: userData?.email,
            shipMethod: selectedShippingMethod,
            signature: userSignature,
            sourceMarket: country,
            locale: userLocale,
            paypal: payPal || null,
            cashPayment: cashPayment || null,
            bankWire: bankWire || null
        };

        setOrderData(data);
    }, [
        userSignature,
        shipToAddress,
        billingAddress,
        selectedShippingMethod,
        selectedPaymentMethod,
        payPal,
        cashPayment,
        bankWire,
        paymentMethod,
        shoppingCart,
        country,
        userData,
        userLocale,
        billingName
    ]);

    return orderData;
}
