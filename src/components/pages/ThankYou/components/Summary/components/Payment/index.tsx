/** @jsxImportSource @emotion/react */
import BankWireInfo from "Components/pages/Register/components/Payment/components/BankWire/components/BankWireInfo";
import LocalImage from "Components/shared/LocalImage";
import T, { useTranslate } from "Components/shared/Translate";
import getCardIcon from "Services/utils/getCardIcon";
import clsx from "clsx";
import { CreditCardType } from "credit-card-type/dist/types";
import Image from "next/image";
import { PaymentDetails } from "../../hooks";
import styles from "./styles";

interface PaymentProps {
    summaryExpanded: boolean;
    payment: PaymentDetails;
    cardInfo: CreditCardType[];
}

export default function Payment(props: PaymentProps): JSX.Element {
    const { summaryExpanded, payment, cardInfo } = props;
    const translate = useTranslate();

    const paymentMethods: {
        [key: string]: {
            iconSrc: string | (() => string);
            paymentMethodText: string | (() => string);
        };
    } = {
        CreditCard: {
            iconSrc: () => getCardIcon(payment.cardNumber),
            paymentMethodText: () => cardInfo[0]?.niceType
        },
        EWalletToken: {
            iconSrc: "/paypal.svg",
            paymentMethodText: translate("thank_you_paypal_account")
        },
        Cash: {
            iconSrc: "/cash.svg",
            paymentMethodText: translate("thank_you_cash_label")
        },
        BankWire: {
            iconSrc: "/bankwire.svg",
            paymentMethodText: translate("payment_bank_wire")
        }
    };

    let { iconSrc, paymentMethodText } = paymentMethods[payment.method];

    if (typeof iconSrc === "function") {
        iconSrc = iconSrc();
    }

    if (typeof paymentMethodText === "function") {
        paymentMethodText = paymentMethodText();
    }

    return (
        <section
            css={styles}
            className={clsx("payment", summaryExpanded || "mobile-hidden")}
        >
            <div className="payment-row" data-testid="payment_title">
                <T>thank_you_payment</T>
                {iconSrc && (
                    <Image
                        alt=""
                        height="24"
                        src={iconSrc}
                        width="32"
                        data-testid={`${payment.method.toLowerCase()}_image`}
                    />
                )}
                <span
                    className="name"
                    data-testid={`${payment.method.toLowerCase()}_name`}
                >
                    {paymentMethodText}
                </span>
            </div>
            {payment.method === "CreditCard" && (
                <div className="card-number" data-testid="credit_card_number">
                    {payment.cardNumber?.slice(-4)}
                </div>
            )}
            {payment.method === "BankWire" && (
                <div>
                    <div className="subtitle">
                        <T>thank_you_for_your_order_bankwire</T>
                    </div>

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
                </div>
            )}
            {payment.method === "Cash" && (
                <>
                    <div className="cash-details" data-testid="cash_name">
                        <strong>
                            <T>payment_cash_label</T>
                        </strong>
                    </div>
                    <div
                        className="message"
                        dangerouslySetInnerHTML={{
                            __html: translate("payment_cash_payment_message")
                        }}
                    />
                </>
            )}
            {payment.method === "BankWire" && (
                <div className="bankwire_container">
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
                    <div className="order_instructions_container">
                        <strong>
                            <T>enter_id_message</T>
                        </strong>
                    </div>
                    <div>
                        <T>order_instructions</T>
                    </div>
                </div>
            )}
        </section>
    );
}
