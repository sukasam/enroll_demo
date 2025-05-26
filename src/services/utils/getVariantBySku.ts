import { CompleteProductConfig, Variant } from "Constants/countryConfig/types";

function getVariantBySku(
    productConfig: CompleteProductConfig | null,
    sku?: string | null,
    defaultSkuIndex = -1
): Variant | null {
    if (!productConfig) {
        return null;
    }

    const physicalProducts = productConfig.packs.filter(
        pack => !pack.isDigital
    );
    const variants = physicalProducts.map(pack => pack.variants).flat();
    const selectedVariant = variants.find(variant => variant.sku === sku);

    if (selectedVariant) return selectedVariant;
    if (defaultSkuIndex > -1 && defaultSkuIndex < variants.length)
        return variants[defaultSkuIndex];
    return null;
}

export default getVariantBySku;
