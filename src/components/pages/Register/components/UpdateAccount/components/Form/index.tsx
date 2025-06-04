/** @jsxImportSource @emotion/react */
import PhoneNumberField from "Components/shared/Form/components/PhoneNumberField";
import TextField from "Components/shared/Form/components/TextField";
import { useTranslate } from "Components/shared/Translate";
import { useUser } from "Contexts/UserContext";
import { useCountryConfig } from "Constants/countryConfig";
import { useTranslations } from "Contexts/translation";
import commonConfig from "Constants/countryConfig/commonConfig";
import mapFieldToComponent from "Components/shared/Form/components/MapFieldToComponent";

import showToast from "Components/shared/ShowToaster";
import updateCustomer from "Hydra/updateCustomer";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styles from "./styles";
import validationRules from "./validationRules";

interface FormValues {
    firstName: string;
    lastName: string;
    fullName: string;
    fullNameEn: string;
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
    const { country } = useTranslations();
    const countryConfig = useCountryConfig();
    const { marketExceptions } = countryConfig || {};
    const formatPhoneNumber = (phoneNumber: string): string => {
        const cleanedNumber = phoneNumber.replace(/\D/g, "");

        return `+${cleanedNumber}`;
    };

    const form = useForm<FormValues>({
        mode: "onTouched",
        defaultValues: {
            firstName: "",
            lastName: "",
            fullName: "",
            fullNameEn: "",
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
            setValue("fullName", userData?.firstName || "");
            setValue("fullNameEn", userData?.lastName || "");
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

    // Helper: group fields into rows of 2 columns, left-aligned if odd
    const formFields = Array.isArray(marketExceptions?.formUpdateAccount)
        ? marketExceptions.formUpdateAccount
        : commonConfig?.marketExceptions?.formUpdateAccount || [
              "firstName",
              "lastName",
              "phoneNumber",
              "email"
          ];

    // Split fields into rows of 2
    const fieldRows: string[][] = [];
    for (let i = 0; i < formFields.length; i += 2) {
        fieldRows.push(formFields.slice(i, i + 2));
    }

    const renderField = (field: string): JSX.Element | null =>
        mapFieldToComponent({
            field,
            validationRules,
            translate,
            country,
            errors,
            control,
            disabled: true,
            type: "update"
        });
    return (
        <div css={styles}>
            <FormProvider {...form}>
                <form
                    className="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    {fieldRows.map(row => {
                        let rightCol: JSX.Element | null = null;
                        if (row[1]) {
                            rightCol = renderField(row[1]);
                        }
                        return (
                            <div
                                className="formRow"
                                key={`form-row-${row.join("-")}`}
                            >
                                <div className="formField halfWidth">
                                    {renderField(row[0])}
                                </div>
                                <div className="formField halfWidth">
                                    {rightCol}
                                </div>
                            </div>
                        );
                    })}

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
