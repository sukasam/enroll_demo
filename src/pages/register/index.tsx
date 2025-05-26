import RegisterPage from "Components/pages/Register";
import PageSpinner from "Components/shared/PageSpinner";
import {
    PageWrapper,
    PageWrapperServerProps,
    getServerSideProps as pageWrapperServerSideProps
} from "Components/shared/PageWrapper";
import showToast, {
    dismissAllErrorToasts,
    ToastType
} from "Components/shared/ShowToaster";
import { countryConfigs, getCountryConfig } from "Constants/countryConfig";
import { Alpha2 } from "Constants/countryConfig/enums";
import { useOrder } from "Contexts/OrderContext";
import { useUser } from "Contexts/UserContext";
import { setCookie } from "cookies-next";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import isRefValid from "Services/utils/refValidation";

// Types and Interfaces
interface RegisterPageProps extends PageWrapperServerProps {
    countryConfig?: (typeof countryConfigs)[number];
    allowGuide?: boolean;
}

interface ToastQuery {
    toasterType?: string;
    toasterMessage?: string;
}

export default function Register(props: RegisterPageProps): JSX.Element {
    const router = useRouter();
    const { orderResult, tppPayload } = useOrder();
    const {
        userData,
        userToken,
        setLoggedInData,
        enrollerId,
        setEnrollerAllFullName,
        isUserContextLoading,
        setActiveAccordionSection
    } = useUser();
    const { allowGuide } = props;
    const [isLoadingAllowGuide, setIsLoadingAllowGuide] = useState(true);

    const shouldRedirectToThankYou = useMemo(
        () =>
            Boolean(
                orderResult &&
                    ((!orderResult.payPall3dsUrl &&
                        !orderResult.challengeHTML &&
                        !orderResult.klarnaRedirectUrl) ||
                        tppPayload?.id)
            ),
        [orderResult, tppPayload]
    );

    const handleToastMessage = useCallback(
        ({ toasterType, toasterMessage }: ToastQuery): void => {
            if (toasterMessage) {
                const type = (toasterType || "info") as ToastType;
                showToast(toasterMessage, type);
                router.replace(router.pathname, undefined, { shallow: true });
            }
        },
        [router]
    );

    const redirectToThankYou = useCallback((): void => {
        if (
            shouldRedirectToThankYou &&
            orderResult?.id?.unicity &&
            orderResult?.externalRedirect !== true
        ) {
            dismissAllErrorToasts();
            router.push({
                pathname: "/thank-you",
                query: { orderId: orderResult.id.unicity }
            });
        }
    }, [shouldRedirectToThankYou, orderResult, router]);

    const handleUserAuthentication = useCallback(async (): Promise<void> => {
        if (userData && !userToken) {
            router.push("/logout");
            return;
        }

        if (!userData && userToken) {
            try {
                await setLoggedInData(userToken);
                setActiveAccordionSection(2);
            } catch (error) {
                console.error(
                    "Failed to Log User in, Proceeding to Logout Page",
                    error
                );
                router.push("/logout");
            }
            return;
        }

        if (!enrollerId && !userToken) {
            router.push("/home");
        }
    }, [
        userData,
        userToken,
        router,
        setLoggedInData,
        setActiveAccordionSection,
        enrollerId
    ]);

    const redirectToLogin = useCallback(() => {
        if (allowGuide) {
            router.push("/login");
        }
    }, [allowGuide, router]);

    // Effects
    useEffect(() => {
        handleToastMessage(router.query);
    }, [router, handleToastMessage]);

    useEffect(() => {
        redirectToThankYou();
    }, [redirectToThankYou]);

    useEffect(() => {
        if (allowGuide) {
            redirectToLogin();
        } else if (!isUserContextLoading) {
            setIsLoadingAllowGuide(false);
            handleUserAuthentication();
        }
    }, [
        isUserContextLoading,
        handleUserAuthentication,
        allowGuide,
        redirectToLogin
    ]);

    // set the enroller all full name
    useEffect(() => {
        async function validateRef(): Promise<void> {
            if (enrollerId && typeof enrollerId === "object") {
                const { unicity } = enrollerId;
                const response = await isRefValid(unicity);
                const { refResults } = response;
                setEnrollerAllFullName(refResults?.humanName || null);
            }
        }
        validateRef();
    }, [enrollerId, setEnrollerAllFullName]);

    if (shouldRedirectToThankYou || (isLoadingAllowGuide && allowGuide)) {
        return <PageSpinner data-testid="register-page-spinner" />;
    }

    return (
        <PageWrapper
            {...props}
            title="upgrade_title_home"
            description="website_description_home"
            hideLocale
            background="#f5f8fc"
            data-testid="register-page-wrapper"
        >
            <RegisterPage />
        </PageWrapper>
    );
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<RegisterPageProps>> {
    const pageWrapperProps = await pageWrapperServerSideProps(ctx);

    // Check for allowGuide query parameter first
    const { allowGuide } = ctx.query;
    if (allowGuide === "true") {
        setCookie("allowGuide", "true", {
            path: "/",
            maxAge: 365 * 24 * 60 * 60,
            secure: true,
            sameSite: "lax"
        });
        return {
            props: {
                ...pageWrapperProps,
                allowGuide: true
            }
        };
    }

    const countryConfig = getCountryConfig(
        ctx.req.cookies.country as Alpha2,
        true
    );

    if (!countryConfig?.isSupported) {
        return {
            redirect: {
                destination: "/home",
                permanent: false
            }
        };
    }

    return pageWrapperProps;
}
