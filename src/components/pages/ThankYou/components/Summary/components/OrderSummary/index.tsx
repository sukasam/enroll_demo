import CurrencyFormatter from "Components/shared/CurrencyFormatter";
import T, { useTranslate } from "Components/shared/Translate";
import { useCountryConfig } from "Constants/countryConfig";
import { Variant } from "Constants/countryConfig/types";
import { useProducts } from "Contexts/ProductContext";
import clsx from "clsx";
import Image from "next/image";
import { useMemo } from "react";
import styles from "./OrderSummary.module.css";

interface OrderSummaryProps {
    summaryExpanded: boolean;
    setSummaryExpanded: (expanded: boolean) => void;
    product: any;
    selectedProduct: Variant;
}

export default function OrderSummary(props: OrderSummaryProps): JSX.Element {
    const { summaryExpanded, setSummaryExpanded, product, selectedProduct } =
        props;
    const translate = useTranslate();
    const countryConfig = useCountryConfig();
    const showTax = !countryConfig?.marketExceptions?.taxInclusiveBackEnd;

    const selectedProductEntires = useMemo(
        () => Object.entries(selectedProduct.options),
        [selectedProduct.options]
    );

    const { shoppingCart } = useProducts();

    return (
        <section className={clsx("summary", summaryExpanded && "expanded")}>
            <div
                className="title"
                onClick={(): void => setSummaryExpanded(!summaryExpanded)}
                onKeyDown={(event): void => {
                    if (event.key === "Enter" || event.key === "Space") {
                        setSummaryExpanded(!summaryExpanded);
                    }
                }}
                tabIndex={0}
                role="button"
            >
                <span data-testid="order_summary_text">
                    <T>thank_you_order_summary</T>
                </span>
                <div className="amount" data-testid="order_summary_price">
                    <CurrencyFormatter>{product.terms.total}</CurrencyFormatter>
                </div>
                <div className="plus-minus" data-testid="order_summary_expand">
                    <Image
                        src={`/svg/${summaryExpanded ? "minus" : "plus"}.svg`}
                        alt=""
                        width={14}
                        height={14}
                        className="plusMinus"
                    />
                </div>
            </div>
            <div
                className={clsx(
                    "summary-content",
                    summaryExpanded || "mobile-hidden"
                )}
            >
                <div className={styles.product}>
                    <Image
                        alt=""
                        src={selectedProduct.productImage}
                        width={100}
                        height={100}
                        data-testid="product_image"
                        className={styles.productImage}
                    />
                    <div className={styles.info}>
                        <div
                            className={styles.name}
                            data-testid="product_title"
                        >
                            {translate(selectedProduct.name)}
                        </div>

                        {!!selectedProductEntires.length && (
                            <div className={styles.options}>
                                {selectedProductEntires.map(option => (
                                    <div
                                        className={styles.option}
                                        data-testid={`option_${option[0]}`}
                                        key={option[0]}
                                    >
                                        <span className={styles.optionName}>
                                            <T>{option[0]}</T>
                                        </span>
                                        <span className={styles.optionValue}>
                                            <T>{option[1].title}</T>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div
                            className={styles.description}
                            dangerouslySetInnerHTML={{
                                __html: translate(selectedProduct.description)
                            }}
                            data-testid="product_description"
                        />
                    </div>
                    <div className={styles.price} data-testid="product_price">
                        <CurrencyFormatter>
                            {shoppingCart[0].price}
                        </CurrencyFormatter>
                    </div>
                </div>
                <div className="details">
                    <div className="detail">
                        <div className="label" data-testid="subtotal_label">
                            <T>thank_you_subtotal</T>
                        </div>
                        <div className="value" data-testid="subtotal_value">
                            <CurrencyFormatter>
                                {product.terms.subtotal}
                            </CurrencyFormatter>
                        </div>
                    </div>
                    <div className="detail">
                        <div className="label" data-testid="shipping_label">
                            <T>thank_you_shipping</T>
                        </div>
                        <div className="value" data-testid="shipping_value">
                            {product.terms.freight ? (
                                <CurrencyFormatter>
                                    {product.terms.freight.amount}
                                </CurrencyFormatter>
                            ) : (
                                <T>free</T>
                            )}
                        </div>
                    </div>

                    {showTax && (
                        <div className="detail">
                            <div className="label" data-testid="tax_label">
                                <T>thank_you_tax</T>
                            </div>
                            <div className="value" data-testid="tax_value">
                                {product.terms.tax ? (
                                    <CurrencyFormatter>
                                        {product.terms.tax.amount}
                                    </CurrencyFormatter>
                                ) : (
                                    <T>free</T>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="detail">
                        <div className="label" data-testid="total_label">
                            <strong>
                                <T>thank_you_total</T>
                            </strong>
                        </div>
                        <div className="value" data-testid="total_value">
                            <strong>
                                <CurrencyFormatter>
                                    {product.terms.total}
                                </CurrencyFormatter>
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
