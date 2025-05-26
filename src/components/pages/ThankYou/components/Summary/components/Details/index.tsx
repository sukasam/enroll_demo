import T from "Components/shared/Translate";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { AccountDetails } from "../../hooks";

interface DetailsProps {
    accountDetails: AccountDetails;
}

export default function Details(props: DetailsProps): JSX.Element {
    const { accountDetails } = props;

    const [accountExpanded, setAccountExpanded] = useState(false);
    return (
        <section className="details">
            <div
                className="title"
                onClick={(): void => setAccountExpanded(!accountExpanded)}
                onKeyDown={(event): void => {
                    if (event.key === "Enter" || event.key === "Space") {
                        setAccountExpanded(!accountExpanded);
                    }
                }}
                tabIndex={0}
                role="button"
            >
                <span data-testid="account_details_text">
                    <T>thank_you_account_details</T>
                </span>
                <div
                    className="plus-minus"
                    data-testid="account_details_expand"
                >
                    <Image
                        src={`/svg/${accountExpanded ? "minus" : "plus"}.svg`}
                        alt=""
                        width={14}
                        height={14}
                    />
                </div>
            </div>
            <div className={clsx("card", accountExpanded || "mobile-hidden")}>
                <div className="container">
                    <div className="elements">
                        <div className="element">
                            <div
                                className="label"
                                data-testid="distributor_id_label"
                            >
                                <T>thank_you_distributor_id</T>
                            </div>
                            <div
                                className="value"
                                data-testid="distributor_id_value"
                            >
                                {accountDetails.distributorId}
                            </div>
                        </div>
                        {accountDetails.coapplicant && (
                            <div className="element">
                                <div
                                    className="label"
                                    data-testid="coapplicant_label"
                                >
                                    <T>thank_you_coapplicant</T>
                                </div>
                                <div
                                    className="value"
                                    data-testid="coapplicant_value"
                                >
                                    {accountDetails.coapplicant}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="elements">
                        <div className="element">
                            <div
                                className="label"
                                data-testid="email_address_label"
                            >
                                <T>thank_you_email_address</T>
                            </div>
                            <div
                                className="value"
                                data-testid="email_address_value"
                            >
                                {accountDetails.email}
                            </div>
                        </div>

                        {accountDetails.sponsor && (
                            <div className="element">
                                <div
                                    className="label"
                                    data-testid="your_sponsor_label"
                                >
                                    <T>thank_you_your_sponsor</T>
                                </div>
                                <div
                                    className="value"
                                    data-testid="your_sponsor_value"
                                >
                                    {accountDetails.sponsor}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="additional-info">
                {accountDetails.orderNumber && (
                    <div className="info">
                        <strong data-testid="order_number_label">
                            <T>thank_you_order_number</T>
                        </strong>{" "}
                        <span data-testid="order_number_value">
                            {accountDetails.orderNumber}
                        </span>
                    </div>
                )}
                {accountDetails.receiptEmail && (
                    <div className="info">
                        <strong data-testid="receipt_email_label">
                            <T>thank_you_email_receipt</T>
                        </strong>{" "}
                        <span data-testid="receipt_email_value">
                            {accountDetails.receiptEmail}
                        </span>
                    </div>
                )}
            </div>
        </section>
    );
}
