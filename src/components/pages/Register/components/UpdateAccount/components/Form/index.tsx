/** @jsxImportSource @emotion/react */
import PhoneNumberField from "Components/shared/Form/components/PhoneNumberField";
import TextField from "Components/shared/Form/components/TextField";
import { useTranslate } from "Components/shared/Translate";
import { useUser } from "Contexts/UserContext";

import showToast from "Components/shared/ShowToaster";
import updateCustomer from "Hydra/updateCustomer";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styles from "./styles";
import validationRules from "./validationRules";

interface FormValues {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
}

type UpdateAccountFormProps = {
    setIsLoading: (loading: boolean) => void;
    isLoading: boolean;
};

function UpdateAccountForm({
    setIsLoading,
    isLoading
}: UpdateAccountFormProps): JSX.Element {
    const {
        userData,
        isLoggedIn,
        userToken,
        href,
        setUserData,
        goToNextSection
    } = useUser();
    const translate = useTranslate();

    const formatPhoneNumber = (phoneNumber: string): string => {
        const cleanedNumber = phoneNumber.replace(/\D/g, "");

        return `+${cleanedNumber}`;
    };

    const form = useForm<FormValues>({
        mode: "onTouched",
        defaultValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: ""
        }
    });

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        watch
    } = form;

    useEffect(() => {
        if (isLoggedIn) {
            setValue(
                "phoneNumber",
                formatPhoneNumber(userData?.phoneNumber || "")
            );
            setValue("email", userData?.email || "");
            setValue("firstName", userData?.firstName || "");
            setValue("lastName", userData?.lastName || "");
        }
    }, [isLoggedIn, userData, setValue]);

    const phoneNumber = watch("phoneNumber");

    const shouldUpdate = useMemo(
        () => phoneNumber !== formatPhoneNumber(userData?.phoneNumber || ""),
        [phoneNumber, userData, formatPhoneNumber]
    );

    const updateCustomerFromForm = async (data: FormValues): Promise<void> => {
        try {
            if (!shouldUpdate) {
                goToNextSection();
                return;
            }

            setIsLoading(true);
            const userResponse = await updateCustomer(
                { mobilePhone: data.phoneNumber },
                href || "",
                userToken || ""
            );
            if (userResponse && userData) {
                setUserData({
                    ...userData,
                    phoneNumber:
                        userResponse.mobilePhone || userData.phoneNumber
                });
            } else {
                throw new Error("Failed to update user data");
            }
            showToast(
                translate("notification_success_account_updated"),
                "success"
            );
            setIsLoading(false);
            goToNextSection();
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred";
            showToast(translate(errorMessage), "error");
            setIsLoading(false);
        }
    };

    const onSubmit = (data: FormValues): void => {
        updateCustomerFromForm(data);
    };
    return (
        <div css={styles}>
            <FormProvider {...form}>
                <form
                    className="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <div className="formRow">
                        <TextField
                            label={translate("create_account_first_name")}
                            name="firstName"
                            rules={validationRules.firstName}
                            type="text"
                            data-testid="create_account_first_name"
                            disabled
                        />
                        <TextField
                            label={translate("create_account_last_name")}
                            name="lastName"
                            rules={validationRules.lastName}
                            type="text"
                            data-testid="create_account_last_name"
                            disabled
                        />
                    </div>
                    <div className="formRow phoneNumberRow">
                        <PhoneNumberField
                            className="phoneNumberField"
                            label={translate("create_account_phone_number")}
                            name="phoneNumber"
                            rules={validationRules.phoneNumber}
                            error={errors.phoneNumber?.message}
                            control={control}
                            data-testid="create_account_phone_number"
                        />
                        <TextField
                            label={translate("create_account_email_address")}
                            name="email"
                            rules={validationRules.email}
                            type="text"
                            data-testid="create_account_email_address"
                            disabled
                        />
                    </div>
                    <button
                        type="submit"
                        className="continue-button"
                        data-testid="create_account_button"
                        disabled={isLoading}
                    >
                        {shouldUpdate
                            ? translate("step_update_your_account")
                            : translate("button_continue")}
                    </button>
                </form>
            </FormProvider>
        </div>
    );
}

export default UpdateAccountForm;
