/** @jsxImportSource @emotion/react */
import { datadogRum } from "@datadog/browser-rum";
import { DevTool } from "@hookform/devtools";
import { Checkbox, FormControlLabel } from "@mui/material";
import PasswordRequirements from "Components/shared/Form/components/PasswordRequirements";
import PhoneNumberField from "Components/shared/Form/components/PhoneNumberField";
import TextField from "Components/shared/Form/components/TextField";
import ReCaptcha from "Components/shared/ReCaptcha";
import showToast from "Components/shared/ShowToaster";
import T, { useTranslate } from "Components/shared/Translate";
import { useCountryConfig } from "Constants/countryConfig";
import { Alpha2, optInNotificationTypes } from "Constants/countryConfig/enums";
import { useUser } from "Contexts/UserContext";
import { useTranslations } from "Contexts/translation";
import createCustomer, { CustomerDataType } from "Hydra/createCustomer";
import getLoginToken from "Hydra/getLoginToken";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import formatHref from "Services/utils/formatHref";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styles from "./styles";
import validationRules from "./validationRules";

type FormValues = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    agreeToTerms: boolean;
    SMSOptIn: boolean; // Add this line
    agreeToOnlineRegistration: boolean;
    agreeToMemberApplicationGuide: boolean;
};

type CustomerResponse = {
    humanName: {
        firstName: string;
        lastName: string;
        "firstName@ja"?: string;
    };
    mobilePhone: string;
    email: string;
    id: {
        unicity: string;
    };
    mainAddress: {
        country: string;
        state: string;
    };
    password: {
        value: string;
    };
    href: string;
};

type TokenResponse = {
    token: string;
};

type CreateAccountFormProps = {
    setIsLoading: (loading: boolean) => void;
    isLoading: boolean;
};

function CreateAccountForm({
    setIsLoading,
    isLoading
}: CreateAccountFormProps): JSX.Element {
    const [eventFired, setEventFired] = useState(false);
    const router = useRouter();
    const form = useForm<FormValues>({
        defaultValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            password: "",
            agreeToTerms: false,
            SMSOptIn: false
        },
        mode: "onChange",
        reValidateMode: "onChange"
    });
    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields },
        control,
        watch
    } = form;
    const {
        setUserData,
        setUserToken,
        setHref,
        goToNextSection,
        isUserContextLoading,
        enrollerId,
        sponsorId
    } = useUser();
    const translate = useTranslate();

    const { country, language } = useTranslations();
    const countryConfig = useCountryConfig();
    const { marketExceptions } = countryConfig || {};
    const { notificationType, showMemberApplicationGuide } =
        marketExceptions || {};
    const password = watch("password");

    const recaptchaRef = useRef<React.ElementRef<typeof ReCaptcha>>(null);
    const [isTermsMultiLine, setIsTermsMultiLine] = useState(false);
    const [isSmsMultiLine, setIsSmsMultiLine] = useState(false);
    const termsLabelRef = useRef<HTMLDivElement>(null);
    const smsLabelRef = useRef<HTMLDivElement>(null);
    const hiddenPersonalData =
        !!countryConfig?.marketExceptions?.hiddenPersonalData;

    const formatFullName = (fullName: string): string => {
        const fullNameEn = fullName.trim().split(" ");
        const newFullnameEn = `${fullNameEn[1]} ${fullNameEn[0]}`;
        return newFullnameEn;
    };

    useEffect(() => {
        const checkMultiLine = (
            ref: React.RefObject<HTMLDivElement>,
            setIsMultiLine: (value: boolean) => void
        ): void => {
            if (ref.current) {
                const lineHeight = parseInt(
                    window.getComputedStyle(ref.current).lineHeight,
                    10
                );
                const elementHeight = ref.current.offsetHeight;
                setIsMultiLine(elementHeight >= lineHeight * 2);
            }
        };

        checkMultiLine(termsLabelRef, setIsTermsMultiLine);
        checkMultiLine(smsLabelRef, setIsSmsMultiLine);
    }, []);

    const createCustomerFromForm = async (
        data: FormValues,
        token: string
    ): Promise<void> => {
        const requestData: CustomerDataType = {
            mainAddress: { country },
            humanName:
                country === "JP"
                    ? {
                          firstName: formatFullName(data.lastName),
                          lastName: "",
                          "firstName@ja": data.firstName
                      }
                    : { firstName: data.firstName, lastName: data.lastName },
            password: { value: data.password },
            signature: { value: data.agreeToTerms ? "TS" : null },
            email: data.email,
            mobilePhone: data.phoneNumber,
            type: "Member",
            businessEntity: { legalType: "SoleProprietorship" },
            recaptchaToken: token,
            recaptchaType: "invisible"
        };

        if (data.SMSOptIn) {
            if (notificationType === optInNotificationTypes.EMAIL) {
                requestData.rights = [
                    {
                        holder: "Unicity",
                        type: "SendEmails"
                    },
                    {
                        holder: "Upline",
                        type: "SendEmails"
                    }
                ];
            } else if (notificationType === optInNotificationTypes.SMS) {
                requestData.programEnrollments = ["SMSOptIn"];
            }
        }

        const setMixPanelRegistrationProperties = (
            customerResponse: CustomerResponse
        ): void => {
            mixpanelService.registerSuperProperties({
                customer_type: "enroller"
            });

            mixpanelService.setPeopleProperties({
                unicity_id: customerResponse.id.unicity,
                enroller_id: enrollerId || "",
                sponsor_id: sponsorId || enrollerId || "",
                user_market: customerResponse.mainAddress.country || country,
                user_market_extended:
                    customerResponse.mainAddress.state === "PR" &&
                    customerResponse.mainAddress.country === "US"
                        ? "PR"
                        : customerResponse.mainAddress.country || country,
                user_language: language,
                membership_registration_date: new Date().toISOString(),
                enr_customer_type: "enroller",
                consent_contact: data.SMSOptIn || false
            });

            mixpanelService.trackEvent(MixpanelEvent.REGISTRATION_COMPLETED, {
                event_location: "enrollment"
            });
        };

        const customerResponse: CustomerResponse = await createCustomer(
            requestData,
            enrollerId,
            sponsorId || null
        );

        setHref(formatHref(customerResponse.href));

        const tokenResponse: TokenResponse = await getLoginToken(
            customerResponse.id.unicity,
            customerResponse.password.value
        );
        // Here be dragons - UserToken must be set first or you will have route issues on create accounts
        // TODO: Use the setLoggedInData function from the UserContext
        setUserToken(tokenResponse.token);

        setUserData({
            firstName:
                country === "JP"
                    ? customerResponse.humanName["firstName@ja"]
                    : customerResponse.humanName.firstName,
            lastName:
                country === "JP"
                    ? formatFullName(customerResponse.humanName.firstName)
                    : customerResponse.humanName.lastName,
            phoneNumber: customerResponse.mobilePhone,
            email: customerResponse.email,
            fullName:
                country === "JP"
                    ? formatFullName(customerResponse.humanName.firstName)
                    : `${customerResponse.humanName.firstName} ${customerResponse.humanName.lastName}`,
            unicityId: customerResponse.id.unicity
        });

        datadogRum.setUser(
            hiddenPersonalData
                ? {
                      id: customerResponse.id.unicity
                  }
                : {
                      id: customerResponse.id.unicity,
                      email: customerResponse.email,
                      name:
                          country === "JP"
                              ? formatFullName(
                                    customerResponse.humanName.firstName
                                )
                              : `${customerResponse.humanName.firstName} ${customerResponse.humanName.lastName}`
                  }
        );

        showToast(translate("notification_success_account"), "success");
        mixpanelService.identify(customerResponse.id.unicity);
        mixpanelService.setPeopleProperties(
            hiddenPersonalData
                ? {
                      user_type: "signed_up",
                      consent_contact: data.SMSOptIn || false
                  }
                : {
                      $email: customerResponse.email,
                      $name:
                          country === "JP"
                              ? formatFullName(
                                    customerResponse.humanName.firstName
                                )
                              : `${customerResponse.humanName.firstName} ${customerResponse.humanName.lastName}`,
                      user_type: "signed_up",
                      consent_contact: data.SMSOptIn || false
                  }
        );
        setMixPanelRegistrationProperties(customerResponse);
        goToNextSection();
        setIsLoading(false);
    };

    const onSubmit = async (data: FormValues): Promise<void> => {
        setIsLoading(true);
        try {
            recaptchaRef.current.reset();
            const token = await recaptchaRef.current?.execute();
            await createCustomerFromForm(data, token);
        } catch (error: any) {
            mixpanelService.trackEvent(MixpanelEvent.REGISTRATION_SERVER_ERROR);
            mixpanelService.setPeopleProperties({
                user_type: "signed_up",
                consent_contact: data.SMSOptIn || false
            });
            const errorMessage =
                error?.error_message || "500_error_description";
            showToast(translate(errorMessage), "error");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmitError = useCallback((): void => {
        const fieldMapping: Record<string, string> = {
            firstName: "first_name",
            lastName: "last_name",
            phoneNumber: "phone_number",
            email: "email",
            password: "password",
            agreeToTerms: "TandC",
            agreeToOnlineRegistration: "online_registration",
            agreeToMemberApplicationGuide: "member_application_guide"
        };

        // Track empty form submission
        if (Object.values(watch()).every(value => !value)) {
            mixpanelService.trackEvent(
                MixpanelEvent.REGISTRATION_VALIDATION_ERROR_AFTER_CLICK,
                {
                    error_name: Object.values(fieldMapping)
                }
            );
            return;
        }

        // Track specific validation errors
        if (Object.keys(errors).length > 0) {
            const mappedErrors = Object.keys(errors).map(
                error => fieldMapping[error]
            );

            mixpanelService.trackEvent(
                MixpanelEvent.REGISTRATION_VALIDATION_ERROR_AFTER_CLICK,
                {
                    error_name: mappedErrors
                }
            );
        }
    }, [errors, watch]);

    const eventFiredRef = useRef(false);
    const formValues = watch();

    useEffect(() => {
        const formHasValues = Object.values(formValues).some(value => value);
        if (!eventFiredRef.current && formHasValues) {
            mixpanelService.trackEvent(MixpanelEvent.REGISTRATION_STARTED);
            eventFiredRef.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues]);

    const handleAlreadyMemberClick = (
        e: React.MouseEvent<HTMLAnchorElement>
    ): void => {
        e.preventDefault();
        mixpanelService.trackEvent(
            MixpanelEvent.REGISTRATION_ALREADY_HAVE_ACCOUNT_CLICKED,
            {
                event_location: "upgrade_to_distributor_button"
            }
        );
        router.push("/login");
    };

    return (
        <div css={styles}>
            <div className="formContainer">
                <FormProvider {...form}>
                    <form
                        className="form"
                        onSubmit={handleSubmit(onSubmit, onSubmitError)}
                        noValidate
                        data-testid="create-account-form"
                    >
                        <div className="formRow firstRow phoneNumberRow">
                            <TextField
                                label={translate("create_account_first_name")}
                                name="firstName"
                                rules={{
                                    ...validationRules.firstName,
                                    validate: (value: string) =>
                                        validationRules.firstName.validate(
                                            value,
                                            country
                                        )
                                }}
                                type="text"
                                data-testid="create_account_first_name"
                            />
                            <TextField
                                label={translate("create_account_last_name")}
                                name="lastName"
                                rules={{
                                    ...validationRules.lastName,
                                    validate: (value: string) =>
                                        validationRules.lastName.validate(
                                            value,
                                            country
                                        )
                                }}
                                type="text"
                                data-testid="create_account_last_name"
                            />
                        </div>
                        <div className="formRow phoneNumberRow">
                            <PhoneNumberField
                                className="phoneNumberField"
                                label={translate("create_account_phone_number")}
                                name="phoneNumber"
                                rules={validationRules.phoneNumber}
                                defaultCountry={country as Alpha2}
                                error={translate(errors.phoneNumber?.message)}
                                control={control}
                                data-testid="create_account_phone_number"
                            />
                            <TextField
                                label={<T>create_account_email_address</T>}
                                name="email"
                                rules={validationRules.email}
                                type="text"
                                data-testid="create_account_email_address"
                            />
                        </div>

                        <div className="formRow">
                            <div className="formField halfWidth">
                                <TextField
                                    label={translate("create_account_password")}
                                    name="password"
                                    rules={validationRules.password}
                                    type="password"
                                    data-testid="create_account_password"
                                    className="passwordField"
                                />
                            </div>
                            <PasswordRequirements
                                password={password}
                                touchedFields={touchedFields}
                                data-testid="password_requirements_list"
                            />
                        </div>
                        <div className="formField checkboxField fullWidth">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        {...register(
                                            "agreeToTerms",
                                            validationRules.agreeToTerms
                                        )}
                                        name="agreeToTerms"
                                        className="customCheckbox"
                                    />
                                }
                                className={`checkboxLabel ${
                                    isTermsMultiLine ? "sms" : ""
                                }`}
                                label={
                                    <div
                                        ref={termsLabelRef}
                                        data-testid="terms-label"
                                        dangerouslySetInnerHTML={{
                                            __html: translate(
                                                "create_account_agree_to_terms",
                                                {
                                                    member_terms_url: translate(
                                                        "agreement_member_terms_url",
                                                        {
                                                            alpha2:
                                                                country || "us"
                                                        }
                                                    )
                                                }
                                            ).replace(
                                                /<a\s/g,
                                                '<a style="color: inherit; text-decoration: underline;" '
                                            )
                                        }}
                                    />
                                }
                            />

                            <p
                                className={`error ${
                                    errors.agreeToTerms ? "active" : null
                                }`}
                            >
                                {translate("error_is_required", {
                                    field: translate(
                                        errors.agreeToTerms?.message
                                    )
                                })}
                            </p>

                            {marketExceptions?.showOnlineRegistration && (
                                <>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                {...register(
                                                    "agreeToOnlineRegistration",
                                                    validationRules.agreeToOnlineRegistration
                                                )}
                                                name="agreeToOnlineRegistration"
                                                className="customCheckbox"
                                            />
                                        }
                                        className="checkboxLabel"
                                        label={
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: translate(
                                                        "create_account_online_registration",
                                                        {
                                                            alpha2:
                                                                country || "us"
                                                        }
                                                    )
                                                }}
                                            />
                                        }
                                    />
                                    <p
                                        className={`error ${
                                            errors.agreeToOnlineRegistration
                                                ? "active"
                                                : null
                                        }`}
                                    >
                                        {translate("error_is_required", {
                                            field: translate(
                                                errors.agreeToOnlineRegistration
                                                    ?.message
                                            )
                                        })}
                                    </p>
                                </>
                            )}

                            {notificationType && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            {...register("SMSOptIn")}
                                            name="SMSOptIn"
                                            className="customCheckbox"
                                        />
                                    }
                                    className={`checkboxLabel ${
                                        isSmsMultiLine ? "sms" : ""
                                    }`}
                                    label={
                                        <div
                                            ref={smsLabelRef}
                                            data-testid="sms-optin-label"
                                            dangerouslySetInnerHTML={{
                                                __html: translate(
                                                    "agreement_sms_optin",
                                                    {
                                                        agreement_by_member_application_url:
                                                            translate(
                                                                "agreement_by_member_application_url",
                                                                {
                                                                    alpha2:
                                                                        country ||
                                                                        "us"
                                                                }
                                                            )
                                                    }
                                                ).replace(
                                                    /<a\s/g,
                                                    '<a style="color: inherit; text-decoration: underline;" '
                                                )
                                            }}
                                        />
                                    }
                                />
                            )}

                            {showMemberApplicationGuide && (
                                <>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                {...register(
                                                    "agreeToMemberApplicationGuide",
                                                    validationRules.agreeToMemberApplicationGuide
                                                )}
                                                name="agreeToMemberApplicationGuide"
                                                className="customCheckbox"
                                            />
                                        }
                                        className="checkboxLabel"
                                        label={
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: translate(
                                                        "agreement_member_application",
                                                        {
                                                            agreement_by_member_application_url:
                                                                translate(
                                                                    "agreement_by_member_application_url",
                                                                    {
                                                                        alpha2:
                                                                            country ||
                                                                            "us"
                                                                    }
                                                                )
                                                        }
                                                    ).replace(
                                                        /<a\s/g,
                                                        '<a style="color: inherit; text-decoration: underline;" '
                                                    )
                                                }}
                                            />
                                        }
                                    />
                                    <p
                                        className={`error ${
                                            errors.agreeToMemberApplicationGuide
                                                ? "active"
                                                : null
                                        }`}
                                    >
                                        {translate(
                                            errors.agreeToMemberApplicationGuide
                                                ?.message
                                        )}
                                    </p>
                                </>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="continue-button"
                            data-testid="create_account_create_account_button"
                            disabled={isLoading || isUserContextLoading}
                            onClick={(): undefined => {
                                mixpanelService.trackEvent(
                                    MixpanelEvent.REGISTRATION_CLICKED
                                );
                                return undefined;
                            }}
                        >
                            {isLoading
                                ? "Creating Account..."
                                : translate(
                                      "create_account_create_account_button"
                                  )}
                        </button>
                    </form>
                    <div
                        className="alreadyMember"
                        data-testid="create_account_already_have_member_account"
                    >
                        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                        <Link href="/login" onClick={handleAlreadyMemberClick}>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: translate(
                                        "create_account_already_have_member_account",
                                        {
                                            url: "/login"
                                        }
                                    )
                                }}
                            />
                        </Link>
                    </div>
                    <ReCaptcha ref={recaptchaRef} />
                </FormProvider>
                <DevTool control={control} />
            </div>
        </div>
    );
}

export default CreateAccountForm;
