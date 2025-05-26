import { TransactionMethod } from "Services/Hydra/order/types";

import {
    ReactElement,
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

import useOrderCalculations from "./hooks/OrderCalculations";
import { useProducts } from "./ProductContext";

import {
    AddressType,
    BankWireInfo,
    CashPaymentInfo,
    EventDetails,
    OrderContextType,
    OrderResult,
    PayPalInfo,
    PaymentMethod,
    ShippingMethodQuoteType
} from "./types/OrderContextTypes";

const defaultOrderContext: OrderContextType = {
    orderResult: null,
    setOrderResult: () => null,
    shippingMethodQuotes: [],
    setShippingMethodQuotes: () => [],
    selectedShippingMethod: null,
    setSelectedShippingMethod: () => null,
    selectedPaymentMethod: null,
    setSelectedPaymentMethod: () => null,
    shipToAddress: null,
    setShipToAddress: () => null,
    signedTerms: false,
    setSignedTerms: () => false,
    userSignature: null,
    setUserSignature: () => null,
    taxId: "",
    setTaxId: () => null,
    secondaryTaxId: "",
    setSecondaryTaxId: () => null,
    paymentMethod: null,
    setPaymentMethod: () => null,
    billingAddress: null,
    setBillingAddress: () => null,
    signatureDateTimeStamp: null,
    setSignatureDateTimeStamp: () => null,
    payPal: null,
    setPayPal: () => null,
    cashPayment: null,
    setCashPayment: () => null,
    bankWire: null,
    setBankWire: () => null,
    isShipToOffice: false,
    setIsShipToOffice: () => false,
    isCreditCardPaymentValid: false,
    setIsCreditCardPaymentValid: () => false,
    selectedWillCallAddress: null,
    setSelectedWillCallAddress: () => null,
    pickUpAddressKey: null,
    setPickUpAddressKey: () => null,
    tppPayload: null,
    setTppPayload: () => null,
    isDigitalOnlyOrder: false,
    feedbackSubmitted: false,
    setFeedbackSubmitted: () => false,
    isEnrollmentCompleted: false,
    setIsEnrollmentCompleted: () => false
};

const OrderContext = createContext<OrderContextType>(defaultOrderContext);
OrderContext.displayName = "Order Context";

export function OrderProvider({
    children,
    testValues
}: {
    children: ReactNode;
    testValues?: Record<string, string>;
}): ReactElement {
    const { shoppingCart } = useProducts();
    const [orderResult, setOrderResult] = useState<OrderResult | null>(
        defaultOrderContext.orderResult
    );
    const [shippingMethodQuotes, setShippingMethodQuotes] = useState<
        ShippingMethodQuoteType[]
    >(defaultOrderContext.shippingMethodQuotes);
    const [selectedShippingMethod, setSelectedShippingMethod] =
        useState<ShippingMethodQuoteType | null>(
            defaultOrderContext.selectedShippingMethod
        );
    const [selectedPaymentMethod, setSelectedPaymentMethod] =
        useState<TransactionMethod | null>(
            defaultOrderContext.selectedPaymentMethod
        );
    const [shipToAddress, setShipToAddress] = useState<AddressType | null>(
        defaultOrderContext.shipToAddress
    );
    const [signedTerms, setSignedTerms] = useState<boolean>(
        defaultOrderContext.signedTerms
    );
    const [userSignature, setUserSignature] = useState<string | null>(
        defaultOrderContext.userSignature
    );
    const [taxId, setTaxId] = useState<string>(defaultOrderContext.taxId);
    const [secondaryTaxId, setSecondaryTaxId] = useState<string>(
        defaultOrderContext.secondaryTaxId
    );
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
        null
    );
    const [billingAddress, setBillingAddress] = useState<AddressType | null>(
        defaultOrderContext.billingAddress
    );
    const [signatureDateTimeStamp, setSignatureDateTimeStamp] =
        useState<Date | null>(defaultOrderContext.signatureDateTimeStamp);
    const [payPal, setPayPal] = useState<PayPalInfo | null>(
        defaultOrderContext.payPal
    );
    const [cashPayment, setCashPayment] = useState<CashPaymentInfo | null>(
        defaultOrderContext.cashPayment
    );
    const [bankWire, setBankWire] = useState<BankWireInfo | null>(
        defaultOrderContext.bankWire
    );
    const [isShipToOffice, setIsShipToOffice] = useState<boolean>(false);
    const [isCreditCardPaymentValid, setIsCreditCardPaymentValid] =
        useState<boolean>(defaultOrderContext.isCreditCardPaymentValid);
    const [selectedWillCallAddress, setSelectedWillCallAddress] = useState<
        string | null
    >(null);
    const [pickUpAddressKey, setPickUpAddressKey] = useState<string | null>(
        defaultOrderContext.pickUpAddressKey
    );
    const [tppPayload, setTppPayload] = useState<EventDetails | null>(null);

    const { isDigitalOnlyOrder } = useOrderCalculations(shoppingCart);

    const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

    const [isEnrollmentCompleted, setIsEnrollmentCompleted] =
        useState<boolean>(false);

    const loadCachedOrderData = (): void => {
        const cachedData = sessionStorage.getItem("orderContext");
        if (cachedData) {
            const parsedData: OrderContextType = JSON.parse(cachedData);
            setOrderResult(parsedData.orderResult);
            setShippingMethodQuotes(parsedData.shippingMethodQuotes);
            setSelectedShippingMethod(parsedData.selectedShippingMethod);
            setSelectedPaymentMethod(parsedData.selectedPaymentMethod);
            setShipToAddress(parsedData.shipToAddress);
            setSignedTerms(parsedData.signedTerms);
            setUserSignature(parsedData.userSignature);
            setTaxId(parsedData.taxId);
            setSecondaryTaxId(parsedData.secondaryTaxId);
            setPaymentMethod(parsedData.paymentMethod);
            setBillingAddress(parsedData.billingAddress);
            setSignatureDateTimeStamp(parsedData.signatureDateTimeStamp);
            setPayPal(parsedData.payPal);
            setCashPayment(parsedData.cashPayment);
            setBankWire(parsedData.bankWire);
            setIsShipToOffice(parsedData.isShipToOffice);
            setIsCreditCardPaymentValid(parsedData.isCreditCardPaymentValid);
            setSelectedWillCallAddress(parsedData.selectedWillCallAddress);
            setPickUpAddressKey(parsedData.pickUpAddressKey);
            setTppPayload(parsedData.tppPayload);
            setFeedbackSubmitted(parsedData.feedbackSubmitted);
            setIsEnrollmentCompleted(parsedData.isEnrollmentCompleted);
        }
    };

    useEffect(() => {
        loadCachedOrderData();
    }, []);

    const updateCachedOrderData = useCallback((): void => {
        const dataToCache = {
            orderResult,
            shippingMethodQuotes,
            selectedShippingMethod,
            selectedPaymentMethod,
            shipToAddress,
            signedTerms,
            taxId,
            secondaryTaxId,
            paymentMethod,
            userSignature,
            billingAddress,
            signatureDateTimeStamp,
            payPal,
            cashPayment,
            bankWire,
            isShipToOffice,
            isCreditCardPaymentValid,
            selectedWillCallAddress,
            pickUpAddressKey,
            tppPayload,
            feedbackSubmitted,
            isEnrollmentCompleted
        };
        sessionStorage.setItem("orderContext", JSON.stringify(dataToCache));
    }, [
        orderResult,
        shippingMethodQuotes,
        selectedShippingMethod,
        selectedPaymentMethod,
        shipToAddress,
        signedTerms,
        taxId,
        secondaryTaxId,
        paymentMethod,
        userSignature,
        billingAddress,
        signatureDateTimeStamp,
        payPal,
        cashPayment,
        bankWire,
        isShipToOffice,
        isCreditCardPaymentValid,
        selectedWillCallAddress,
        pickUpAddressKey,
        tppPayload,
        feedbackSubmitted,
        isEnrollmentCompleted
    ]);

    useEffect(() => {
        updateCachedOrderData();
    }, [updateCachedOrderData]);

    const value = useMemo(
        () => ({
            orderResult,
            setOrderResult,
            shippingMethodQuotes,
            setShippingMethodQuotes,
            selectedShippingMethod,
            setSelectedShippingMethod,
            selectedPaymentMethod,
            setSelectedPaymentMethod,
            shipToAddress,
            setShipToAddress,
            signedTerms,
            setSignedTerms,
            taxId,
            setTaxId,
            secondaryTaxId,
            setSecondaryTaxId,
            paymentMethod,
            setPaymentMethod,
            userSignature,
            setUserSignature,
            billingAddress,
            setBillingAddress,
            signatureDateTimeStamp,
            setSignatureDateTimeStamp,
            payPal,
            setPayPal,
            cashPayment,
            setCashPayment,
            bankWire,
            setBankWire,
            isShipToOffice,
            setIsShipToOffice,
            isCreditCardPaymentValid,
            setIsCreditCardPaymentValid,
            selectedWillCallAddress,
            setSelectedWillCallAddress,
            pickUpAddressKey,
            setPickUpAddressKey,
            tppPayload,
            setTppPayload,
            feedbackSubmitted,
            setFeedbackSubmitted,
            isDigitalOnlyOrder,
            isEnrollmentCompleted,
            setIsEnrollmentCompleted
        }),
        [
            orderResult,
            shippingMethodQuotes,
            selectedShippingMethod,
            selectedPaymentMethod,
            shipToAddress,
            signedTerms,
            taxId,
            secondaryTaxId,
            paymentMethod,
            userSignature,
            billingAddress,
            signatureDateTimeStamp,
            payPal,
            cashPayment,
            bankWire,
            isShipToOffice,
            isCreditCardPaymentValid,
            selectedWillCallAddress,
            pickUpAddressKey,
            tppPayload,
            feedbackSubmitted,
            isDigitalOnlyOrder,
            isEnrollmentCompleted
        ]
    );

    const providerValue = useMemo(
        () => ({
            ...value,
            ...testValues
        }),
        [value, testValues]
    );

    return (
        <OrderContext.Provider value={providerValue}>
            {children}
        </OrderContext.Provider>
    );
}

export const useOrder = (): OrderContextType => useContext(OrderContext);
