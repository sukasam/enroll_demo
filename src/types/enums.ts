// eslint-disable-next-line import/prefer-default-export
export enum CustomerType {
    MEMBER = "Member",
    ASSOCIATE = "Associate",
    CUSTOMER = "Customer"
}

export enum PaymentType {
    CreditCard = "credit_card",
    CreditCardAlias = "credit_card_alias",
    PayPal = "paypal",
    PayPal3ds = "paypal_3ds",
    Cash = "cash",
    BankWire = "bankwire",
    BankDraft = "bank_draft",
    EWalletToken = "ewallet_token",
    SavedCreditCard = "saved_credit_card"
}

export enum MixpanelPaymentMethod {
    CreditCard = "credit_card",
    CreditCardWorldPay = "credit_card_worldpay",
    PayPal3ds = "paypal_3ds",
    PayPal = "paypal",
    Cash = "cash",
    BankWire = "bankwire"
}
