/** @jsxImportSource @emotion/react */
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CurrencyFormatter from "Components/shared/CurrencyFormatter";
import T from "Components/shared/Translate";
import { useOrder } from "Contexts/OrderContext";
import { useProducts } from "Contexts/ProductContext";
import { useMemo, useState } from "react";
import PricingDisplay from "./components/PricingDisplay";
import ProductDisplay from "./components/ProductDisplay";
import SubmitButton from "./components/SubmitButton";
import styles from "./styles";

type ProductSidebarProps = {
    showPricingBreakdown?: boolean;
};

export default function ProductSidebar({
    showPricingBreakdown = false
}: ProductSidebarProps): JSX.Element {
    const { selectedShippingMethod } = useOrder();
    const { shoppingCart } = useProducts();
    const [isExpanded, setIsExpanded] = useState(false);
    const orderTotal = useMemo(() => shoppingCart[0]?.price, [shoppingCart]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const toggleOrderSummary = (): void => setIsExpanded(!isExpanded);

    const totalPrice = useMemo(
        () => (
            <div css={styles.totalPrice(theme)}>
                <div
                    className="text"
                    data-testid="right_column_payment_order_total"
                >
                    <T>right_column_payment_order_total</T>
                </div>
                <div className="price" data-testid="order_total_price_label">
                    <CurrencyFormatter>
                        {showPricingBreakdown
                            ? selectedShippingMethod?.orderTotal
                            : orderTotal}
                    </CurrencyFormatter>
                </div>
            </div>
        ),
        [showPricingBreakdown, selectedShippingMethod, orderTotal]
    );

    const renderOrderSummary = (): JSX.Element => (
        <div css={styles.content(theme)} data-testid="product_sidebar_summary">
            <div className="title" data-testid="right_column_your_starter_kit">
                <T
                    variables={{
                        price: (
                            <CurrencyFormatter>
                                {selectedShippingMethod?.subtotal}
                            </CurrencyFormatter>
                        )
                    }}
                >
                    right_column_your_starter_kit
                </T>
            </div>
            <ProductDisplay />
            <PricingDisplay showPricingBreakdown={showPricingBreakdown} />
        </div>
    );

    return (
        <div data-testid="product_sidebar" css={styles.container}>
            {isMobile ? (
                <>
                    <div
                        css={styles.header(theme)}
                        onClick={toggleOrderSummary}
                        onKeyDown={(e): void => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                toggleOrderSummary();
                            }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-expanded={isExpanded}
                    >
                        {totalPrice}
                        <button
                            css={styles.toggleButton(theme)}
                            type="button"
                            aria-label={
                                isExpanded
                                    ? "Collapse details"
                                    : "Expand details"
                            }
                        >
                            {isExpanded ? <RemoveIcon /> : <AddIcon />}
                        </button>
                    </div>
                    {isExpanded && renderOrderSummary()}
                    <SubmitButton showPricingBreakdown={showPricingBreakdown} />
                </>
            ) : (
                <>
                    {renderOrderSummary()}
                    {totalPrice}
                    <SubmitButton showPricingBreakdown={showPricingBreakdown} />
                </>
            )}
        </div>
    );
}
