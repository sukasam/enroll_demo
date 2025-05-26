/** @jsxImportSource @emotion/react */
import { useTheme } from "@mui/material";
import TextField from "Components/shared/Form/components/TextField";
import { useTranslate } from "Components/shared/Translate";
import { useCountryConfig } from "Constants/countryConfig";
import { useOrder } from "Contexts/OrderContext";
import { useUser } from "Contexts/UserContext";
import { useEffect, useState } from "react";
import Cards from "react-credit-cards-2";
import { FormProvider, useForm } from "react-hook-form";
import PaymentMethodLogos from "./components/PaymentMethodLogos";
import styles from "./styles";
import createValidationRules from "./validationRules";

type FocusState = "name" | "number" | "expiry" | "cvc" | undefined;
type FormValues = {
    creditCardNumber: string;
    expiry: string;
    cvc: string;
    name: string;
};

export default function CreditCard(): JSX.Element {
    const [focused] = useState<FocusState>(undefined);
    const { userData } = useUser();
    const { setPaymentMethod, setIsCreditCardPaymentValid, billingAddress } =
        useOrder();
    const translate = useTranslate();
    const theme = useTheme();
    const countryConfig = useCountryConfig();

    const validationRules = createValidationRules(countryConfig);

    const form = useForm<FormValues>({
        defaultValues: {
            creditCardNumber: "",
            expiry: "",
            cvc: "",
            name: userData?.fullName || ""
        },
        mode: "onBlur"
    });

    const {
        watch,
        setValue,
        formState: { isValid, isDirty }
    } = form;

    const handleCreditCardNumberChange = (value: string): void => {
        let newValue = value.replace(/\D/g, "");

        const isAmex = /^3[47]/.test(newValue);

        let formattedValue = newValue;

        if (isAmex) {
            newValue = newValue.slice(0, 15);
            const groups = newValue.match(/^(\d{1,4})(\d{1,6})?(\d{1,5})?/);
            formattedValue = groups
                ? [groups[1], groups[2], groups[3]].filter(Boolean).join(" ")
                : newValue;
        } else {
            newValue = newValue.slice(0, 16);
            const groups = newValue.match(/.{1,4}/g);
            formattedValue = groups ? groups.join(" ") : newValue;
        }

        setValue("creditCardNumber", formattedValue, { shouldValidate: true });
    };

    const handleExpiryChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const { value } = event.target;
        let newValue = value.replace(/\D/g, "");

        const previousValue = event.target.defaultValue;

        if (
            previousValue.length > value.length &&
            previousValue.includes("/") &&
            !value.includes("/")
        ) {
            newValue = newValue.slice(0, newValue.length - 1);
        }

        if (newValue.length > 2) {
            newValue = `${newValue.slice(0, 2)}/${newValue.slice(2, 4)}`;
        } else if (newValue.length === 2) {
            newValue = `${newValue}/`;
        }

        setValue("expiry", newValue, { shouldValidate: true });
    };

    const creditCardNumber = watch("creditCardNumber");
    const expiry = watch("expiry");
    const cvc = watch("cvc");
    const name = watch("name");

    useEffect(() => {
        const [expireMonth, expireYear] = expiry.split("/");
        const newCreditCardNumber = creditCardNumber.replace(/\s/g, "");

        setPaymentMethod({
            type: "CreditCard",
            creditCardNumber: newCreditCardNumber,
            expiry: expiry ? `20${expireYear}-${expireMonth}` : "",
            cvc,
            name
        });
    }, [creditCardNumber, expiry, cvc, name, setPaymentMethod]);

    useEffect(() => {
        const allFieldsFilled = creditCardNumber && expiry && cvc && name;

        if (allFieldsFilled && isValid) {
            setIsCreditCardPaymentValid(true);
            return;
        }
        setIsCreditCardPaymentValid(false);
    }, [
        creditCardNumber,
        expiry,
        cvc,
        name,
        isValid,
        setIsCreditCardPaymentValid
    ]);

    const getFormValue = (field: keyof FormValues): string => {
        if (field === "name" && billingAddress?.name) {
            return billingAddress.name;
        }
        if (isDirty) {
            return form.getValues(field) || "";
        }
        return "";
    };

    return (
        <div>
            <div css={styles.paymentMethodLogos(theme)}>
                <PaymentMethodLogos />
            </div>
            <div css={styles.creditCardContainer(theme)}>
                <FormProvider {...form}>
                    <form css={styles.formContainer(theme)}>
                        <TextField
                            css={styles.creditCardNumber(theme)}
                            label={translate("payment_card_number")}
                            data-testid="payment_expiration"
                            type="text"
                            name="creditCardNumber"
                            rules={validationRules.creditCardNumber}
                            onChange={(e): void =>
                                handleCreditCardNumberChange(e.target.value)
                            }
                        />
                        <div css={styles.row(theme)}>
                            <TextField
                                css={styles.formField(theme)}
                                label={translate("payment_expiration")}
                                data-testid="payment_expiration"
                                type="text"
                                name="expiry"
                                rules={validationRules.expiry}
                                onChange={handleExpiryChange}
                            />
                            <TextField
                                css={styles.formField(theme)}
                                label={translate("payment_security_code")}
                                data-testid="payment_security_code"
                                type="number"
                                name="cvc"
                                rules={validationRules.cvc}
                            />
                        </div>
                        <TextField
                            css={styles.name}
                            label="Name"
                            type="text"
                            name="name"
                            rules={{ required: "This field is required" }}
                            hidden
                        />
                    </form>
                </FormProvider>
                <div
                    css={styles.cardContainer(theme)}
                    className="dd-privacy-hidden"
                    data-testid="credit_card_container"
                >
                    <div css={styles.cardStyles(theme)}>
                        <Cards
                            number={getFormValue("creditCardNumber")}
                            expiry={getFormValue("expiry")}
                            cvc={getFormValue("cvc")}
                            name={getFormValue("name")}
                            focused={focused}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
