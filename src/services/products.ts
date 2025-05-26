import { Product } from "types/Product";

type PriceLevel<T> = T & {
    priceEach: number;
    taxEach: {
        amount: number;
    };
    taxInclusive: number | null;
};

interface TaxologyProps<T> {
    marketExceptions?: {
        taxInclusiveFrontEnd?: boolean;
        taxInclusiveBackEnd?: boolean;
    };
    priceLevel: PriceLevel<T>;
}

export function taxology<T>(props: TaxologyProps<T>): PriceLevel<T> {
    const { marketExceptions = {}, priceLevel } = props;

    const { taxInclusiveFrontEnd = false, taxInclusiveBackEnd = false } =
        marketExceptions;

    if (taxInclusiveFrontEnd) {
        priceLevel.taxInclusive =
            priceLevel.priceEach + priceLevel.taxEach.amount;
    } else if (taxInclusiveBackEnd) {
        priceLevel.taxInclusive = priceLevel.priceEach;
    } else {
        priceLevel.taxInclusive = null;
    }

    return priceLevel;
}

export function getProductBySKU(
    sku: string,
    products: Product[]
): Product | undefined {
    return products.find(product => product.item.id.unicity === sku);
}
