/** @jsxImportSource @emotion/react */
import CurrencyFormatter from "Components/shared/CurrencyFormatter";
import { useTranslate } from "Components/shared/Translate";
import { useOrder } from "Contexts/OrderContext";
import { ChangeEvent, useEffect } from "react";
import StyledRadio from "./RaidoButton";
import styles from "./styles";

export default function ShippingMethodOptions(): JSX.Element {
    const {
        shippingMethodQuotes,
        selectedShippingMethod,
        setSelectedShippingMethod
    } = useOrder();
    const translate = useTranslate();

    function selectShippingMethod(shippingMethodName: string): void {
        const method = Object.values(shippingMethodQuotes).find(
            m => m.type === shippingMethodName
        );
        if (method) setSelectedShippingMethod(method);
    }

    useEffect(() => {
        if (
            selectedShippingMethod === null &&
            shippingMethodQuotes.length > 0
        ) {
            setSelectedShippingMethod(shippingMethodQuotes[0]);
        }
    }, [shippingMethodQuotes]);

    return (
        <div css={styles}>
            <h1 className="formTitle">
                {translate("payment_review_shipping_method")}
            </h1>
            {Array.from(new Set(shippingMethodQuotes.map(m => m.type))).map(
                type => {
                    const methodDetails = shippingMethodQuotes.find(
                        m => m.type === type
                    );
                    return (
                        <div
                            className="option"
                            key={type}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "12px"
                            }}
                        >
                            <StyledRadio
                                name={translate(methodDetails?.type || "")}
                                data-testid={methodDetails?.type || ""}
                                value={methodDetails?.type || ""}
                                checked={
                                    selectedShippingMethod?.type ===
                                    methodDetails?.type
                                }
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>
                                ): void => {
                                    selectShippingMethod(event.target.value);
                                }}
                            />
                            <div
                                className="texts"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginLeft: "16px"
                                }}
                            >
                                <div className="name">
                                    {methodDetails?.type === "WillCall"
                                        ? translate("shipping_pickup_title")
                                        : translate(
                                              methodDetails?.type.toLocaleLowerCase() ||
                                                  ""
                                          )}
                                </div>
                                <div
                                    className="description"
                                    style={{ marginLeft: "8px" }}
                                >
                                    {methodDetails?.shipping === "0" ? (
                                        translate("shipping_free")
                                    ) : (
                                        <CurrencyFormatter>
                                            {methodDetails?.shipping || ""}
                                        </CurrencyFormatter>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                }
            )}
        </div>
    );
}
