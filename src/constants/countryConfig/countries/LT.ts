import { Alpha2, Alpha3, optInNotificationTypes } from "../enums";
import euConfig from "../euConfig";
import { CountryConfig, MarketExceptions, ProductConfig } from "../types";

const marketExceptions: MarketExceptions = {
    ...euConfig.marketExceptions,
    paymentOptions: {
        ...euConfig.marketExceptions.paymentOptions,
        hasPayPal: false,
        hasCreditCard: false
    },
    notificationType: optInNotificationTypes.EMAIL,
    useWorldPay: false,
    zipLength: [5, 8],
    zipPattern: /^(LT-)?\d{5}$/
};

const productConfig: ProductConfig = {
    ...euConfig.productConfig
};

const config: CountryConfig = {
    ...euConfig,
    isSupported: true,
    alpha3: Alpha3.LTU,
    alpha2: Alpha2.LT,
    name: "Lithuania - Lietuva",
    phonePrefix: "+370",
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
