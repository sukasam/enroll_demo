/** @jsxImportSource @emotion/react */
import { useTheme } from "@mui/material";
import T from "Components/shared/Translate";
import { useProducts } from "Contexts/ProductContext";
import { Variant } from "Contexts/types/ProductContextTypes";
import { useMemo } from "react";
import styles from "./styles";

export default function Catalog(): JSX.Element | null {
    const theme = useTheme();
    const { shoppingCart } = useProducts();

    const selectedUFGProduct: Variant | null = useMemo(
        () =>
            shoppingCart?.find(
                product =>
                    product?.options && Object.keys(product.options).length > 0
            ) || null,
        [shoppingCart]
    );

    const selectedDigitalProduct: Variant | null = useMemo(
        () => shoppingCart?.find(product => product?.isDigital) || null,
        [shoppingCart]
    );

    const unimateFlavor: string = useMemo(
        () => selectedUFGProduct?.options?.unimate_flavour?.title || "n/a",
        [selectedUFGProduct]
    );

    const balanceFlavor: string = useMemo(
        () => selectedUFGProduct?.options?.balance_pack?.title || "n/a",
        [selectedUFGProduct]
    );

    if (selectedUFGProduct) {
        return (
            <div
                css={styles.catalogContainer(theme)}
                data-testid="catalog_unimate_flavor"
            >
                <div>
                    <T>catalog_unimate_flavor</T> {unimateFlavor}
                </div>
                <div>
                    <T>catalog_balance_flavor</T> {balanceFlavor}
                </div>
            </div>
        );
    }

    if (selectedDigitalProduct) {
        return (
            <div data-testid="catalog_digital_product">
                <T>catalog_basic_distributor_only</T>
            </div>
        );
    }

    return null;
}
