/** @jsxImportSource @emotion/react */
import StyledCheckbox from "Components/shared/StyledCheckbox";
import StyledRadio from "Components/shared/StyledRadio";
import T, { useTranslate } from "Components/shared/Translate";
import { useCountryConfig } from "Constants/countryConfig";
import { Alpha2 } from "Constants/countryConfig/enums";
import { useOrder } from "Contexts/OrderContext";
import { useUser } from "Contexts/UserContext";
import Link from "next/link";
import { useEffect } from "react";
import styles from "./styles";

const SHIPPING_ADDRESS_DEFAULT = "shipping_pickup_address";
function ShipToOfficeComponent({
    onChange
}: {
    onChange: () => void;
}): JSX.Element {
    const countryConfig = useCountryConfig();
    const {
        isShipToOffice,
        setShipToAddress,
        selectedWillCallAddress,
        setSelectedWillCallAddress,
        setPickUpAddressKey
    } = useOrder();
    const { userData } = useUser();
    const translate = useTranslate();
    const willCallAddresses =
        countryConfig?.marketExceptions.willCallAddresses || [];
    const onlyHasWillCall = countryConfig?.marketExceptions.onlyHasWillCall;
    useEffect(() => {
        if (
            isShipToOffice &&
            !selectedWillCallAddress &&
            willCallAddresses.length > 0
        ) {
            setSelectedWillCallAddress(willCallAddresses[0].address1 || "");
        }
    }, [
        isShipToOffice,
        selectedWillCallAddress,
        willCallAddresses,
        setSelectedWillCallAddress
    ]);

    useEffect(() => {
        if (isShipToOffice && selectedWillCallAddress) {
            const selectedAddress = willCallAddresses.find(
                addr => addr.address1 === selectedWillCallAddress
            );
            if (selectedAddress) {
                setShipToAddress({
                    name: userData?.fullName || "",
                    address1: selectedAddress.address1 || "",
                    address2: selectedAddress.address2 || "",
                    city: selectedAddress.city || "",
                    state: selectedAddress.state || "",
                    zip: selectedAddress.zip || "",
                    country:
                        (selectedAddress.country as Alpha2) || ("US" as Alpha2)
                });
            }
        }
    }, [
        isShipToOffice,
        selectedWillCallAddress,
        willCallAddresses,
        userData,
        setShipToAddress
    ]);

    useEffect(() => {
        if (isShipToOffice) {
            setPickUpAddressKey(SHIPPING_ADDRESS_DEFAULT || "");
            setSelectedWillCallAddress(willCallAddresses[0].address1 || "");
        }
    }, [
        isShipToOffice,
        setSelectedWillCallAddress,
        willCallAddresses,
        setPickUpAddressKey
    ]);

    const handleAddressChange = (address: string, rosettaKey: string): void => {
        setSelectedWillCallAddress(address);
        setPickUpAddressKey(rosettaKey);
    };

    return (
        <div css={styles}>
            <div id="checkbox" className="checkbox">
                <StyledCheckbox
                    onChange={onChange}
                    checked={isShipToOffice}
                    disabled={onlyHasWillCall}
                />
                <label
                    htmlFor="shipToOffice"
                    className="shipToOffice"
                    data-testid="shipping_pickup"
                >
                    <T>shipping_pickup_title</T>
                </label>
                <div
                    className="shipping_description"
                    data-testid="shipping_description"
                >
                    <T>shipping_description</T>
                </div>
            </div>
            {isShipToOffice && (
                <div className="shippingAddress">
                    {willCallAddresses.map(
                        (item, i): JSX.Element => (
                            <div key={item.zip} className="addressChoice">
                                <StyledRadio
                                    checked={
                                        selectedWillCallAddress ===
                                        item.address1
                                    }
                                    onChange={(): void =>
                                        handleAddressChange(
                                            item.address1 || "",
                                            item.rosettaKey || ""
                                        )
                                    }
                                    value={item.address1}
                                    name="willCallAddress"
                                />
                                <Link
                                    href={translate(item.mapLinkKey)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="addressLink"
                                >
                                    <T allowHTML>{item.rosettaKey}</T>
                                </Link>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

export default ShipToOfficeComponent;
