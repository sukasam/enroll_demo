/** @jsxImportSource @emotion/react */

import clsx from "clsx";
import Spinner from "Components/shared/Spinner";
import T from "Components/shared/Translate";
import { VariantOption } from "Constants/countryConfig/types";
import { useProducts } from "Contexts/ProductContext";
import { Variant } from "Contexts/types/ProductContextTypes";
import Image from "next/image";
import { memo, useCallback, useEffect, useMemo } from "react";
import styles from "./styles";

interface VariantPickerProps {
    sku: string | null;
    setSku: (sku: string | null) => void;
}

function VariantPicker(props: VariantPickerProps): JSX.Element {
    const { sku, setSku } = props;
    const { ufgVariants } = useProducts();

    const tabImages = useMemo(
        () =>
            ufgVariants.reduce((acc, variant: Variant) => {
                if (variant.options.unimate_flavour) {
                    acc[variant.options.unimate_flavour.title] =
                        variant.tabImage.unimate;
                }
                if (variant.options.balance_pack) {
                    acc[variant.options.balance_pack.title] =
                        variant.tabImage.balance || "";
                }
                return acc;
            }, {} as Record<string, string>),
        [ufgVariants]
    );

    const firstAvailableVariant = useMemo(() => {
        if (!ufgVariants || ufgVariants.length === 0) return null;
        return ufgVariants[0];
    }, [ufgVariants]);

    useEffect(() => {
        if (sku === null && firstAvailableVariant) {
            setSku(firstAvailableVariant.sku);
        }
    }, [sku, firstAvailableVariant, setSku]);

    const selectedVariant = useMemo(() => {
        if (!ufgVariants || !firstAvailableVariant || !sku) return null;

        const relatedVariant = ufgVariants.find(variant => variant.sku === sku);

        return relatedVariant || firstAvailableVariant;
    }, [ufgVariants, sku, firstAvailableVariant]);

    const availableOptions = useMemo(() => {
        if (!ufgVariants) return null;

        const options = new Map<string, VariantOption[]>();

        ufgVariants.forEach(variant => {
            Object.entries(variant.options).forEach(([key, value]) => {
                const existingOptions = options.get(key) ?? [];
                if (
                    !existingOptions.some(
                        option => option.interOptionId === value.interOptionId
                    )
                ) {
                    options.set(key, [...existingOptions, value]);
                }
            });
        });

        return options;
    }, [ufgVariants]);

    const balanceOptions = useMemo(
        () => availableOptions?.get("balance_pack") || [],
        [availableOptions]
    );

    const unimateOptions = useMemo(
        () => availableOptions?.get("unimate_flavour") || [],
        [availableOptions]
    );

    const getSkuWithOption = useCallback(
        (optionName: string, interOptionId: number): string => {
            if (!ufgVariants || !selectedVariant) return "";

            const selectedVariantOptions = new Map<string, number>();

            Object.entries(selectedVariant.options).forEach(([key, value]) => {
                if (key === optionName) return;

                selectedVariantOptions.set(key, value.interOptionId);
            });

            const availableVariants = ufgVariants.filter(variant => {
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
                    variant.options[optionName]?.interOptionId === interOptionId
            );

            return availableVariant ? availableVariant.sku : "";
        },
        [ufgVariants, selectedVariant]
    );

    function hasLimitedVariantInRow(
        index: number,
        options: VariantOption[],
        option: VariantOption
    ): boolean {
        // First row should be ignored
        if (index < 2) {
            return false;
        }

        if (option.limitedColor) {
            return true;
        }

        const besideElement = options[index + (index % 2 === 0 ? 1 : -1)];

        if (!besideElement) {
            return false;
        }

        if (besideElement.limitedColor) {
            return true;
        }

        return false;
    }

    if (!availableOptions?.size) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <></>;
    }

    if (!selectedVariant) {
        return <Spinner />;
    }
    return (
        <div css={styles}>
            <div className="picker">
                <div className="packs-container">
                    <div className="balance-container">
                        <div
                            className="productType-label"
                            data-testid="balance_flavour_label"
                        >
                            <span className="label-title">
                                <T>Balance: </T>
                            </span>
                            <span className="selected-option">
                                {selectedVariant.options.balance_pack?.title}
                            </span>
                        </div>
                        {balanceOptions.map((option, index) => (
                            <div
                                className={clsx(
                                    "option",
                                    selectedVariant.options.balance_pack
                                        ?.interOptionId ===
                                        option.interOptionId && "selected",
                                    getSkuWithOption(
                                        "balance_pack",
                                        option.interOptionId
                                    ) === "" && "disabled",
                                    option.limitedColor && "limited",
                                    hasLimitedVariantInRow(
                                        index,
                                        balanceOptions,
                                        option
                                    ) && "margin"
                                )}
                                role="button"
                                id={`option_${option.title}`}
                                tabIndex={0}
                                key={option.interOptionId}
                                onClick={(): void => {
                                    const sku = getSkuWithOption(
                                        "balance_pack",
                                        option.interOptionId
                                    );

                                    if (sku) setSku(sku);
                                }}
                                onKeyDown={(e): void => {
                                    if (
                                        e.key === "Enter" ||
                                        e.key === "Space"
                                    ) {
                                        const sku = getSkuWithOption(
                                            "balance_pack",
                                            option.interOptionId
                                        );

                                        if (sku) setSku(sku);
                                    }
                                }}
                                data-testid={`option_${option.title}`}
                            >
                                {option.limitedColor && (
                                    <div
                                        className="limited-flag"
                                        style={
                                            {
                                                "--color-limited":
                                                    option.limitedColor
                                            } as React.CSSProperties
                                        }
                                    >
                                        <T>limited_edition</T>
                                    </div>
                                )}
                                <div
                                    className="option-button clickable"
                                    data-testid={`option_${option.title}_button`}
                                >
                                    <div className="image-wrapper">
                                        <Image
                                            className="option-image"
                                            src={
                                                tabImages
                                                    ? tabImages[option.title]
                                                    : "/unicity.svg"
                                            }
                                            alt={option.title}
                                            width={70}
                                            height={70}
                                            quality={85}
                                            style={{
                                                width: "100%",
                                                height: "auto",
                                                objectFit: "contain"
                                            }}
                                        />
                                    </div>
                                    {option.description && (
                                        <div className="description">
                                            <T>{option.description}</T>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="unimate-container">
                        <div
                            className="productType-label"
                            data-testid="unimate_flavour_label"
                        >
                            <div className="label-title">
                                <T>Unimate: </T>
                            </div>
                            <span className="selected-option">
                                {selectedVariant.options.unimate_flavour?.title}
                            </span>
                        </div>
                        {unimateOptions.map((option, index) => (
                            <div
                                className={clsx(
                                    "option",
                                    selectedVariant.options.unimate_flavour
                                        ?.interOptionId ===
                                        option.interOptionId && "selected",
                                    getSkuWithOption(
                                        "unimate_flavour",
                                        option.interOptionId
                                    ) === "" && "disabled",
                                    option.limitedColor && "limited",
                                    hasLimitedVariantInRow(
                                        index,
                                        unimateOptions,
                                        option
                                    ) && "margin"
                                )}
                                role="button"
                                id={`option_${option.title}`}
                                tabIndex={0}
                                key={option.interOptionId}
                                onClick={(): void => {
                                    const sku = getSkuWithOption(
                                        "unimate_flavour",
                                        option.interOptionId
                                    );

                                    if (sku) setSku(sku);
                                }}
                                onKeyDown={(e): void => {
                                    if (
                                        e.key === "Enter" ||
                                        e.key === "Space"
                                    ) {
                                        const sku = getSkuWithOption(
                                            "unimate_flavour",
                                            option.interOptionId
                                        );

                                        if (sku) setSku(sku);
                                    }
                                }}
                                data-testid={`option_${option.title}`}
                            >
                                {option.limitedColor && (
                                    <div
                                        className="limited-flag"
                                        style={
                                            {
                                                "--color-limited":
                                                    option.limitedColor
                                            } as React.CSSProperties
                                        }
                                    >
                                        <T>limited_edition</T>
                                    </div>
                                )}
                                <div
                                    className="option-button clickable"
                                    data-testid={`option_${option.title}_button`}
                                >
                                    <div className="image-wrapper">
                                        <Image
                                            className="option-image"
                                            src={
                                                tabImages
                                                    ? tabImages[option.title]
                                                    : "/unicity.svg"
                                            }
                                            alt={option.title}
                                            width={70}
                                            height={70}
                                            quality={85}
                                            style={{
                                                width: "100%",
                                                height: "auto",
                                                objectFit: "contain"
                                            }}
                                        />
                                    </div>
                                    {option.description && (
                                        <div className="description">
                                            <T>{option.description}</T>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(VariantPicker);
