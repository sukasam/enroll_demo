/** @jsxImportSource @emotion/react */
import LocalImage from "Components/shared/LocalImage";
import T from "Components/shared/Translate";
import BankWireInfo from "./components/BankWireInfo";
import styles from "./styles";

export default function BankWire(): JSX.Element {
    return (
        <div css={styles}>
            <div className="card bank_wire_container">
                <div className="banner">
                    <LocalImage
                        className="icon"
                        height="18"
                        src="/svg/info.svg"
                        width="18"
                        priority={false}
                    />
                    <div
                        className="banner-header"
                        data-testid="bankwire_message"
                    >
                        <T>bankwire_message</T>
                    </div>
                </div>
                <div className="banner-body">
                    <BankWireInfo
                        titleKey="payment_beneficiary"
                        infoKey="payment_beneficiary_message"
                    />
                    <BankWireInfo
                        titleKey="payment_iban"
                        infoKey="payment_iban_number"
                    />
                    <BankWireInfo
                        titleKey="payment_bic"
                        infoKey="payment_bic_number"
                    />
                </div>
                <T>enter_id_message</T>
            </div>
        </div>
    );
}
