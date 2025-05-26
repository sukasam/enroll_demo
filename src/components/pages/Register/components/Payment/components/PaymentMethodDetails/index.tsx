/** @jsxImportSource @emotion/react */
import { Grow } from "@mui/material";
import BankWire from "Components/pages/Register/components/Payment/components/BankWire";
import BillingForm from "Components/pages/Register/components/Payment/components/BillingForm";
import CashPayment from "Components/pages/Register/components/Payment/components/CashPayment";
import CreditCardComponent from "Components/pages/Register/components/Payment/components/CreditCardComponent";
import Klarna from "Components/pages/Register/components/Payment/components/Klarna";
import PayPal from "Components/pages/Register/components/Payment/components/PayPal";
import { TransactionMethod } from "Hydra/order/types";

interface PaymentMethodDetailsProps {
    selectedPaymentMethod: string | null;
}

export default function PaymentMethodDetails({
    selectedPaymentMethod
}: PaymentMethodDetailsProps): JSX.Element | null {
    const renderPaymentContent = (): JSX.Element | null => {
        if (selectedPaymentMethod === TransactionMethod.CreditCard) {
            return (
                <>
                    <CreditCardComponent />
                    <BillingForm />
                </>
            );
        }
        if (selectedPaymentMethod === TransactionMethod.PayPal) {
            return <PayPal />;
        }
        if (selectedPaymentMethod === TransactionMethod.Cash) {
            return <CashPayment />;
        }
        if (selectedPaymentMethod === TransactionMethod.BankWire) {
            return <BankWire />;
        }
        if (selectedPaymentMethod === TransactionMethod.Klarna) {
            return <Klarna />;
        }
        return null;
    };

    return (
        <div>
            <Grow
                key={selectedPaymentMethod}
                in={selectedPaymentMethod !== null}
                {...(selectedPaymentMethod ? { timeout: 400 } : {})}
            >
                <div>{renderPaymentContent()}</div>
            </Grow>
        </div>
    );
}
