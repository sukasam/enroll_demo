import T from "Components/shared/Translate";
import { useUser } from "Contexts/UserContext";
import { useTranslations } from "Contexts/translation";
import clsx from "clsx";
import { AddressDetails } from "../../hooks";

interface ShippingProps {
    summaryExpanded: boolean;
    address: AddressDetails;
    shippingMethod: string;
    pickUpAddressKey: string | null;
}

export default function Shipping(props: ShippingProps): JSX.Element {
    const { summaryExpanded, address, shippingMethod, pickUpAddressKey } =
        props;
    const { userData } = useUser();
    const { country, language } = useTranslations();

    return (
        <section
            className={clsx("shipping", summaryExpanded || "mobile-hidden")}
        >
            <div className="title" data-testid="shipping_to_title">
                <T>thank_you_shipping_to</T>
            </div>
            <div className="container">
                {country === "JP" ? (
                    <div className="address" data-testid="shipping_to_address">
                        <div>
                            {language === "ja"
                                ? userData?.firstName
                                : userData?.lastName}
                        </div>
                        {shippingMethod === "WillCall" ? (
                            <div>
                                <T allowHTML>{pickUpAddressKey}</T>
                            </div>
                        ) : (
                            <div>
                                <div>{address?.address1}</div>
                                <div>{address?.address2}</div>
                                <div>{address?.zip}</div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="address" data-testid="shipping_to_address">
                        <div>
                            {userData?.firstName} {userData?.lastName}
                        </div>
                        {shippingMethod === "WillCall" ? (
                            <div>
                                <T allowHTML>{pickUpAddressKey}</T>
                            </div>
                        ) : (
                            <div>
                                <div>{address?.address1}</div>
                                {address?.address2 && (
                                    <div>{address?.address2}</div>
                                )}
                                <div>
                                    {address?.city}, {address?.state}
                                    <br />
                                    {address?.zip}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="method" data-testid="shipping_to_method">
                    {shippingMethod === "WillCall" ? (
                        <T>shipping_pickup_title</T>
                    ) : (
                        <T>{shippingMethod}:</T>
                    )}
                </div>
            </div>
        </section>
    );
}
