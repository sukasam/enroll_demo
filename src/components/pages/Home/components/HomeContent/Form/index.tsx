/** @jsxImportSource @emotion/react */
import { DevTool } from "@hookform/devtools";
import TextField from "Components/shared/Form/components/TextField";
import PrimaryButton from "Components/shared/PrimaryButton";
import SelectDropdown from "Components/shared/SelectDropdown";
import Spinner from "Components/shared/Spinner";
import StyledCheckbox from "Components/shared/StyledCheckbox";
import { useTranslate } from "Components/shared/Translate";
import {
    getCountries,
    getCountryConfig,
    getDefaultLanguage,
    useCountryConfig
} from "Constants/countryConfig";
import { Alpha2 } from "Constants/countryConfig/enums.js";
import { useUser } from "Contexts/UserContext";
import { useTranslations } from "Contexts/translation";
import { Customer } from "Hydra/getRefID";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import countryRedirect from "Services/utils/countryRedirect";
import { getFullName } from "Services/utils/fullName";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import RedirectPopup from "./components/RedirectPopup";
import useAvailableLanguages, {
    checkRefID,
    checkSponsor,
    useDebounce
} from "./hooks";
import styles from "./styles.js";

interface FormValues {
    country: string;
    language: string;
    enrollerId: string | null;
    sponsorId?: string | null;
}
interface Props {
    refId: string;
    referrer: Customer;
}

function Form({ referrer, refId }: Props): React.ReactElement {
    const {
        country,
        language,
        setCountry: setCtxCountry,
        setLanguage: setCtxLanguge,
        fetchTranslations
    } = useTranslations();

    const router = useRouter();

    const {
        setEnrollerId: setCtxEnrollerId,
        setEnrollerFullName,
        setEnrollerAllFullName,
        setSponsorId: setCtxSponsorId,
        setSponsorFullName,
        enrollerId,
        sponsorFullName,
        enrollerFullName,
        isUserContextLoading
    } = useUser();

    const formMethods = useForm<FormValues>({
        defaultValues: {
            country: country || getCookie("country") || "US",
            language: getDefaultLanguage(
                (country || getCookie("country") || "US") as Alpha2
            ),
            enrollerId: refId || enrollerId || ""
        },
        mode: "onBlur",
        reValidateMode: "onBlur"
    });

    const {
        unregister,
        handleSubmit,
        clearErrors,
        setValue,
        watch,
        trigger,
        formState
    } = formMethods;
    const formValues = watch();
    const debouncedEnrollerId = useDebounce(formValues.enrollerId, 500);

    const setFormEnrollerId = (value: string): void =>
        setValue("enrollerId", value);

    const setFormSponsorId = (value: string): void =>
        setValue("sponsorId", value);

    const setFormCountry = (value: string): void => setValue("country", value);

    const setFormLanguage = (value: string): void =>
        setValue("language", value);

    const setEnrollerId = (value: string): void => {
        setCtxEnrollerId(value);
        setFormEnrollerId(value);
    };
    const setSponsorId = (value: string): void => {
        setCtxSponsorId(value);
        setFormSponsorId(value);
    };
    const setCountry = (value: string): void => {
        setCtxCountry(value);
        setFormCountry(value);
    };
    const setLanguage = (value: string): void => {
        setCtxLanguge(value);
        setFormLanguage(value);
    };

    const { isValid } = formState;
    const [isReferred] = useState<boolean>(!!getCookie("isReferred"));

    const [redirectPath, setRedirectPath] = useState<string | null>(null);
    const [showSponsor, setShowSponsor] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [previousCountry, setPreviousCountry] = useState<Alpha2 | null>(null);
    const translate = useTranslate();

    const countryConfig = useCountryConfig();
    const { marketExceptions } = countryConfig || {};
    const { hiddenEnrollerId } = marketExceptions || {};

    const countriesList = getCountries(false)
        .filter(country => country.isSupported || country.redirect)
        .map(country => ({ label: country.name, value: country.alpha2 }))
        .sort((a, b) => a.label.localeCompare(b.label));

    const languageOptions = useAvailableLanguages(formValues.country as Alpha2);
    const availableCountries = getCountries(true)
        .filter(country => country.isSupported)
        .map(country => country.alpha2);

    const handleRedirect = useCallback((): void => {
        const { path } = countryRedirect(
            formValues.country as Alpha2,
            formValues.language,
            "",
            enrollerId || ""
        );
        setRedirectPath(path);
    }, [formValues.language, formValues.country, previousCountry, setValue]);

    const getCountryLanguage = useCallback(
        (country: Alpha2, language: string): string => {
            const selectedCountryData = getCountryConfig(
                country as Alpha2,
                true
            );
            const defaultLanguage =
                selectedCountryData?.languages?.find(lang => lang?.default)
                    ?.code || "en";
            return (
                selectedCountryData?.languages?.find(
                    lang => lang?.code === language
                )?.code || defaultLanguage
            );
        },
        []
    );

    const trackCountry = (newCountry: string, prevCountry: string): void => {
        if (prevCountry && newCountry !== prevCountry) {
            mixpanelService.registerSuperProperties({
                user_market: newCountry,
                user_market_extended: newCountry
            });
            mixpanelService.trackEvent(MixpanelEvent.USER_MARKET_CHANGED, {
                previous_user_market: prevCountry,
                event_location: "home"
            });
        }
    };
    const trackLanguage = (newLanguage: string, prevLanguage: string): void => {
        if (prevLanguage && newLanguage !== prevLanguage) {
            mixpanelService.trackEvent(MixpanelEvent.USER_LANGUAGE_CHANGED, {
                previous_user_language: prevLanguage,
                event_location: "home",
                user_language: newLanguage
            });
            mixpanelService.registerSuperProperties({
                user_language: newLanguage
            });
        }
    };

    useEffect(() => {
        if (isUserContextLoading) return;
        if (refId) {
            setEnrollerId(refId);
            setEnrollerFullName(getFullName(referrer?.humanName));
            setSponsorId(refId);
            setSponsorFullName(getFullName(referrer?.humanName));
        }
    }, [isUserContextLoading, refId, referrer]);

    useEffect(() => {
        setCountry(formValues.country);
        const countryLanguage = getCountryLanguage(
            formValues.country as Alpha2,
            formValues.language
        );
        trackCountry(formValues.country, previousCountry as string);
        setLanguage(countryLanguage);
        if (!availableCountries.includes(formValues.country as Alpha2)) {
            handleRedirect();
        }
    }, [formValues.country]);

    useEffect(() => {
        if (
            formValues.country &&
            availableCountries.includes(formValues.country as Alpha2)
        ) {
            setPreviousCountry(formValues.country as Alpha2);
        }
    }, [formValues.country, availableCountries, setPreviousCountry]);

    useEffect(() => {
        const correctLanguage = getCountryLanguage(
            formValues.country as Alpha2,
            formValues.language
        );
        if (correctLanguage !== language) {
            trackLanguage(correctLanguage, language);
            setLanguage(correctLanguage);
            fetchTranslations(formValues.country, correctLanguage);
            mixpanelService.registerSuperProperties({
                user_language: correctLanguage
            });
        }
    }, [
        formValues.language,
        formValues.country,
        language,
        getCountryLanguage,
        fetchTranslations,
        setLanguage,
        trackLanguage
    ]);

    useEffect(() => {
        const currentCountry = formValues.country as Alpha2;
        const defaultLanguage = getDefaultLanguage(currentCountry);
        setValue("language", defaultLanguage);
    }, [formValues.country, setValue]);

    useEffect(() => {
        if (debouncedEnrollerId) {
            trigger("enrollerId");
        }
    }, [debouncedEnrollerId, trigger]);

    const onSubmit = (): void => {
        setIsLoading(true);
        mixpanelService.registerSuperProperties({
            enroller_id: formValues.enrollerId || "",
            sponsor_id: formValues.sponsorId || formValues.enrollerId || ""
        });

        mixpanelService.trackEvent(MixpanelEvent.HOME_START_COMPLETED);
        router.push("/register");
    };
    return (
        <div css={styles}>
            <FormProvider {...formMethods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <SelectDropdown
                        name="country"
                        label={translate("home_select_country")}
                        options={countriesList}
                        rules={{ required: true }}
                        value={watch("country")}
                        data-testid="home_select_country"
                    />
                    <SelectDropdown
                        name="language"
                        label={translate("home_select_language")}
                        options={languageOptions}
                        rules={{ required: true }}
                        value={watch("language")}
                        data-testid="home_select_language"
                    />
                    <div
                        className="enroller-id-wrapper"
                        data-testid="home_enroller_wrapper"
                    >
                        <TextField
                            className="id-text-box"
                            name="enrollerId"
                            data-testid="home_enroller"
                            label={translate(
                                hiddenEnrollerId
                                    ? "home_sponsor"
                                    : "home_enroller"
                            )}
                            type="text"
                            rules={{
                                required: false,
                                validate: async (
                                    value: string
                                ): Promise<string | boolean> =>
                                    new Promise(resolve => {
                                        if (!value) {
                                            setEnrollerFullName("");
                                            resolve(
                                                translate(
                                                    hiddenEnrollerId
                                                        ? "home_sponsor"
                                                        : "home_enroller"
                                                )
                                            );
                                        }
                                        checkRefID(
                                            value,
                                            setEnrollerId,
                                            setEnrollerFullName,
                                            setEnrollerAllFullName,
                                            setIsLoading,
                                            translate,
                                            hiddenEnrollerId
                                        ).then(result => {
                                            if (result === "") {
                                                resolve(true);
                                            } else {
                                                resolve(translate(result));
                                            }
                                        });
                                    })
                            }}
                            disabled={isReferred && isUserContextLoading}
                        />
                        <div
                            className="enrollerName"
                            data-testid="enroller_name"
                        >
                            {enrollerFullName}
                        </div>
                    </div>
                    {!hiddenEnrollerId && (
                        <>
                            <div className="sponsor-checkbox">
                                <StyledCheckbox
                                    id="useSponsor"
                                    name="useSponsor"
                                    onChange={(): void => {
                                        setShowSponsor(!showSponsor);
                                        clearErrors("sponsorId");
                                        unregister("sponsorId");
                                    }}
                                    disabled={isUserContextLoading}
                                />
                                <label
                                    htmlFor="useSponsor"
                                    data-testid="home_sponsor_different_enroller"
                                >
                                    {translate(
                                        "home_sponsor_different_enroller"
                                    )}
                                </label>
                            </div>
                            {showSponsor && (
                                <div
                                    className="enroller-id-wrapper"
                                    data-testid="home_sponsor_wrapper"
                                >
                                    <TextField
                                        name="sponsorId"
                                        label={translate("home_sponsor")}
                                        className="id-text-box"
                                        type="text"
                                        data-testid="home_sponsor"
                                        rules={{
                                            required: false,
                                            validate: (
                                                value: string
                                            ): Promise<string | boolean> =>
                                                new Promise(resolve => {
                                                    if (!value) {
                                                        setSponsorFullName("");
                                                        resolve(
                                                            translate(
                                                                "home_sponsor"
                                                            )
                                                        );
                                                    }
                                                    checkSponsor(
                                                        value,
                                                        formValues.enrollerId ||
                                                            "",
                                                        setSponsorId,
                                                        setSponsorFullName,
                                                        setIsLoading
                                                    ).then(result => {
                                                        resolve(
                                                            translate(result)
                                                        );
                                                    });
                                                })
                                        }}
                                    />

                                    <div
                                        className="enrollerName"
                                        data-testid="sponsor_name"
                                    >
                                        {sponsorFullName}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    <PrimaryButton
                        type="submit"
                        id="start_enrollment"
                        data-testid="home_get_started"
                        disabled={!isValid}
                    >
                        {isLoading ? (
                            <Spinner height="32px" />
                        ) : (
                            translate("home_get_started")
                        )}
                    </PrimaryButton>
                </form>
                {redirectPath && (
                    <RedirectPopup
                        path={redirectPath}
                        selectedCountry={formValues.country as Alpha2}
                        onClose={(): void => {
                            setRedirectPath(null);
                            setCountry(previousCountry as string);
                        }}
                    />
                )}
            </FormProvider>
            <DevTool control={formMethods.control} />
        </div>
    );
}

export default Form;
