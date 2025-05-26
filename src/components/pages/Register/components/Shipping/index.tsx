/** @jsxImportSource @emotion/react */
import AddressForm from "Components/shared/AddressForm";
import AddressFormJP from "Components/shared/AddressFormJP";
import { useTranslate } from "Components/shared/Translate";
import { useCountryConfig } from "Constants/countryConfig";
import { useOrder } from "Contexts/OrderContext";
import { useMemo, useState } from "react";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import ShipToOfficeComponent from "./components/ShipToOfficeComponent";
import styles from "./styles";

function ShippingSection(): JSX.Element {
    const { isShipToOffice, setIsShipToOffice } = useOrder();
    const countryConfig = useCountryConfig();
    const willCallAddress = countryConfig?.marketExceptions?.willCallAddresses;
    const translate = useTranslate();
    const [selectedState, setSelectedState] = useState("");

    const submitButton = (
        <button
            type="submit"
            className="continue-button"
            data-testid="button_continue"
            onClick={(): void => {
                mixpanelService.trackEvent(MixpanelEvent.SHIPPING_DATA_ADDED);
            }}
        >
            {translate("button_continue")}
        </button>
    );

    const shouldShowShipToOfficeComponent = useMemo(
        () =>
            willCallAddress ||
            (countryConfig?.alpha2 === "US" && selectedState === "PR"),
        [willCallAddress, countryConfig?.alpha2, selectedState]
    );

    return (
        <div css={styles}>
            {shouldShowShipToOfficeComponent ? (
                <ShipToOfficeComponent
                    onChange={(): void => {
                        setIsShipToOffice(prevState => !prevState);
                    }}
                />
            ) : null}

            {(shouldShowShipToOfficeComponent && isShipToOffice) ||
            countryConfig?.isNoPurchaseMarket ? (
                <div>
                    {countryConfig?.alpha2 === "JP" ? (
                        <AddressFormJP
                            title={translate("shipping_account_address")}
                            submitButton={submitButton}
                            countryDisabled
                            setSelectedState={setSelectedState}
                            formType="account"
                        />
                    ) : (
                        <AddressForm
                            title={translate("shipping_account_address")}
                            submitButton={submitButton}
                            countryDisabled
                            setSelectedState={setSelectedState}
                            formType="account"
                        />
                    )}
                </div>
            ) : (
                <div>
                    {countryConfig?.alpha2 === "JP" ? (
                        <AddressFormJP
                            title={translate("shipping_ship_to_address")}
                            submitButton={submitButton}
                            countryDisabled
                            setSelectedState={setSelectedState}
                            formType="shipping"
                        />
                    ) : (
                        <AddressForm
                            title={translate("shipping_ship_to_address")}
                            submitButton={submitButton}
                            countryDisabled
                            setSelectedState={setSelectedState}
                            formType="shipping"
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default ShippingSection;
