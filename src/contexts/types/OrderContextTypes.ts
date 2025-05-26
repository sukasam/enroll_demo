import { Alpha2 } from "Constants/countryConfig/enums";
import { TransactionMethod, TransactionType } from "Services/Hydra/order/types";

export type ShippingMethodQuoteType = {
    market: Alpha2;
    type: string;
    location: string;
    productPrice?: string;
    shipping?: string;
    subtotal?: string;
    tax?: string;
    orderTotal?: string;
};

export type CreditCardPayment = {
    type: "CreditCard";
    creditCardNumber: string;
    expiry: string;
    cvc: string;
    name: string;
};

export type CashPaymentInfo = {
    amount: string;
    type: TransactionType.Capture;
    method: TransactionMethod.Cash;
};

export type BankWireInfo = {
    amount: string;
    type: TransactionType.Capture;
    method: TransactionMethod.BankWire;
};

export type PayPalPayment = {
    type: "PayPal";
    firstName: string;
    lastName: string;
};

export type PayPalInfo = {
    nonce?: string;
    firstName: string;
    lastName: string;
    usePayPal3ds: boolean;
};

export type BankTransferPayment = {
    type: "bankTransfer";
    accountNumber: string;
    bankCode: string;
};

export type PaymentMethod =
    | CreditCardPayment
    | PayPalPayment
    | BankTransferPayment;

export type AddressType = {
    name: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: Alpha2;
};

export type EventDetails = {
    id?: {
        unicity: string;
    };
    error?: {
        error: number;
        // eslint-disable-next-line camelcase
        error_code: string;
        // eslint-disable-next-line camelcase
        error_message: string;
    };
    url?: string;
};

export type OrderResult = {
    id: {
        unicity: string;
    };
    currency: string;
    customer: {
        id: {
            unicity: string;
        };
        email: string;
        coapplicant?: {
            details?: {
                humanName: {
                    firstName: string;
                    lastName: string;
                };
            };
        };
        businessEntity?: {
            companyName?: string;
        };
    };
    shipToEmail: string;
    lines: {
        items: {
            item: {
                id: {
                    unicity: string;
                };
            };
            terms: {
                price: number;
            };
        }[];
    };
    terms: {
        discount?: {
            amount: number;
        };
        subtotal: number;
        freight: {
            amount: number;
        };
        tax: {
            amount: number;
        };
        total: number;
    };
    shipToName: {
        firstName: string;
        lastName: string;
    };
    shipToAddress: {
        address1: string;
        address2: string;
        city: string;
        country: Alpha2;
        state: string;
        zip: string;
    };
    transactions: {
        items: {
            method: string;
            methodDetails: {
                challengeHTML: string;
                creditCardNumberMasked?: string;
                iouReceipt: {
                    url: string;
                };
                hostedPaymentPageUrl: string;
            };
        }[];
    };
    shippingMethod: {
        type: string;
    };
    challengeHTML: string;
    payPall3dsUrl: string;
    klarnaRedirectUrl?: string;
    externalRedirect?: boolean;
};

export type OrderState = {
    orderResult: OrderResult | null;
    shippingMethodQuotes: ShippingMethodQuoteType[];
    selectedShippingMethod: ShippingMethodQuoteType | null;
    selectedPaymentMethod: TransactionMethod | null;
    shipToAddress: AddressType | null;
    billingAddress: AddressType | null;
};

export type OrderContextType = {
    orderResult: OrderResult | null;
    setOrderResult: React.Dispatch<React.SetStateAction<OrderResult | null>>;
    shippingMethodQuotes: ShippingMethodQuoteType[];
    setShippingMethodQuotes: React.Dispatch<
        React.SetStateAction<ShippingMethodQuoteType[]>
    >;
    selectedShippingMethod: ShippingMethodQuoteType | null;
    setSelectedShippingMethod: React.Dispatch<
        React.SetStateAction<ShippingMethodQuoteType | null>
    >;
    selectedPaymentMethod: TransactionMethod | null;
    setSelectedPaymentMethod: React.Dispatch<
        React.SetStateAction<TransactionMethod | null>
    >;
    shipToAddress: AddressType | null;
    setShipToAddress: React.Dispatch<React.SetStateAction<AddressType | null>>;
    billingAddress: AddressType | null;
    setBillingAddress: React.Dispatch<React.SetStateAction<AddressType | null>>;
    signedTerms: boolean;
    setSignedTerms: React.Dispatch<React.SetStateAction<boolean>>;
    taxId: string;
    setTaxId: React.Dispatch<React.SetStateAction<string>>;
    secondaryTaxId: string;
    setSecondaryTaxId: React.Dispatch<React.SetStateAction<string>>;
    paymentMethod: PaymentMethod | null;
    setPaymentMethod: React.Dispatch<
        React.SetStateAction<PaymentMethod | null>
    >;
    userSignature: string | null;
    setUserSignature: React.Dispatch<React.SetStateAction<string | null>>;
    signatureDateTimeStamp: Date | null;
    setSignatureDateTimeStamp: React.Dispatch<
        React.SetStateAction<Date | null>
    >;
    payPal: PayPalInfo | null;
    setPayPal: (info: PayPalInfo) => void;
    bankWire: BankWireInfo | null;
    setBankWire: (info: BankWireInfo) => void;
    cashPayment: CashPaymentInfo | null;
    setCashPayment: (info: CashPaymentInfo) => void;
    isShipToOffice: boolean;
    setIsShipToOffice: React.Dispatch<React.SetStateAction<boolean>>;
    isCreditCardPaymentValid: boolean;
    setIsCreditCardPaymentValid: React.Dispatch<React.SetStateAction<boolean>>;
    selectedWillCallAddress: string | null;
    setSelectedWillCallAddress: React.Dispatch<
        React.SetStateAction<string | null>
    >;
    pickUpAddressKey: string | null;
    setPickUpAddressKey: React.Dispatch<React.SetStateAction<string | null>>;
    tppPayload: EventDetails | null;
    setTppPayload: React.Dispatch<React.SetStateAction<EventDetails | null>>;
    isDigitalOnlyOrder: boolean;
    feedbackSubmitted: boolean;
    setFeedbackSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    isEnrollmentCompleted: boolean;
    setIsEnrollmentCompleted: (value: boolean) => void;
};

export type OrderHooksType = {
    isDigitalOnlyOrder: boolean;
};
