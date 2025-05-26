import { useTranslate } from "Components/shared/Translate";
import { useCountryConfig } from "Constants/countryConfig";
import { CompleteProductConfig } from "Constants/countryConfig/types";
import { useProducts } from "Contexts/ProductContext";
import { useTranslations } from "Contexts/translation";
import { Product, ProductImage } from "Types/Product";
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

function findDigitalProduct(
    products: Product[],
    language?: string
): Product | undefined {
    return products.find(product => {
        const isDigital = product.content.meta.some(
            meta =>
                meta.key === "product_type" && meta.value === "registration_fee"
        );
        const matchesLanguage =
            language &&
            product.content.meta.some(
                meta => meta.key === "language" && meta.value === language
            );

        return isDigital && (!language || matchesLanguage);
    });
}

function getDigitalProducts(
    products: Product[],
    language: string,
    translate: any
): Product[] {
    const product =
        findDigitalProduct(products, language) ||
        findDigitalProduct(products, "en") ||
        findDigitalProduct(products);
    if (product) {
        product.name = translate("basic_name");
        product.description = translate("basic_description");
        return [product];
    }
    return [];
}

function getPhysicalProducts(products: Product[], translate: any): Product[] {
    return products
        .filter(product =>
            product.content.meta.some(meta => meta.key === "enroll_options")
        )
        .map(product => ({
            ...product,
            name: translate("catalog_modal_business_builder_name"),
            description: translate("catalog_modal_business_builder_name")
        }));
}

function parseOptions(product: Product): any {
    return JSON.parse(
        product.content.meta.find(meta => meta.key === "enroll_options")
            ?.value ?? "{}"
    );
}

function mapPackToVariants(pack: any, products: Product[]): any {
    return {
        ...pack,
        variants: products.map(product => ({
            sku: product.item.id.unicity,
            name: product.name,
            description: product.description,
            partsCount: product.item.partsCount[0]?.value,
            tabImage: {
                unimate: getProductImage(product.content.images, "unimate"),
                balance: getProductImage(product.content.images, "balance")
            },
            productImage: getProductImage(product.content.images, "main"),
            options: pack.isDigital ? {} : parseOptions(product),
            price:
                product.priceLevels?.Member?.priceEach ||
                product.terms?.priceEach,
            rrp:
                product.priceLevels?.Customer?.priceEach ||
                product.terms?.priceEach
        }))
    };
}

function useProductConfig(): CompleteProductConfig | null {
    const translate = useTranslate();
    const { language } = useTranslations();
    const { products } = useProducts();
    const countryConfig = useCountryConfig();

    const productConfig = useMemo(() => {
        if (!countryConfig || !countryConfig.productConfig) return null;

        const {
            productConfig: { recommendedPack, packs }
        } = countryConfig;

        const mappedPacks = packs.map(pack => {
            const availableProducts = pack.isDigital
                ? getDigitalProducts(products, language, translate)
                : getPhysicalProducts(products, translate);

            return mapPackToVariants(pack, availableProducts);
        });

        return { recommendedPack, packs: mappedPacks } as CompleteProductConfig;
    }, [countryConfig, products, language, translate]);

    return productConfig;
}

export default useProductConfig;
