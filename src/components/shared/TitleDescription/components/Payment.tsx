/** @jsxImportSource @emotion/react */
import T from "Components/shared/Translate";
import paymentOptions from "Constants/paymentOptions";
import { useOrder } from "Contexts/OrderContext";
import Image from "next/image";
import { useMemo } from "react";

export default function Payment(): JSX.Element | null {
    const { selectedPaymentMethod } = useOrder();

    const selectedPaymentOption = useMemo(
        () =>
            paymentOptions.find(
                paymentOption =>
                    paymentOption.transactionMethod === selectedPaymentMethod
            ),
        [selectedPaymentMethod]
    );

    if (!selectedPaymentOption) {
        return (
            <div className="description">
                <T>payment_select_payment_method</T>
            </div>
        );
    }

    return (
        <div className="description">
            <div className="icon">
                <Image
                    alt=""
                    height={18}
                    src={selectedPaymentOption.imageSrc}
                    width={24}
                    data-testid={`${selectedPaymentOption.testIdPrefix}_image`}
                />
            </div>
            <div
                className="text"
                data-testid={`${selectedPaymentOption.testIdPrefix}_label`}
            >
                <T>{selectedPaymentOption.optionLabel}</T>
            </div>
        </div>
    );
}
