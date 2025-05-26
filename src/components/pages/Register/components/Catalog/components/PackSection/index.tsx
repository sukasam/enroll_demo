/** @jsxImportSource @emotion/react */

import { Grid } from "@mui/material";
import NoSSR from "Components/shared/NoSSR";
import T, { useTranslate } from "Components/shared/Translate";
import { useOrder } from "Contexts/OrderContext";
import { useProducts } from "Contexts/ProductContext";
import { useUser } from "Contexts/UserContext";
import useAllowGuide from "Hooks/useAllowGuide";
import { useEffect, useMemo, useRef, useState } from "react";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import BasicProductTile from "./components/BasicProductTile";
import ProductTile from "./components/ProductTile";
import styles from "./styles";

export default function PackSection(): JSX.Element {
    const t = useTranslate();
    const [sku, setSku] = useState<string | null>(null);
    const {
        setShoppingCart,
        availableDigitalGuideVariant,
        setSelectedSku,
        ufgVariants,
        digitalPack,
        feelGreatPack
    } = useProducts();
    const { goToNextSection } = useUser();
    const {
        setSignatureDateTimeStamp,
        setUserSignature,
        setSelectedPaymentMethod
    } = useOrder();

    useEffect(() => {
        setSelectedSku(sku);
        setSignatureDateTimeStamp(null);
        setSelectedPaymentMethod(null);
        setUserSignature(null);
    }, [sku]);

    const allowGuide = useAllowGuide();

    const hasTrackedEvent = useRef(false);

    const selectedUFGVariant = useMemo(() => {
        if (!ufgVariants) return null;
        return (
            ufgVariants?.find(variant => variant.sku === sku) || ufgVariants[0]
        );
    }, [sku, ufgVariants]);

    useEffect(() => {
        if (feelGreatPack && selectedUFGVariant && !hasTrackedEvent.current) {
            hasTrackedEvent.current = true;
            mixpanelService.trackEvent(
                MixpanelEvent.REGISTER_STARTER_KIT_SECTION_PRESENTED,
                {
                    basic_kit_available: allowGuide
                }
            );
        }
    }, [feelGreatPack, allowGuide, selectedUFGVariant]);

    return (
        <div css={styles}>
            <Grid container>
                <Grid item xs={12} />
                <Grid container>
                    <Grid className="container" item xs={12}>
                        <div className="products">
                            <NoSSR>
                                {!selectedUFGVariant || !feelGreatPack ? (
                                    <T>no_products_found_for_your_country</T>
                                ) : (
                                    <ProductTile
                                        accentColor={feelGreatPack.accentColor}
                                        backgroundColor={
                                            feelGreatPack.backgroundColor
                                        }
                                        benefits={feelGreatPack.benefits}
                                        buttonText={feelGreatPack.buttonName}
                                        description={
                                            t(
                                                selectedUFGVariant?.description
                                            ) ?? ""
                                        }
                                        showPaymentType={
                                            feelGreatPack.showPaymentType
                                        }
                                        sku={sku}
                                        setSku={setSku}
                                        title={
                                            t(selectedUFGVariant?.name) ?? ""
                                        }
                                        selectedVariant={selectedUFGVariant}
                                    />
                                )}
                                {allowGuide &&
                                digitalPack &&
                                availableDigitalGuideVariant ? (
                                    <BasicProductTile
                                        backgroundColor="#F9F9F9"
                                        buttonClick={(): void => {
                                            mixpanelService.trackEvent(
                                                MixpanelEvent.REGISTER_STARTER_KIT_SELECTED,
                                                {
                                                    basic_kit_selected: true,
                                                    basic_kit_available: true
                                                }
                                            );
                                            setShoppingCart([
                                                availableDigitalGuideVariant
                                            ]);
                                            goToNextSection();
                                        }}
                                        buttonText={digitalPack.buttonName}
                                        description={
                                            t(
                                                availableDigitalGuideVariant.description
                                            ) ?? ""
                                        }
                                        price={
                                            availableDigitalGuideVariant.price
                                        }
                                        title={
                                            t(
                                                availableDigitalGuideVariant.name
                                            ) ?? ""
                                        }
                                        showPaymentType={
                                            digitalPack.showPaymentType
                                        }
                                    />
                                ) : null}
                            </NoSSR>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}
