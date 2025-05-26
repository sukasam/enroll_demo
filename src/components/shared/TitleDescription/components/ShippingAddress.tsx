import T from "Components/shared/Translate";
import { useCountryConfig } from "Constants/countryConfig";
import { useOrder } from "Contexts/OrderContext";
import { useUser } from "Contexts/UserContext";

interface AddressData {
    address1?: string | null;
    address2?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
    country?: string | null;
}

const defaultFormat =
    "{address1}, {address2}, {city}, {state}, {zip}, {country}";

function formatAddress(address: AddressData, format?: string): string {
    const _format = format || defaultFormat;

    // First replace all placeholders with values or empty strings
    const formattedAddress = _format.replace(/{(\w+)}/g, (match, field) => {
        const value = address[field as keyof AddressData];
        return value || "";
    });

    // Then clean up any multiple spaces and commas
    return formattedAddress
        .replace(/\s*,\s*,+/g, ",") // Remove multiple commas
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .replace(/,\s*$/g, "") // Remove trailing comma
        .trim();
}

export default function ShippingAddress(): JSX.Element | null {
    const countryConfig = useCountryConfig();
    const { shipToAddress, isShipToOffice, pickUpAddressKey } = useOrder();
    const { mainAddress } = useUser();

    const processAddress = (address: AddressData | null): AddressData | null =>
        address && {
            ...address,
            state: address.country !== "PR" ? address.state : null
        };

    const addressToUse = countryConfig?.isNoPurchaseMarket
        ? processAddress(mainAddress)
        : processAddress(shipToAddress);

    if (!addressToUse) return null;

    return (
        <div>
            {isShipToOffice ? (
                <T allowHTML>{pickUpAddressKey}</T>
            ) : (
                formatAddress(addressToUse, countryConfig?.addressFormat)
            )}
        </div>
    );
}
