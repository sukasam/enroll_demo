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
    zipLength: 4,
    taxIdPattern: /^[0-9]{9}$/,
    taxInclusiveBackEnd: true,
    taxInclusiveFrontEnd: false,
    disableTaxId: false, // Auto config generator: Used default value
    hiddenShippingProvince: false,
    useQuotesToValidateAddress: false, // Auto config generator: Used default value
    paymentOptions: paymentOptionsConfig
};

const config: CountryConfig = {
    alpha3: Alpha3.AUS,
    alpha2: Alpha2.AU,
    isSupported: false,
    name: "Australia",
    redirect: "https://ushop-link.unicity.com/australia/enroll",
    languages: [
        {
            code: "en",
            name: "English",
            default: true
        }
    ],
    marketExceptions
};

export default config;
