/** @jsxImportSource @emotion/react */
import { useTranslate } from "Components/shared/Translate";
import { PaymentOptionItem } from "Constants/paymentOptions";

import { TransactionMethod } from "Hydra/order/types";
import PaymentOption from "./components/PaymentOption";

interface PaymentMethodOptionsProps {
    onSelectMethod: (method: TransactionMethod) => void;
    paymentOptions: PaymentOptionItem[];
}

function PaymentMethodOptions({
    onSelectMethod,
    paymentOptions
}: PaymentMethodOptionsProps): JSX.Element {
    const translate = useTranslate();

    return (
        <div>
            {paymentOptions.map(option => (
                <div key={option.testIdPrefix}>
                    <PaymentOption
                        hasOption
                        imageSrc={option.imageSrc}
                        optionLabel={translate(option.optionLabel)}
                        selectMethod={(): void =>
                            onSelectMethod(option.transactionMethod)
                        }
                        testIdPrefix={option.testIdPrefix}
                        mixpanelName={option.mixpanelName}
                    />
                </div>
            ))}
        </div>
    );
}

export default PaymentMethodOptions;
