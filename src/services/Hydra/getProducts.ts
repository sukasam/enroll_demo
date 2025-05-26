import { getCountryConfig } from "Constants/countryConfig";
import { Alpha2 } from "Constants/countryConfig/enums";
import { taxology } from "Services/products";
import httpTools from "Shared/httpTools.js";
import { Product } from "types/Product";
import { CustomerType } from "types/enums";

interface GetProductProps {
    alpha2: Alpha2;
    customerType?: CustomerType;
    language: string;
}

const getProducts = async (props: GetProductProps): Promise<Product[]> => {
    const { alpha2, customerType = "Member", language } = props;
    const catalogLocale = `${language}-${alpha2}`;
    const req = {
        method: "GET",
        url: `/api/catalog/shop?catalog=${alpha2}%20Enrollment&market=${alpha2}&language=${language}&customer=${customerType}&priceLevels=Customer,Member,Associate`,
        withAuth: false,
        baseURL: "jeeves",
        headers: {
            "Accept-Language": catalogLocale
        }
    };

    // TODO: Fix when httpTools are ported to TS
    const res = await httpTools.sendRequest(req);

    const countryConfig = getCountryConfig(alpha2, true);

    // TODO: Define better type for response
    res.catalogSlides = res.catalogSlides.map(
        (product: { priceLevels?: object }) => {
            const productClone = { ...product };
            if (!product.priceLevels) {
                productClone.priceLevels = {};
                return product;
            }

            productClone.priceLevels = Object.entries(
                product.priceLevels
            ).reduce((acc: Record<string, never>, [i, pl]) => {
                acc[i] = taxology({
                    marketExceptions: countryConfig?.marketExceptions,
                    priceLevel: pl
                }) as never;
                return acc;
            }, {});

            return product;
        }
    );

    return res;
};

export default getProducts;
