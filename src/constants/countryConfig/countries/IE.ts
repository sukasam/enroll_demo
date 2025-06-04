import { Alpha2, Alpha3, optInNotificationTypes } from "../enums";
import euConfig from "../euConfig";
import { CountryConfig, MarketExceptions, ProductConfig } from "../types";

const productConfig: ProductConfig = {
    ...euConfig.productConfig
};

const marketExceptions: MarketExceptions = {
    ...euConfig.marketExceptions,
    zipLength: [7, 8],
    zipPattern: /^[a-zA-Z0-9]{3}[ -]?[a-zA-Z0-9]{4}$/,
    notificationType: optInNotificationTypes.EMAIL,
    paymentOptions: {
        ...euConfig.marketExceptions.paymentOptions,
        hasKlarna: true
    }
};

const config: CountryConfig = {
    isSupported: true,
    ...euConfig,
    alpha3: Alpha3.IRL,
    alpha2: Alpha2.IE,
    name: "Ireland - Éire",
    phonePrefix: "+353",
    languages: [
        {
            code: "en",
            name: "English",
            default: true
        }
    ],
    marketExceptions,
    productConfig
};

export default config;
