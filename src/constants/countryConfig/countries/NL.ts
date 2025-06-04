import { Alpha2, Alpha3, optInNotificationTypes } from "../enums";
import euConfig from "../euConfig";
import { CountryConfig, MarketExceptions, ProductConfig } from "../types";

const productConfig: ProductConfig = {
    ...euConfig.productConfig
};

const marketExceptions: MarketExceptions = {
    ...euConfig.marketExceptions,
    paymentOptions: {
        ...euConfig.marketExceptions.paymentOptions,
        hasPayPal: false,
        hasKlarna: true
    },
    zipLength: 7,
    zipPattern: /^\d{4} ?[A-Z]{2}$/,
    notificationType: optInNotificationTypes.EMAIL
};

const config: CountryConfig = {
    isSupported: true,
    ...euConfig,
    alpha3: Alpha3.NLD,
    alpha2: Alpha2.NL,
    name: "Netherlands - Nederland",
    phonePrefix: "+31",
    languages: [
        // {
        //     code: "nl",
        //     name: "Dutch",
        //     default: true
        // },
        {
            code: "en",
            name: "English",
            default: true // false
        }
    ],
    marketExceptions,
    productConfig
};

export default config;
