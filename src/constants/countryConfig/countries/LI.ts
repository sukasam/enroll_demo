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
    zipLength: null, // Auto config generator: Used default value
    taxIdPattern: undefined, // Auto config generator: Used default value
    taxInclusiveBackEnd: false,
    taxInclusiveFrontEnd: false,
    disableTaxId: false, // Auto config generator: Used default value
    hiddenShippingProvince: false,
    useQuotesToValidateAddress: false, // Auto config generator: Used default value
    paymentOptions: paymentOptionsConfig,
    hiddenPersonalData: true,
    useCookie: true
};

const config: CountryConfig = {
    alpha3: Alpha3.LIE,
    alpha2: Alpha2.LI,
    isSupported: false,
    name: "Liechtenstein",
    redirect: undefined,
    languages: [
        {
            code: "de",
            name: "Deutsch",
            default: true
        }
    ],
    marketExceptions
};

export default config;
