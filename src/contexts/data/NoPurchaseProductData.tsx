import { Variant } from "Contexts/types/ProductContextTypes";

const name = "Unicity Distributor Only No Purchase";
const description = `<p>${name}</p>\n`;
const unicityId = "00000";

const noPurchaseVariantData = {
    sku: unicityId,
    name,
    description,
    productImage: null,
    tabImage: null,
    options: {},
    price: 0,
    rrp: 0,
    language: "en",
    isDigital: true
} as Variant;

export default [noPurchaseVariantData] as Variant[];
