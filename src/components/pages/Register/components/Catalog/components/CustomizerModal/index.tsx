/** @jsxImportSource @emotion/react */

import CurrencyFormatter from "Components/shared/CurrencyFormatter";
import PrimaryButton from "Components/shared/PrimaryButton";
import StyledModal from "Components/shared/StyledModal";
import T, { useTranslate } from "Components/shared/Translate";
import { VariantOption } from "Constants/countryConfig/types";
import { ProductContext } from "Contexts/ProductContext";
import useProductConfig from "Hooks/useProductConfig";
import useVariant from "Hooks/useVariant";
import { EVENTS, sendEvent } from "Services/googleAnalytics";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/router";
import {
    memo,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import styles from "./styles";

interface CustomizerModalProps {
    customizerModalID: number | null;
    setCustomizerModalID: (value: number | null) => void;
}

function CustomizerModal(props: CustomizerModalProps): JSX.Element {
    const { customizerModalID, setCustomizerModalID } = props;

    const [sku, setSku] = useState<string | null>(null);

    const {
        query: { alpha3, language }
    } = useRouter();

    const translate = useTranslate();

    const productConfig = useProductConfig();

    const { setSelectedSku } = useContext(ProductContext);

    const pack = useMemo(() => {
        if (!productConfig || customizerModalID === null) return null;

        const pack = productConfig.packs[customizerModalID];

        if (!pack || pack.isDigital) return null;

        return pack;
    }, [productConfig, customizerModalID]);

    const firstAvailableVariant = useMemo(() => {
        if (!pack) return null;

        return pack.variants[0];
    }, [pack]);

    useEffect(() => {
        if (!sku && pack && firstAvailableVariant) {
            setSku(firstAvailableVariant.sku);
        }
    }, [sku, pack, firstAvailableVariant]);

    const selectedVariant = useVariant(sku);

    const availableOptions = useMemo(() => {
        if (!pack) return null;

        const options = new Map<string, VariantOption[]>();

        pack.variants.forEach(variant => {
            Object.entries(variant.options).forEach(([key, value]) => {
                if (!options.has(key)) {
                    options.set(key, [value]);
                }

                const optionExists = options
                    .get(key)
                    ?.find(
                        option => option.interOptionId === value.interOptionId
                    );

                if (optionExists) {
                    return;
                }

                options.get(key)?.push(value);
            });
        });

        return options;
    }, [pack]);

    const getSkuWithOption = useCallback(
        (optionName: string, interOptionId: number): string => {
            if (!pack || !selectedVariant) return "";

            const selectedVariantOptions = new Map<string, number>();

            Object.entries(selectedVariant.options).forEach(([key, value]) => {
                if (key === optionName) return;

                selectedVariantOptions.set(key, value.interOptionId);
            });

            const availableVariants = pack.variants.filter(variant => {
                const variantOptions = new Map<string, number>();

                Object.entries(variant.options).forEach(([key, value]) => {
                    if (key === optionName) return;

                    variantOptions.set(key, value.interOptionId);
                });

                return (
                    JSON.stringify([...variantOptions]) ===
                    JSON.stringify([...selectedVariantOptions])
                );
            });

            const availableVariant = availableVariants.find(
                variant =>
                    variant.options[optionName].interOptionId === interOptionId
            );

            return availableVariant ? availableVariant.sku : "";
        },
        [pack, selectedVariant]
    );

    const addToCart = useCallback((): void => {
        if (!selectedVariant) return;

        setSelectedSku(selectedVariant.sku);

        sendEvent(EVENTS.CATALOG_SELECT_PRODUCT, {
            sku,
            automatic: false
        });

        window.location.href = `/${alpha3}/${language}/create-account`;
    }, [alpha3, language, selectedVariant, setSelectedSku, sku]);

    return (
        <StyledModal
            fullPage
            isOpen={!!customizerModalID}
            setIsOpen={(isOpen: boolean): void =>
                setCustomizerModalID(isOpen ? customizerModalID : null)
            }
        >
            {selectedVariant && pack && (
                <div css={styles} data-testid="customizer">
                    <div className="header">
                        <div
                            className="title"
                            data-testid="product_title_label"
                        >
                            <T>{selectedVariant.name}</T>
                        </div>
                        <div
                            className="subtitle"
                            data-testid="product_subtitle_label"
                        >
                            {selectedVariant.price && (
                                <CurrencyFormatter>
                                    {selectedVariant.price}
                                </CurrencyFormatter>
                            )}
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
                    </div>
                    <div className="image-wrapper">
                        <Image
                            alt=""
                            src={selectedVariant.productImage}
                            data-testid="product_image_modal"
                            width={400}
                            height={400}
                            quality={90}
                            priority
                        />
                    </div>
                    <div
                        className="label"
                        data-testid="select_your_flavour_label"
                    >
                        <T>select_your_flavour</T>
                    </div>
                    <div className="picker">
                        {Array.from(availableOptions ?? []).map(option => (
                            <>
                                <div
                                    className="long"
                                    data-testid="unimate_flavour_label"
                                >
                                    <T>{option[0]}</T>
                                </div>
                                {option[1].map(_option => (
                                    <div
                                        className={clsx(
                                            "option",
                                            selectedVariant.options[option[0]]
                                                ?.interOptionId ===
                                                _option.interOptionId &&
                                                "selected",
                                            getSkuWithOption(
                                                option[0],
                                                _option.interOptionId
                                            ) === "" && "disabled"
                                        )}
                                        role="button"
                                        tabIndex={0}
                                        key={_option.interOptionId}
                                        onClick={(): void => {
                                            const sku = getSkuWithOption(
                                                option[0],
                                                _option.interOptionId
                                            );

                                            if (sku) setSku(sku);
                                        }}
                                        onKeyDown={(e): void => {
                                            if (
                                                e.key === "Enter" ||
                                                e.key === "Space"
                                            ) {
                                                const sku = getSkuWithOption(
                                                    option[0],
                                                    _option.interOptionId
                                                );

                                                if (sku) setSku(sku);
                                            }
                                        }}
                                        data-testid={`option_${_option.title}`}
                                    >
                                        <div
                                            className="option-button clickable"
                                            data-testid={`option_${_option.title}_button`}
                                        >
                                            <T>{_option.title}</T>

                                            {_option.description && (
                                                <div className="description">
                                                    <T>{_option.description}</T>
                                                </div>
                                            )}
                                        </div>
                                        {translate(_option.disclaimer) && (
                                            <div
                                                className="info"
                                                data-testid="option_info_label"
                                            >
                                                <T>{_option.disclaimer}</T>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </>
                        ))}
                    </div>
                    <div className="buttons">
                        <div
                            className="cancel"
                            role="button"
                            tabIndex={0}
                            onClick={(): void => setCustomizerModalID(null)}
                            onKeyDown={(e): void => {
                                if (e.key === "Enter" || e.key === "Space") {
                                    setCustomizerModalID(null);
                                }
                            }}
                            data-testid="product_modal_cancel_button"
                        >
                            <T>cancel</T>
                        </div>
                        <div
                            className="button-wrapper"
                            data-testid="product_get_button_modal"
                        >
                            <PrimaryButton onClick={addToCart}>
                                <T>continue</T>
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            )}
        </StyledModal>
    );
}

export default memo(CustomizerModal);
