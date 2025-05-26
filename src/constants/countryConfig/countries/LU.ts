import { Alpha2, Alpha3, optInNotificationTypes } from "../enums";
import euConfig from "../euConfig";
import { CountryConfig, MarketExceptions, ProductConfig } from "../types";

const productConfig: ProductConfig = {
    ...euConfig.productConfig
};

const marketExceptions: MarketExceptions = {
    ...euConfig.marketExceptions,
    notificationType: optInNotificationTypes.EMAIL,
    zipPattern: /^(?:[Ll]\s*-\s*\d{4}|\d{4})$/,
    zipLength: [4, 8]
};

const config: CountryConfig = {
    isSupported: true,
    ...euConfig,
    alpha3: Alpha3.LUX,
    alpha2: Alpha2.LU,
    name: "Luxembourg - Lëtzebuerg",
    phonePrefix: "+352",
    languages: [
        {
            code: "fr",
            name: "French",
            default: true
        },
        {
            code: "en",
            name: "English",
            default: false
        },
        {
            code: "de",
            name: "Deutsch",
            default: false
        }
        // {
        //     code: "nl",
        //     name: "Dutch",
        //     default: false
        // }
    ],
    marketExceptions,
    productConfig
};

export default config;
