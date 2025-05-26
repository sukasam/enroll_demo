/** @jsxImportSource @emotion/react */
import { useOrder } from "Contexts/OrderContext";
import { useTranslations } from "Contexts/translation";
import { useUser } from "Contexts/UserContext";
import styles from "./styles";

export default function AddressSummary(): JSX.Element {
    const { shipToAddress, isShipToOffice } = useOrder();
    const { userData, mainAddress } = useUser();
    const { language } = useTranslations();

    const addressToShow = isShipToOffice ? mainAddress : shipToAddress;

    if (!addressToShow) {
        return <div>No address provided.</div>;
    }

    const { address1, address2, city, state, zip, country } = addressToShow;
    return (
        <div css={styles}>
            <div className="address-field">
                {country === "JP" ? (
                    <div>
                        <div>
                            {language === "ja"
                                ? userData?.firstName
                                : userData?.lastName}
                        </div>
                        <div>{address1}</div>
                        {address2 && <div>{address2}</div>}
                        <div>
                            {zip}, {country}
                        </div>
                    </div>
                ) : (
                    <div>
                        <div>
                            {userData?.firstName} {userData?.lastName}
                        </div>
                        <div>{address1}</div>
                        {address2 && <div>{address2}</div>}
                        <div>
                            {city}, {state}
                            <br />
                            {zip}, {country}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
