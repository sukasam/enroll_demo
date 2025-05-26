import { useTranslate } from "Components/shared/Translate";
import { useCountryConfig } from "Constants/countryConfig";
import { useOrder } from "Contexts/OrderContext";
import { useProducts } from "Contexts/ProductContext";
import { useUser } from "Contexts/UserContext";
import { useMemo, useState } from "react";
import Details from "./components/Details";
import NextSteps from "./components/NextSteps";
import OrderSummary from "./components/OrderSummary";
import Payment from "./components/Payment";
import Shipping from "./components/Shipping";
import { PaymentDetails, useOrderDetails } from "./hooks";

export default function Summary(): JSX.Element {
    const t = useTranslate();
    const [summaryExpanded, setSummaryExpanded] = useState(false);
    const { accountDetails, address, payment, shippingMethod, cardInfo } =
        useOrderDetails();

    const { orderResult, pickUpAddressKey } = useOrder();
    const { shoppingCart } = useProducts();
    const countryConfig = useCountryConfig();
    const { userData, enrollerFullName } = useUser();

    const isNoPurchaseMarket = useMemo(
        () => countryConfig?.isNoPurchaseMarket,
        [countryConfig]
    );

    const noPurchaseAccountDetails = useMemo(
        () => ({
            distributorId: userData?.unicityId as string,
            email: userData?.email ?? "",
            coapplicant: null,
            sponsor: (enrollerFullName as string) || ""
        }),
        [userData?.unicityId, userData?.email, enrollerFullName]
    );

    const currentProduct = useMemo(
        () => shoppingCart.find(product => !product.isDigital),
        [shoppingCart]
    );

    const order = useMemo(
        () =>
            currentProduct
                ? orderResult?.lines.items.find(
                      order => order.item.id.unicity === currentProduct.sku
                  )
                : null,
        [currentProduct, orderResult?.lines.items]
    );

    const selectedProduct = useMemo(
        () => (currentProduct && order ? currentProduct : shoppingCart[0]),
        [currentProduct, order, shoppingCart]
    );

    const paymentCleaned: PaymentDetails = useMemo(() => {
        if (!payment) {
            return {} as PaymentDetails;
        }

        if (orderResult?.payPall3dsUrl) {
            return { ...payment, method: "EWalletToken" };
        }

        return payment;
    }, [orderResult, payment]);

    return (
        <div className="tile main" data-testid="main_top_section">
            <div
                className="title"
                dangerouslySetInnerHTML={{
                    __html: t("thank_you_congratulations")
                }}
                data-testid="thank_you_title"
            />
            <div
                className="title"
                dangerouslySetInnerHTML={{
                    __html: t("thank_you_welcome_message")
                }}
                data-testid="thank_you_welcome"
            />
            <NextSteps />
            {accountDetails && <Details accountDetails={accountDetails} />}
            {isNoPurchaseMarket && (
                <Details accountDetails={noPurchaseAccountDetails} />
            )}

            {orderResult && (
                <OrderSummary
                    summaryExpanded={summaryExpanded}
                    setSummaryExpanded={setSummaryExpanded}
                    product={orderResult}
                    selectedProduct={selectedProduct}
                />
            )}

            {address && (
                <Shipping
                    summaryExpanded={summaryExpanded}
                    address={address}
                    shippingMethod={shippingMethod}
                    pickUpAddressKey={pickUpAddressKey}
                />
            )}

            {payment && cardInfo && (
                <Payment
                    summaryExpanded={summaryExpanded}
                    payment={paymentCleaned}
                    cardInfo={cardInfo}
                />
            )}
        </div>
    );
}
