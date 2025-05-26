/** @jsxImportSource @emotion/react */
import AddressForm from "Components/shared/AddressForm";
import StyledCheckbox from "Components/shared/StyledCheckbox";
import { useTranslate } from "Components/shared/Translate";
import { useState } from "react";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import AddressSummary from "../AddressSummary";
import styles from "./styles";

export default function BillingForm(): JSX.Element {
    const translate = useTranslate();
    const [isSameBillingAddress, setIsSameBillingAddress] =
        useState<boolean>(true);

    const handleCheckboxChange = (): void => {
        setIsSameBillingAddress(!isSameBillingAddress);
    };

    return (
        <div css={styles}>
            <div
                className={`checkbox-container ${
                    !isSameBillingAddress ? "checkbox-container-active" : ""
                }`}
            >
                <StyledCheckbox
                    checked={isSameBillingAddress}
                    onChange={handleCheckboxChange}
                />
                <span className="billing-address-same-as-shipping">
                    {translate("payment_billin_address_same_as_shipping")}
                </span>
                {isSameBillingAddress ? (
                    <AddressSummary />
                ) : (
                    <AddressForm
                        title={translate("payment_billing_address")}
                        showSubmitButton={false}
                        formType="billing"
                    />
                )}
            </div>
        </div>
    );
}
