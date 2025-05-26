import { Variant } from "Constants/countryConfig/types";
import getVariantBySku from "Services/utils/getVariantBySku";
import { useEffect, useState } from "react";
import useProductConfig from "./useProductConfig";

function useVariant(sku?: string | null): Variant | null {
    const [variant, setVariant] = useState<Variant | null>(null);

    const productConfig = useProductConfig();

    useEffect(() => {
        const variant = getVariantBySku(
            productConfig,
            sku,
            productConfig?.recommendedPack
        );

        setVariant(variant);
    }, [productConfig, sku]);

    return variant;
}

export default useVariant;
