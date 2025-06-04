import { Alpha2, Alpha3, optInNotificationTypes } from "../enums";
import euConfig from "../euConfig";
import { CountryConfig, MarketExceptions, ProductConfig } from "../types";

const productConfig: ProductConfig = {
    ...euConfig.productConfig
};

const marketExceptions: MarketExceptions = {
    ...euConfig.marketExceptions,
    zipLength: 5,
    zipPattern: /^\d{5}$/,
    notificationType: optInNotificationTypes.EMAIL,
    paymentOptions: {
        ...euConfig.marketExceptions.paymentOptions,
        hasKlarna: true
    }
};

const config: CountryConfig = {
    isSupported: true,
    ...euConfig,
    alpha3: Alpha3.DEU,
    alpha2: Alpha2.DE,
    name: "Germany - Deutschland",
    phonePrefix: "+49",
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
