import { Alpha2, Alpha3, optInNotificationTypes } from "../enums";
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
    zipPattern: /^[1-9][0-9]{5}$/,
    taxIdPattern: /^[A-Z0-9]{10}$/,
    taxInclusiveBackEnd: false,
    taxInclusiveFrontEnd: false,
    hasSecondaryTaxId: true,
    secondaryTaxIdData: [{ label: "PAN" }],
    disableTaxId: false, // Auto config generator: Used default value
    hiddenShippingProvince: false,
    useQuotesToValidateAddress: false, // Auto config generator: Used default value
    paymentOptions: paymentOptionsConfig,
    notificationType: optInNotificationTypes.EMAIL
};

const config: CountryConfig = {
    isSupported: true,
    productConfig,
    alpha3: Alpha3.IND,
    alpha2: Alpha2.IN,
    name: "India",
    languages: [
        {
            code: "en",
            name: "English",
            default: true
        }
    ],
    dateFormat: "DMY",
    currency: null,
    paymentLogos: [],
    isNoPurchaseMarket: true,
    marketExceptions
};

export default config;
