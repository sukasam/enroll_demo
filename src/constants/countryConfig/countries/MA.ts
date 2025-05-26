import { Alpha2, Alpha3 } from "../enums";
import { CountryConfig, MarketExceptions, PaymentOptions } from "../types";

const paymentOptionsConfig: PaymentOptions = {
    hasPayPal: false,
    hasCash: false,
    hasBankWire: false,
    hasCreditCard: false,
    hasSavedCreditCard: false
};

const marketExceptions: MarketExceptions = {
    zipLength: 5,
    taxIdPattern: undefined, // Auto config generator: Used default value
    taxInclusiveBackEnd: false,
    taxInclusiveFrontEnd: false,
    disableTaxId: false, // Auto config generator: Used default value
    hiddenShippingProvince: false,
    useQuotesToValidateAddress: false, // Auto config generator: Used default value
    paymentOptions: paymentOptionsConfig
};

const config: CountryConfig = {
    alpha3: Alpha3.MAR,
    alpha2: Alpha2.MA,
    isSupported: false,
    name: "Morocco - Maroc",
    redirect: "https://ushop-link.unicity.com/mena/enroll",
    languages: [
        {
            code: "en",
            name: "English",
            default: true
        },
        {
            code: "ar",
            name: "Arabic",
            default: false
        }
    ],
    marketExceptions
};

export default config;
