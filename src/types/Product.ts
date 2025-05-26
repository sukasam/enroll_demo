import { Currency } from "Constants/countryConfig/enums";
import { CustomerType } from "./enums";

export type ProductImage = {
    styles: {
        original: string | null;
        thumbnail: string | null;
        medium: string | null;
        large: string | null;
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
