/** @jsxImportSource @emotion/react */

import { Grid } from "@mui/material";
import CurrencyFormatter from "Components/shared/CurrencyFormatter";
import PrimaryButton from "Components/shared/PrimaryButton";
import Spinner from "Components/shared/Spinner";
import { useTranslate } from "Components/shared/Translate";
import { useCountryConfig } from "Constants/countryConfig";
import { useProducts } from "Contexts/ProductContext";
import { useUser } from "Contexts/UserContext";
import { Variant } from "Contexts/types/ProductContextTypes";
import useAllowGuide from "Hooks/useAllowGuide";
import { EVENTS, sendEvent } from "Services/googleAnalytics";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import Image from "next/image";
import { useCallback, useState } from "react";
import VariantPicker from "./components/VariantPicker";
import styles from "./styles";

export type ProductTileProps = {
    backgroundColor: string;
    accentColor: string;
    title: string;
    description: string;
    benefits: string[];
    buttonText: string;
    sku: string | null;
    showPaymentType: boolean;
    selectedVariant: Variant;
    setSku: (value: string | null) => void;
};

export default function ProductTile(props: ProductTileProps): JSX.Element {
    const { title, buttonText, sku, setSku, showPaymentType, selectedVariant } =
        props;
    const translate = useTranslate();

    const { setShoppingCart, ufgVariants } = useProducts();
    const { goToNextSection } = useUser();

    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const countryConfig = useCountryConfig();
    const allowGuide = useAllowGuide();

    const addToCart = useCallback((): void => {
        if (isAddingToCart || !selectedVariant?.sku) return;
        setIsAddingToCart(true);
        mixpanelService.trackEvent(
            MixpanelEvent.REGISTER_STARTER_KIT_SELECTED,
            {
                item_sku: selectedVariant?.sku,
                price: selectedVariant?.price?.toString(),
                item_flavour: `${selectedVariant?.options?.unimate_flavour?.title} / ${selectedVariant?.options?.balance_pack?.title}`,
                item_flavour_options: ufgVariants.map(
                    variant =>
                        `${variant?.options?.unimate_flavour?.title} / ${variant?.options?.balance_pack?.title}`
                ),
                currency: countryConfig?.currency || "USD",
                basic_kit_selected: false,
                basic_kit_available: allowGuide
            }
        );
        setShoppingCart([selectedVariant]);
        sendEvent(EVENTS.CATALOG_SELECT_PRODUCT, {
            sku,
            automatic: false
        });
        goToNextSection();
        setTimeout(() => setIsAddingToCart(false), 1000);
    }, [
        isAddingToCart,
        selectedVariant,
        setShoppingCart,
        sku,
        goToNextSection,
        allowGuide,
        countryConfig?.currency,
        ufgVariants
    ]);

    return !selectedVariant ? (
        <Spinner />
    ) : (
        <Grid container css={styles}>
            <Grid className="info" item md={12} xs={12}>
                <div className="top">
                    <div className="title" data-testid="business_builder_kit">
                        {title}
                    </div>
                    <div data-test-id="kit_sku">
                        {translate("catalog_sku")}# {sku} |{" "}
                        {translate("catalog_size")}:{" "}
                        {parseInt(selectedVariant.partsCount, 10)} pack
                    </div>
                    <Grid className="image-wrapper" item md={12} xs={12}>
                        <div
                            style={{
                                position: "relative",
                                width: "75%",
                                padding: "20px 10px 10px 10px"
                            }}
                        >
                            <Image
                                alt="product-img"
                                key={selectedVariant.productImage}
                                src={selectedVariant.productImage}
                                width={256}
                                height={171}
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    objectFit: "contain"
                                }}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    </Grid>
                </div>

                <div className="list">
                    <div className="price" data-test-id="kit_price">
                        {selectedVariant.price && (
                            <div
                                className="value"
                                data-testid="product_price_recommended_label"
                            >
                                <CurrencyFormatter>
                                    {selectedVariant.price}
                                </CurrencyFormatter>
                            </div>
                        )}
                        {showPaymentType && (
                            <div
                                className="label"
                                data-testid="payment_type_recommended_label"
                                dangerouslySetInnerHTML={{
                                    __html: `${translate(
                                        "catalog_member_one_time_payment"
                                    )}`
                                }}
                            />
                        )}
                    </div>
                    <VariantPicker setSku={setSku} sku={sku} />
                    <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={2}
                    >
                        <Grid item className="topMargin">
                            <PrimaryButton
                                onClick={addToCart}
                                id="catalog_get_bussines"
                                data-testid="get_business_builder_button"
                                size="500px"
                                disabled={isAddingToCart}
                            >
                                {translate(buttonText)}
                            </PrimaryButton>
                        </Grid>
                    </Grid>
                </div>
            </Grid>
        </Grid>
    );
}
