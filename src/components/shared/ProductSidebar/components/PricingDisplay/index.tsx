/** @jsxImportSource @emotion/react */
import CurrencyFormatter from "Components/shared/CurrencyFormatter";
import T from "Components/shared/Translate";
import { useCountryConfig } from "Constants/countryConfig";
import { useOrder } from "Contexts/OrderContext";
import { useProducts } from "Contexts/ProductContext";
import styles from "./styles";

export type PricingDisplayProps = {
    showPricingBreakdown: boolean;
};

export default function PricingDisplay({
    showPricingBreakdown = false
}: PricingDisplayProps): JSX.Element {
    const OrderData = useOrder();
    const { selectedShippingMethod } = OrderData;
    const { shoppingCart } = useProducts();
    const countryConfig = useCountryConfig();
    const showTax = !countryConfig?.marketExceptions?.taxInclusiveBackEnd;

    return (
        <div css={styles}>
            {showPricingBreakdown && (
                <div className="prices">
                    <div className="price">
                        <div
                            className="name"
                            data-testid="right_column_subtotal"
                        >
                            <T>right_column_subtotal</T>
                        </div>
                        <div
                            className="value"
                            data-testid="subtotal_price_label"
                        >
                            <CurrencyFormatter>
                                {shoppingCart[0]?.price}
                            </CurrencyFormatter>
                        </div>
                    </div>
                    <div className="price">
                        <div
                            className="name"
                            data-testid="right_column_payment_shipping"
                        >
                            <T>right_column_payment_shipping</T>
                        </div>
                        <div
                            className="value"
                            data-testid="shipping_price_label"
                        >
                            <CurrencyFormatter allowFree>
                                {selectedShippingMethod?.shipping}
                            </CurrencyFormatter>
                        </div>
                    </div>
                    {showTax && (
                        <div className="price">
                            <div
                                className="name"
                                data-testid="right_column_payment_tax"
                            >
                                <T>right_column_payment_tax</T>
                            </div>
                            <div
                                className="value"
                                data-testid="tax_price_label"
                            >
                                <CurrencyFormatter allowFree>
                                    {selectedShippingMethod?.tax}
                                </CurrencyFormatter>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
