import { useTranslate } from "Components/shared/Translate";
import { useCountryConfig } from "Constants/countryConfig";
import { Pack } from "Constants/countryConfig/types";
import { useTranslations } from "Contexts/translation";
import {
    DigitalPack,
    FeelGreatPack,
    Product,
    ProductlHooksType,
    Variant
} from "Contexts/types/ProductContextTypes";
import { ProductImage } from "Types/Product";
import { useMemo } from "react";

function getProductImage(
    productImages: ProductImage[],
    imageName: string
): string | null {
    const filteredImages = productImages.filter(productImage =>
        productImage.styles.original?.includes(`enroll2_${imageName}`)
    );

    return filteredImages.length > 0
        ? filteredImages[0].styles.original
        : productImages[0]?.styles.original;
}

function isProductDigital(product: Product): boolean {
    return product.content.meta.some(
        meta => meta.key === "product_type" && meta.value === "registration_fee"
    );
}

function getLanguages(product: Product): string[] {
    return product.content.meta
        .filter(meta => meta.key === "language")
        .map(meta => meta.value);
}

function getLanguage(product: Product, targetLanguage: string): string {
    const languages = getLanguages(product);

    return languages.includes(targetLanguage)
        ? targetLanguage
        : languages[0] || targetLanguage;
}

function parseOptions(product: Product): any {
    return JSON.parse(
        product.content.meta.find(meta => meta.key === "enroll_options")
            ?.value ?? "{}"
    );
}

// types: CompletePack | CompleteDigitalPack
function mapProductToVariants(
    product: Product,
    defaultLanguage: string,
    productName: string,
    productDescription: string
): Variant {
    return {
        sku: product.item.id.unicity,
        name: productName,
        description: productDescription,
        partsCount: product.item.partsCount[0]?.value,
        tabImage: {
            unimate: getProductImage(product.content.images, "unimate"),
            balance: getProductImage(product.content.images, "balance")
        },
        productImage: getProductImage(product.content.images, "main"),
        options: parseOptions(product),
        price:
            product.priceLevels?.Member?.priceEach ||
            product.terms?.priceEach ||
            0,
        rrp:
            product.priceLevels?.Customer?.priceEach ||
            product.terms?.priceEach,
        isDigital: isProductDigital(product),
        language: getLanguage(product, defaultLanguage),
        availableLanguages: getLanguages(product)
    };
}

export default function useProductCalculations(
    shoppingCart: Variant[],
    products: Product[]
): ProductlHooksType {
    const { language } = useTranslations();
    const translate = useTranslate();

    const countryConfig = useCountryConfig();

    const digitalVariants: Variant[] = useMemo(() => {
        const _digitalProducts = products.filter(product =>
            isProductDigital(product)
        );
        const _digitalVariants = _digitalProducts.map(product =>
            mapProductToVariants(
                product,
                language,
                "catalog_get_basic_only",
                "catalog_basic_distributor_description"
            )
        );
        return _digitalVariants;
    }, [products, language]);

    const availableDigitalGuideVariant: Variant | null = useMemo(
        () =>
            digitalVariants.find(variant =>
                variant.availableLanguages?.includes(language)
            ) || null,
        [language, digitalVariants]
    );

    const ufgVariants: Variant[] = useMemo(
        () =>
            products
                .filter(product =>
                    product.content.meta.some(
                        meta => meta.key === "enroll_options"
                    )
                )
                .map(product =>
                    mapProductToVariants(
                        product,
                        language,
                        "catalog_business_builder",
                        "right_column_description"
                    )
                ),
        [products, language]
    );

    const digitalPack: DigitalPack | null = useMemo(() => {
        if (!countryConfig) return null;

        const digitalOnlyPacks = countryConfig.productConfig.packs.filter(
            pack => pack.isDigital
        );

        return digitalOnlyPacks.length > 0
            ? (digitalOnlyPacks[0] as DigitalPack)
            : null;
    }, [countryConfig]);

    const feelGreatPack: FeelGreatPack | null = useMemo(() => {
        if (!countryConfig) return null;

        const ufgOnlyPacks = countryConfig.productConfig.packs.filter(
            pack => !pack.isDigital
        ) as Pack[];

        const ufgOnlyPacksMapped = ufgOnlyPacks.map(pack => ({
            ...pack,
            benefits: pack.mainFeatures.map(mainFeature =>
                translate(mainFeature)
            )
        }));

        return ufgOnlyPacksMapped.length > 0
            ? (ufgOnlyPacksMapped[0] as FeelGreatPack)
            : null;
    }, [countryConfig, translate]);

    const recommendedPack: number | null = useMemo(
        () => countryConfig?.productConfig?.recommendedPack || null,
        [countryConfig]
    );

    return {
        digitalVariants,
        availableDigitalGuideVariant,
        ufgVariants,
        digitalPack,
        feelGreatPack,
        recommendedPack
    };
}
