import { Alpha2, Alpha3, Currency, optInNotificationTypes } from "../enums";
import euConfig from "../euConfig";
import { CountryConfig, MarketExceptions, ProductConfig } from "../types";

const productConfig: ProductConfig = {
    ...euConfig.productConfig
};

const marketExceptions: MarketExceptions = {
    ...euConfig.marketExceptions,
    paymentOptions: {
        ...euConfig.marketExceptions.paymentOptions,
        hasPayPal: false
    },
    notificationType: optInNotificationTypes.EMAIL
};

const config: CountryConfig = {
    isSupported: true,
    ...euConfig,
    alpha3: Alpha3.CHE,
    alpha2: Alpha2.CH,
    name: "Switzerland - Schweiz",
    phonePrefix: "+41",
    currency: Currency.CHF,
    languages: [
        {
            code: "de",
            name: "Deutsch",
            default: true
        },
        {
            code: "en",
            name: "English",
            default: false
        },
        {
            code: "fr",
            name: "French",
            default: false
        }
        // {
        //     code: "it",
        //     name: "Italian",
        //     default: false
        // }
    ],
    marketExceptions,
    productConfig
};

export default config;
