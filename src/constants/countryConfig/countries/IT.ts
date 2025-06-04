import { Alpha2, Alpha3, optInNotificationTypes } from "../enums";
import euConfig from "../euConfig";
import { CountryConfig, MarketExceptions, ProductConfig } from "../types";

const productConfig: ProductConfig = {
    ...euConfig.productConfig
};

const marketExceptions: MarketExceptions = {
    ...euConfig.marketExceptions,
    notificationType: optInNotificationTypes.EMAIL,
    zipLength: 5,
    zipPattern: /^\d{5}$/,
    paymentOptions: {
        ...euConfig.marketExceptions.paymentOptions,
        hasKlarna: true
    }
};

const config: CountryConfig = {
    isSupported: true,
    ...euConfig,
    alpha3: Alpha3.ITA,
    alpha2: Alpha2.IT,
    name: "Italy - Italia",
    phonePrefix: "+39",
    languages: [
        // {
        //     code: "it",
        //     name: "Italian",
        //     default: true
        // },
        {
            code: "en",
            name: "English",
            default: true // false
        },
        {
            code: "de",
            name: "Deutsch",
            default: false
        }
    ],
    marketExceptions,
    productConfig
};

export default config;
