import { Alpha2, Alpha3 } from "../enums";
import {
    CountryConfig,
    MarketExceptions,
    PaymentOptions,
    ProductConfig
} from "../types";

const productConfig: ProductConfig = {
    recommendedPack: null,
    packs: []
};

const paymentOptionsConfig: PaymentOptions = {
    hasPayPal: false,
    hasCash: false,
    hasBankWire: false,
    hasCreditCard: false,
    hasSavedCreditCard: false
};

const marketExceptions: MarketExceptions = {
    zipLength: 5,
    taxIdPattern: undefined,
    taxInclusiveBackEnd: true,
    taxInclusiveFrontEnd: false,
    showStatesField: false,
    hasSecondaryTaxId: true,
    secondaryTaxIdData: [{ label: "TC" }],
    disableTaxId: false,
    hiddenShippingProvince: true,
    useQuotesToValidateAddress: false,
    hasCommissionPaymentOptions: true,
    paymentOptions: paymentOptionsConfig
};

const config: CountryConfig = {
    alpha3: Alpha3.TUR,
    alpha2: Alpha2.TR,
    isSupported: true,
    productConfig,
    marketExceptions,
    name: "Turkey",
    languages: [
        {
            code: "tr",
            name: "Turkish",
            default: true
        },
        {
            code: "en",
            name: "English",
            default: false
        }
    ],
    dateFormat: "DMY",
    currency: null,
    paymentLogos: [],
    isNoPurchaseMarket: true
};

export default config;
