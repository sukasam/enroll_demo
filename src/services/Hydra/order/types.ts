import { Alpha2 } from "Constants/countryConfig/enums";
import { Address } from "types/Address";
import { CustomerType } from "types/enums";

export enum TransactionType {
    AuthorizeAndCapture = "AuthorizeAndCapture",
    Capture = "Capture",
    IOU = "IOU"
}

export enum TransactionMethod {
    CreditCard = "CreditCard",
    CreditCardAlias = "CreditCardAlias",
    BankDraft = "BankDraft",
    BankWire = "BankWire",
    Cash = "Cash",
    PayPal = "PayPal",
    EWalletToken = "EWalletToken",
    SavedCreditCard = "SavedCreditCard",
    PayPal3ds = "Trust-PayPal",
    Klarna = "Klarna"
}

export type HumanName = {
    firstName?: string;
    lastName?: string;
    "fullName@en"?: string;
    fullName?: string;
};

export type BasePayment = HumanName & Partial<Address>;

export type BuildPaymentCC = BasePayment & {
    method: TransactionMethod.CreditCard;
    type: TransactionType.AuthorizeAndCapture;
    creditCardNumber: string;
    expiry: string;
    cvc: string;
    sessionId: string | never;
    bankName?: string;
};

export type BuildPaymentBankDraft = BasePayment & {
    method: TransactionMethod.BankDraft;
};

export type BuildPaymentBankWire = BasePayment & {
    method: TransactionMethod.BankWire;
};

export type BuildPaymentCash = BasePayment & {
    method: TransactionMethod.Cash;
    bankName?: string;
};

export type BuildPaymentPayPal = BasePayment & {
    method: TransactionMethod.PayPal;
};

export type BuildPaymentPayPal3ds = BasePayment & {
    method: TransactionMethod.PayPal3ds;
};

export type BuildPaymentKlarna = BasePayment & {
    method: TransactionMethod.Klarna;
};

export type BuildPayment =
    | BuildPaymentCC
    | BuildPaymentBankDraft
    | BuildPaymentBankWire
    | BuildPaymentCash
    | BuildPaymentPayPal
    | BuildPaymentPayPal3ds
    | BuildPaymentKlarna;

export type BuildShipping = BasePayment & {
    phone?: string;
    email: string;
};

export type CustomerObject = {
    mainAddress: Address;
    humanName: HumanName;
    type: CustomerType;
    taxTerms?: {
        taxId: string;
    };
    signature: {
        value: string;
    };
};

export type BuildOrderItem = {
    sku: string;
    qty: number;
};

export type BuildPayPal = BasePayment & {
    method: TransactionMethod.PayPal | TransactionMethod.PayPal3ds;
    ewalletToken: string;
    nonce: string;
    usePayPal3ds: boolean;
};

export type AddTransactionsProps = {
    payment: BuildPayment;
    paypal?: BuildPayPal;
    worldPaySessionId?: string;
};

export type BaseTransactionItem = {
    amount: string;
    type: TransactionType;
    method: TransactionMethod;
    billToEmail?: string;
    billToPhone?: string;
    billToAddress?: Address;
};

export type CreditCardTransactionItem = BaseTransactionItem & {
    method: TransactionMethod.CreditCard; // | TransactionMethod.CreditCardAlias;
    methodDetails: {
        payer: string;
        creditCardNumber?: string;
        alias?: string;
        creditCardExpires?: string;
        creditCardSecurityCode?: string;
        bankName?: string;
        branchName?: string;
    } & (
        | { sessionId: string; bankName: string; challengeWindowSize: string }
        | { sessionId?: never; challengeWindowSize?: never }
        | { bankName?: string }
    );
};

export type BankTransactionItem = BaseTransactionItem & {
    method: TransactionMethod.BankDraft | TransactionMethod.BankWire;
};

export type CashTransactionItem = BaseTransactionItem & {
    method: TransactionMethod.Cash;
    methodDetails: {
        bankName?: string;
    };
};

export type PayPalTransactionItem = BaseTransactionItem & {
    method: TransactionMethod.EWalletToken;
    methodDetails: {
        bankName: TransactionMethod.PayPal;
        ewalletToken: string;
        payer: string;
    };
};

export type PayPal3dsTransactionItem = BaseTransactionItem & {
    type: TransactionType.IOU;
    method: TransactionMethod.CreditCard;
    methodDetails: {
        bankName: TransactionMethod.PayPal3ds;
        payer: string;
    };
};

export type KlarnaTransactionItem = BaseTransactionItem & {
    method: TransactionMethod.Klarna;
    methodDetails: {
        payer: string;
        bankName: string;
        branchName: string;
        successURL?: string;
        pendingURL?: string;
        failureURL?: string;
        cancelURL?: string;
    };
};

export type TransactionItem =
    | CreditCardTransactionItem
    | BankTransactionItem
    | CashTransactionItem
    | PayPalTransactionItem
    | PayPal3dsTransactionItem
    | KlarnaTransactionItem;

export type OrderObject = {
    lines: {
        items: {
            item: {
                href: string;
            };
            quantity: number;
        }[];
    };
    shipTo: BuildShipping;
    customer: CustomerObject;
    shippingMethod: {
        href: string;
    };
    transactions: {
        items: TransactionItem[];
    };
    source: {
        agent: "Enroll";
        platform: string;
        medium: "Internet";
        version: string;
        market: Alpha2;
    };
};
