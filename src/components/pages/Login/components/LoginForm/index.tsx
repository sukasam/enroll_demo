/** @jsxImportSource @emotion/react */
import { datadogRum } from "@datadog/browser-rum";
import { Grid } from "@mui/material";
import TextField from "Components/shared/Form/components/TextField";
import PrimaryButton from "Components/shared/PrimaryButton";
import ReCaptcha from "Components/shared/ReCaptcha";
import showToast from "Components/shared/ShowToaster";
import Spinner from "Components/shared/Spinner";
import { useTranslate } from "Components/shared/Translate";
import { useCountryConfig } from "Constants/countryConfig";
import { useUser } from "Contexts/UserContext";
import getLoginToken from "Hydra/getLoginToken";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import LoginErrorModal from "../LoginErrorModal";
import styles from "./styles";
import validationRules from "./validationRules";

interface FormValues {
    username: string;
    password: string;
    recaptcha: string;
}

type LoginErrorModal = {
    title: string;
    description: string;
};

export default function LoginForm(): JSX.Element {
    const translate = useTranslate();
    const router = useRouter();
    const { userData, setUserToken, userToken, setLoggedInData } = useUser();
    const form = useForm<FormValues>({ mode: "onBlur" });
    const {
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors }
    } = form;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginErrorModal, setLoginErrorModal] =
        useState<LoginErrorModal | null>(null);
    const recaptchaRef = useRef<React.ElementRef<typeof ReCaptcha>>(null);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormValues | null>(null);
    const countryConfig = useCountryConfig();
    const hiddenPersonalData =
        !!countryConfig?.marketExceptions?.hiddenPersonalData;

    const clearFieldErrors = useCallback(() => {
        if (Object.keys(errors).length > 0) {
            clearErrors();
        }
    }, [clearErrors, errors]);

    const onSubmit = async (data: FormValues): Promise<void> => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            recaptchaRef.current.reset();
            const token = await recaptchaRef.current?.execute();
            setRecaptchaToken(token);
            setFormData(data);
        } catch (error: any) {
            showToast(error, "error");
            setIsSubmitting(false);
        }
    };

    const handleLoginError = (error: any): void => {
        setUserToken(null);

        const errorMessages: Record<
            string,
            { title: string; description: string }
        > = {
            market_not_supported: {
                title: translate("login_error_market_not_supported_title"),
                description: translate(
                    "login_error_market_not_supported_description"
                )
            },
            allready_a_distributor: {
                title: translate(
                    "login_error_distributor_type_not_supported_title"
                ),
                description: translate(
                    "login_error_distributor_type_not_supported_description"
                )
            },
            user_type_not_supported: {
                title: translate(
                    "login_error_invalid_user_type_not_supported_title"
                ),
                description: translate(
                    "login_error_invalid_user_type_not_supported_description"
                )
            }
        };

        const errorMessage = errorMessages[error.message];
        if (errorMessage) {
            setLoginErrorModal(errorMessage);
        } else {
            setError("username", {
                type: "manual",
                message: "login_error_incorrect_username"
            });
            setError("password", {
                type: "manual",
                message: "login_error_incorrect_password"
            });
        }
    };

    const loginCustomer = async (data: FormValues): Promise<void> => {
        try {
            mixpanelService.trackEvent(MixpanelEvent.LOGIN_SIGN_IN_CLICKED, {
                event_location: "login"
            });
            const loginResponse = await getLoginToken(
                data.username,
                data.password,
                recaptchaToken
            );
            if (loginResponse.ok === false) {
                throw new Error("Login failed");
            }

            await setLoggedInData(loginResponse.token);
        } catch (error: any) {
            mixpanelService.trackEvent(
                MixpanelEvent.LOGIN_SIGN_IN_SERVER_ERROR,
                {
                    response_code: error.code,
                    error_message: error.message
                }
            );
            handleLoginError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (userData && userToken) {
            datadogRum.setUser(
                hiddenPersonalData
                    ? {
                          id: userData.unicityId
                      }
                    : {
                          id: userData.unicityId,
                          email: userData.email,
                          name: userData.fullName
                      }
            );
            setLoginErrorModal(null);
            router.push("/register");
        }
    }, [userToken, userData, router]);

    useEffect(() => {
        if (recaptchaToken && formData) {
            loginCustomer(formData);
        }
    }, [recaptchaToken, formData]);

    return (
        <Grid container css={styles}>
            <Grid item md={12} xs={12}>
                {loginErrorModal && (
                    <LoginErrorModal
                        title={loginErrorModal.title}
                        description={loginErrorModal.description}
                        onClose={(): void => setLoginErrorModal(null)}
                    />
                )}
                <FormProvider {...form}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        data-testid="login-form"
                    >
                        <TextField
                            label={translate("login_email_unicity_id")}
                            name="username"
                            rules={validationRules.username}
                            data-testid="login_email_unicity_id"
                            type="text"
                            onChange={clearFieldErrors}
                        />
                        <TextField
                            label={translate("login_password")}
                            name="password"
                            rules={validationRules.password}
                            data-testid="login_password"
                            type="password"
                            onChange={clearFieldErrors}
                        />
                        <PrimaryButton
                            type="submit"
                            id="signin_button"
                            data-testid="login_sign_in"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Spinner height="32px" />
                            ) : (
                                translate("login_sign_in")
                            )}
                        </PrimaryButton>
                        <ReCaptcha ref={recaptchaRef} />
                    </form>
                </FormProvider>
            </Grid>
        </Grid>
    );
}
