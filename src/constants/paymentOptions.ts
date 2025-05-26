import { TransactionMethod } from "Hydra/order/types";

type PaymentOptionItem = {
    imageSrc: string;
    optionLabel: string;
    transactionMethod: TransactionMethod;
    testIdPrefix: string;
    mixpanelName: string;
};

const paymentOptions = [
    {
        imageSrc: "/credit-card.svg",
        optionLabel: "payment_credit_card_option",
        transactionMethod: TransactionMethod.CreditCard,
        testIdPrefix: "option_credit_card",
        mixpanelName: "credit_card"
    },
    {
        imageSrc: "/credit-card.svg",
        optionLabel: "payment_saved_card_ending",
        transactionMethod: TransactionMethod.CreditCardAlias,
        testIdPrefix: "option_saved_credit_card",
        mixpanelName: "credit_card_alias"
    },
    {
        imageSrc: "/paypal.svg",
        optionLabel: "payment_paypal",
        transactionMethod: TransactionMethod.PayPal,
        testIdPrefix: "option_paypal",
        mixpanelName: "paypal"
    },
    {
        imageSrc: "/cash.svg",
        optionLabel: "payment_cash_payment",
        transactionMethod: TransactionMethod.Cash,
        testIdPrefix: "option_cash",
        mixpanelName: "cash"
    },
    {
        imageSrc: "/bankwire.svg",
        optionLabel: "payment_bank_wire",
        transactionMethod: TransactionMethod.BankWire,
        testIdPrefix: "option_bankwire",
        mixpanelName: "bank_wire"
    },
    {
        imageSrc: "/klarna.svg",
        optionLabel: "payment_klarna",
        transactionMethod: TransactionMethod.Klarna,
        testIdPrefix: "option_klarna",
        mixpanelName: "klarna"
    }
];

export default paymentOptions;
export type { PaymentOptionItem };
