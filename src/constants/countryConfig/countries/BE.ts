import { Alpha2, Alpha3, optInNotificationTypes } from "../enums";
import euConfig from "../euConfig";
import { CountryConfig, MarketExceptions, ProductConfig } from "../types";

const productConfig: ProductConfig = {
    ...euConfig.productConfig
};

const marketExceptions: MarketExceptions = {
    ...euConfig.marketExceptions,
    notificationType: optInNotificationTypes.EMAIL,
    zipLength: 4,
    zipPattern: /^\d{4}$/,
    paymentOptions: {
        ...euConfig.marketExceptions.paymentOptions,
        hasKlarna: true
    }
};

const config: CountryConfig = {
    isSupported: true,
    ...euConfig,
    alpha3: Alpha3.BEL,
    alpha2: Alpha2.BE,
    name: "Belgium - Belgique / België",
    phonePrefix: "+32",
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
