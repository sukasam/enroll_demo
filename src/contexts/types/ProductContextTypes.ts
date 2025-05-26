import { Currency } from "Constants/countryConfig/enums";
import { CustomerType } from "Types/enums";

export type ProductImage = {
    styles: {
        large: string;
        medium: string;
        original: string;
        thumbnail: string;
    };
};

export type ProductLink = {
    title: string;
    url: string;
    type: string;
};

export type ProductMeta = {
    key: string;
    value: string;
};

export type ProductContent = {
    name: string;
    description: string;
    images: ProductImage[];
    links: ProductLink[];
    meta: ProductMeta[];
};

export type ProductPartsCount = {
    unit: string;
    value: string;
};

export type ProductPriceLevel = {
    currency: Currency;
    cvEach: number;
    discountEach: {
        amount: number;
    };
    item: {
        catalogSlide: {
            description: string;
        };
        dimesnionsEach: {
            depth: number;
            height: number;
            width: number;
            unit: string;
        };
        href: string;
        id: {
            unicity: string;
        };
        taxedAs: string;
    };
    priceEach: number;
    pvEach: number;
    quantity: number;
    tax: {
        categoryDescription: string;
    };
    taxEach: {
        amount: number;
    };
    taxInclusive?: number;
    taxablePriceEach: number;
};

// We'll need to adjust optional parameters for this type
export type Product = {
    content: ProductContent;
    item: {
        id: {
            unicity: string;
        };
        href: string;
        partsCount: ProductPartsCount[];
    };
    priceLevels: {
        [key in CustomerType]?: ProductPriceLevel;
    };
    terms: ProductPriceLevel;
    name: string;
    description: string;
};

// export type OptionDetails = {
//     interOptionId: number;
//     title: string;
//     limitedColor?: string;
// };

// export type ProductOptions = {
//     unimate_flavour?: OptionDetails;
//     balance_pack?: OptionDetails;
// };

export type VariantOption = {
    // Id within option to distinguish between values. Each option has its own set of ids.
    interOptionId: number;
    title: string;
    description?: string;
    disclaimer?: string;
    limitedColor?: string;
    image?: string;
};

export type Variant = {
    sku: string;
    name: string;
    description: string;
    productImage: any; // string | null;
    partsCount: string;
    tabImage: any;
    // {
    //     unimate: string | null;
    //     balance: string | null;
    // };
    options: {
        [key: string]: VariantOption;
    };
    price: number;
    rrp: number;
    language?: string;
    isDigital?: boolean;
    availableLanguages?: string[];
};

// #region Pack Types
export type PackPerk = {
    icon: string;
    perk: string;
};

export type PackExtra = {
    icon: string;
    title: string;
    description: string;
};

export type PackProduct = {
    image: string;
    title: string;
    description: string;
};

export type DigitalPack = {
    buttonName: string;
    description: string;
    showPaymentType: boolean;
};

export type FeelGreatPack = {
    benefits: string[];
    accentColor: string;
    buttonName: string;
    kitDescription: string;
    backgroundColor: string;
    perks: PackPerk[];
    extras: PackExtra[];
    products?: PackProduct[];
    annotations: string;
    showPaymentType: boolean;
};
// #endregion Pack Types

export type ProductContextType = {
    selectedSku: string | null;
    setSelectedSku: (sku: string | null) => void;
    shoppingCart: Variant[];
    setShoppingCart: (products: Variant[] | null) => void;
    products: Product[];
    setProducts: (products: Product[]) => void;
    mappedProducts: Variant[];
    setMappedProducts: (products: Variant[]) => void;
    href: string | null;
    setHref: (href: string | null) => void;
    availableDigitalGuideVariant: Variant | null;
    digitalVariants: Variant[];
    ufgVariants: Variant[];
    digitalPack: DigitalPack | null;
    feelGreatPack: FeelGreatPack | null;
    recommendedPack: number | null;
    noPurchaseVariantData: Variant[];
};

export type ProductlHooksType = {
    availableDigitalGuideVariant: Variant | null;
    digitalVariants: Variant[];
    ufgVariants: Variant[];
    digitalPack: DigitalPack | null;
    feelGreatPack: FeelGreatPack | null;
    recommendedPack: number | null;
};
