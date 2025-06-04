/** @jsxImportSource @emotion/react */
import PaymentMethodDetails from "Components/pages/Register/components/Payment/components/PaymentMethodDetails";
import PaymentMethodOptions from "Components/pages/Register/components/Payment/components/PaymentMethodOptions";
import ShippingMethodOptions from "Components/pages/Register/components/Payment/components/ShippingMethod";
import { useCountryConfig } from "Constants/countryConfig";
import { PaymentOptions } from "Constants/countryConfig/types";
import paymentOptions from "Constants/paymentOptions";
import { useOrder } from "Contexts/OrderContext";
import { useEffect, useMemo } from "react";
import styles from "./styles";

function PaymentSection(): JSX.Element {
    const { selectedPaymentMethod, setSelectedPaymentMethod } = useOrder();
    const config = useCountryConfig();

    const availablePaymentOptions = useMemo(
        () =>
            paymentOptions
                .map(option => {
                    const methodKey = `has${
                        option.transactionMethod.charAt(0).toUpperCase() +
                        option.transactionMethod.slice(1)
                    }` as keyof PaymentOptions;
                    return config?.marketExceptions?.paymentOptions?.[methodKey]
                        ? option
                        : null;
                })
                .filter(
                    (option): option is NonNullable<typeof option> =>
                        option !== null
                ),
        [config]
    );

    useEffect(() => {
        if (!selectedPaymentMethod && availablePaymentOptions.length > 0) {
            setSelectedPaymentMethod(
                availablePaymentOptions[0].transactionMethod
            );
        }
    }, [
        availablePaymentOptions,
        selectedPaymentMethod,
        setSelectedPaymentMethod
    ]);

    const filteredOptions = useMemo(
        () =>
            availablePaymentOptions.filter(
                option => option.transactionMethod !== selectedPaymentMethod
            ),
        [availablePaymentOptions, selectedPaymentMethod]
    );

    return (
        <div css={styles}>
            <div className="paymentSection">
                <PaymentMethodDetails
                    selectedPaymentMethod={selectedPaymentMethod}
                />
                <PaymentMethodOptions
                    onSelectMethod={setSelectedPaymentMethod}
                    paymentOptions={filteredOptions}
                />
            </div>
            <ShippingMethodOptions />
        </div>
    );
}

export default PaymentSection;
