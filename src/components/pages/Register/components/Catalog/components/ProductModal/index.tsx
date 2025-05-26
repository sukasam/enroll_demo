/** @jsxImportSource @emotion/react */
import Checkmark from "Components/shared/Checkmark";
import CurrencyFormatter from "Components/shared/CurrencyFormatter";
import PrimaryButton from "Components/shared/PrimaryButton";
import StyledModal from "Components/shared/StyledModal";
import T, { useTranslate } from "Components/shared/Translate";
import { ProductContext } from "Contexts/ProductContext";
import useProductConfig from "Hooks/useProductConfig";
import useVariant from "Hooks/useVariant";
import { EVENTS, sendEvent } from "Services/googleAnalytics";
import { useAlpha2 } from "Services/locale";
import getVariantBySku from "Services/utils/getVariantBySku";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useCallback, useContext, useMemo } from "react";
import styles from "./styles";

interface ProductModalProps {
    packId: number;
    setCustomizerModalID: (value: number | null) => void;
    image: string;
    onClose: () => void;
    sku: string | null;
}

function ProductModal(props: ProductModalProps): JSX.Element {
    const { packId, setCustomizerModalID, image, onClose, sku } = props;

    const {
        query: { alpha3, language }
    } = useRouter();
    const alpha2 = useAlpha2();

    const t = useTranslate();

    const { setSelectedSku } = useContext(ProductContext);

    const productConfig = useProductConfig();

    const pack = useMemo(() => {
        if (!productConfig) {
            return null;
        }

        const _pack = productConfig.packs[packId];

        if (!_pack || _pack.isDigital) {
            return null;
        }

        return _pack;
    }, [packId, productConfig]);

    const recommended = useMemo(
        () => productConfig?.recommendedPack === packId,
        [productConfig, packId]
    );

    function getPackMinPrice(skus: string[]): number {
        const prices = skus
            .map(sku => getVariantBySku(productConfig, sku))
            .map(variant => variant?.price || 0);

        return Math.min(...prices) ?? 0;
    }

    const handleGetPack = useCallback((): void => {
        if (!pack) {
            return;
        }

        const { variants } = pack;

        if (variants.length > 1) {
            setCustomizerModalID(packId);
            onClose();
            return;
        }

        const { sku } = variants[0];

        setSelectedSku(sku);

        sendEvent(EVENTS.CATALOG_SELECT_PRODUCT, {
            sku,
            automatic: true
        });

        window.location.href = `/${alpha3}/${language}/create-account`;
    }, [
        alpha3,
        language,
        pack,
        packId,
        setCustomizerModalID,
        onClose,
        setSelectedSku
    ]);

    const variant = useVariant(sku);

    return (
        <>
            <link rel="preload" as="image" href={image} />

            <StyledModal
                fullPage
                isOpen={typeof packId === "number"}
                setIsOpen={onClose}
            >
                {pack && (
                    <div css={styles} data-testid="learn_more_modal">
                        <div className="info">
                            <div
                                className="title"
                                data-testid="product_name_title_label"
                            >
                                {variant?.name ?? ""}
                            </div>
                            <div
                                className="price"
                                data-testid="product_price_label"
                            >
                                <CurrencyFormatter>
                                    {getPackMinPrice(
                                        pack.variants.map(
                                            (variant: any) => variant.sku
                                        )
                                    )}
                                </CurrencyFormatter>
                                {pack.showPaymentType && (
                                    <>
                                        {" "}
                                        -{" "}
                                        <T>
                                            catalog_basic_distributor_one_time_payment
                                        </T>
                                    </>
                                )}
                            </div>
                            <div className="image">
                                <Image
                                    alt={`Product image for ${pack.buttonName}`}
                                    data-testid="product_image_modal"
                                    src={image}
                                    width={400}
                                    height={400}
                                    quality={90}
                                    priority
                                />
                            </div>
                            <div className="button-wrapper">
                                <PrimaryButton
                                    onClick={(): void => onClose()}
                                    id={
                                        recommended
                                            ? "learn_get_bussines"
                                            : "learn_get_basic"
                                    }
                                    data-testid="product_get_button_modal"
                                >
                                    {t("catalog_get_business_builder", {
                                        pack: t(pack.buttonName)
                                    })}
                                </PrimaryButton>
                            </div>
                        </div>
                        <div className="description">
                            <div
                                className="title"
                                data-testid="kit_description_title_label"
                            >
                                <T>kit_description</T>
                            </div>
                            <p data-testid="kit_description_label">
                                {t(pack.kitDescription)}
                            </p>
                            <div className="list">
                                {pack.mainFeatures.map((benefit: any) => (
                                    <div className="list-item" key={benefit}>
                                        <div
                                            className="icon"
                                            data-testid={`benefit_${benefit}_icon`}
                                        >
                                            <Checkmark />
                                        </div>
                                        <div
                                            className="benefit"
                                            dangerouslySetInnerHTML={{
                                                __html: t(benefit)
                                            }}
                                            data-testid={`benefit_${benefit}_label`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {pack.products && (
                            <div className="products-included">
                                <div
                                    className="title"
                                    data-testid="products_included_title_label"
                                >
                                    <T>products_included</T>
                                </div>
                                <div className="wrapper">
                                    {pack.products.map((product: any) => (
                                        <div
                                            className="product"
                                            key={product.title}
                                        >
                                            <div className="image-wrapper">
                                                <Image
                                                    alt={`${t(
                                                        product.title
                                                    )} product image`}
                                                    src={product.image}
                                                    data-testid={`${product.title}_image`}
                                                    width={200}
                                                    height={200}
                                                    quality={85}
                                                />
                                            </div>
                                            <div
                                                className="product-title"
                                                data-testid={`product_title_${product.title}_label`}
                                            >
                                                {t(product.title)}
                                            </div>
                                            <div
                                                className="product-description"
                                                dangerouslySetInnerHTML={{
                                                    __html: t(
                                                        product.description
                                                    )
                                                }}
                                                data-testid={`product_description_${product.description}_label`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {Boolean(pack.perks.length) && (
                            <div className="perks">
                                <div
                                    className="title"
                                    data-testid="perks_title_label"
                                >
                                    <T>perks</T>
                                </div>
                                <div className="perk-wrapper">
                                    {pack.perks.map((perk: any) => (
                                        <div className="perk" key={perk.perk}>
                                            <div className="icon">
                                                <Image
                                                    alt={`${t(
                                                        perk.perk
                                                    )} perk icon`}
                                                    src={perk.icon}
                                                    data-testid={`perk_${perk.perk}_image`}
                                                    width={48}
                                                    height={48}
                                                    quality={85}
                                                />
                                            </div>
                                            <div
                                                className="label"
                                                data-testid={`perk_${perk.perk}_label`}
                                            >
                                                {t(perk.perk)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {Boolean(pack.extras.length) && (
                            <div className="extras">
                                <div
                                    className="title"
                                    data-testid="product_extras_title_label"
                                >
                                    <T>extras</T>
                                </div>
                                {pack.extras.map((extra: any) => (
                                    <Fragment key={extra.title}>
                                        <div className="wrapper">
                                            <div className="icon">
                                                <Image
                                                    alt={`${t(
                                                        extra.title
                                                    )} extra icon`}
                                                    src={extra.icon}
                                                    data-testid="product_extras_icon"
                                                    width={48}
                                                    height={48}
                                                    quality={85}
                                                />
                                            </div>
                                            <div className="info">
                                                <strong data-testid="product_extras_description_title_label">
                                                    {t(extra.title)}
                                                </strong>{" "}
                                                <br />
                                                <span data-testid="product_extras_description_label">
                                                    {t(extra.description)}
                                                </span>
                                            </div>
                                        </div>
                                    </Fragment>
                                ))}
                            </div>
                        )}
                        <div
                            className="annotations"
                            dangerouslySetInnerHTML={{
                                __html: t(pack.annotations, { alpha2 })
                            }}
                            data-testid="product_annotations_label"
                        />

                        {recommended && (
                            <div className="mobile-button-wrapper">
                                <PrimaryButton
                                    onClick={handleGetPack}
                                    id={
                                        recommended
                                            ? "learn_get_bussines"
                                            : "learn_get_basic"
                                    }
                                >
                                    {t("catalog_get_business_builder", {
                                        pack: t(pack.buttonName).toLowerCase()
                                    })}
                                </PrimaryButton>
                            </div>
                        )}
                    </div>
                )}
            </StyledModal>
        </>
    );
}

export default ProductModal;
