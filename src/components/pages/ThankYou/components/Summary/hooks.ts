import { useOrder } from "Contexts/OrderContext";
import { useProducts } from "Contexts/ProductContext";
import { useUser } from "Contexts/UserContext";
import { getFullName } from "Services/utils/fullName";
import creditCardType from "credit-card-type";
import { CreditCardType } from "credit-card-type/dist/types";
import { useEffect, useState } from "react";

export interface ProductDetails {
    price?: number;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
}

export interface AccountDetails {
    distributorId?: string;
    email: string;
    coapplicant?: string | null;
    sponsor?: string | null;
    orderNumber?: string;
    receiptEmail?: string;
}

export interface AddressDetails {
    fullName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
}

export interface PaymentDetails {
    method: string;
    cardNumber?: string;
}

export interface OrderDetails {
    product: ProductDetails | null;
    accountDetails: AccountDetails | null;
    address: AddressDetails | null;
    payment: PaymentDetails | null;
    shippingMethod: string;
    cardInfo: CreditCardType[];
}

// eslint-disable-next-line import/prefer-default-export
export function useOrderDetails(): OrderDetails {
    const { orderResult } = useOrder();
    const { selectedSku, products } = useProducts();
    const { sponsorFullName } = useUser();

    const [product, setProduct] = useState<ProductDetails | null>(null);
    const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(
        null
    );
    const [address, setAddress] = useState<AddressDetails | null>(null);
    const [payment, setPayment] = useState<PaymentDetails | null>(null);
    const [shippingMethod, setShippingMethod] = useState("");
    const [cardInfo, setCardInfo] = useState<CreditCardType[]>([]);

    useEffect(() => {
        if (!orderResult) return;
        const _accountDetails = {
            distributorId: orderResult.customer.id.unicity,
            email: orderResult.shipToEmail,
            coapplicant: orderResult.customer?.coapplicant?.details?.humanName
                ? getFullName(
                      orderResult.customer.coapplicant.details.humanName
                  )
                : orderResult.customer?.businessEntity?.companyName ?? null,
            sponsor: sponsorFullName,
            orderNumber: orderResult.id.unicity,
            receiptEmail: orderResult.shipToEmail
        };

        setAccountDetails(_accountDetails);

        const _product = {
            price: orderResult.lines.items.find(
                item => item.item.id.unicity === selectedSku
            )?.terms?.price,
            subtotal: orderResult.terms.discount?.amount
                ? orderResult.terms.subtotal - orderResult.terms.discount.amount
                : orderResult.terms.subtotal,
            shipping: orderResult.terms.freight.amount,
            tax: orderResult.terms.tax.amount,
            total: orderResult.terms.total
        };

        setProduct(_product);

        const _address = {
            fullName: getFullName(orderResult.shipToName),
            address1: orderResult.shipToAddress.address1,
            address2: orderResult.shipToAddress.address2,
            city: orderResult.shipToAddress.city,
            state: orderResult.shipToAddress.state,
            zip: orderResult.shipToAddress.zip
        };

        setAddress(_address);

        const _payment = {
            method: orderResult.transactions.items[0].method,
            cardNumber:
                orderResult.transactions.items[0].methodDetails
                    .creditCardNumberMasked
        };

        setPayment(_payment);

        setShippingMethod(orderResult.shippingMethod.type);

        if (_payment.cardNumber) {
            setCardInfo(creditCardType(_payment.cardNumber));
        }
    }, [orderResult, products, selectedSku]);

    return {
        product,
        accountDetails,
        address,
        payment,
        shippingMethod,
        cardInfo
    };
}
