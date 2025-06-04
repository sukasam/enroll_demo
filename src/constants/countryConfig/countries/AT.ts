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
    alpha3: Alpha3.AUT,
    alpha2: Alpha2.AT,
    name: "Austria - Österreich",
    phonePrefix: "+43",
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
        }
    ],
    marketExceptions,
    productConfig
};

export default config;
