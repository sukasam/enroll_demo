/** @jsxImportSource @emotion/react */
import { DevTool } from "@hookform/devtools";
import { debounce, useTheme } from "@mui/material";
import TextField from "Components/shared/Form/components/TextField";
import InfoTooltip from "Components/shared/InfoTooltip";
import SelectDropdown from "Components/shared/SelectDropdown";
import Spinner from "Components/shared/Spinner";
import { useTranslate } from "Components/shared/Translate";
import {
    getCountries,
    getCountryConfig,
    useCountryConfig
} from "Constants/countryConfig";
import { Alpha2 } from "Constants/countryConfig/enums";
import { useOrder } from "Contexts/OrderContext";
import { useUser } from "Contexts/UserContext";
import { useTranslations } from "Contexts/translation";
import { AddressType } from "Contexts/types/OrderContextTypes";
import { UserData } from "Contexts/types/UserContextTypes";
import useFetchQoutes from "Hooks/useFetchQoutes";
import updateCustomer from "Hydra/updateCustomer";
import { AddressSuggestion } from "Services/Hydra/validateAddress";
import getAddressSuggestions from "Services/addressSuggestions";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import applyConditionalStyles from "Styles/utilities/styleUtils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { FormProvider, useForm } from "react-hook-form";
import AddressSuggestionDropdown from "../AddressSuggestionDropdown";
import showToast from "../ShowToaster";
import getStates from "./hooks";
import styles from "./styles";
import validationRules, { validateZipCode } from "./validationRules";

type FormValues = {
    name: string | undefined;
    country: string | undefined;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
};

type AddressFormProps = {
    title: string;
    submitButton?: React.ReactNode;
    countryDisabled?: boolean;
    setSelectedState?: (state: string) => void;
    showSubmitButton?: boolean;
    formType?: "billing" | "shipping" | "account";
};

type GetNameOptions = {
    shipToAddress: AddressType | undefined;
    userData: UserData | undefined;
    userCountry: string;
    language: string;
};

// Update the formatZipCode function to insert a dash after the third character
const formatZipCode = (zip: string): string => {
    const cleanedZip = zip.replace(/-/g, ""); // Remove existing dashes
    if (cleanedZip.length >= 4) {
        return `${cleanedZip.slice(0, 3)}-${cleanedZip.slice(3)}`;
    }
    return cleanedZip;
};

export default function AddressFormJP({
    showSubmitButton = true,
    title,
    submitButton,
    countryDisabled,
    setSelectedState,
    formType = "shipping"
}: AddressFormProps): JSX.Element {
    const [selectedCountry, setSelectedCountry] = useState<
        Alpha2 | undefined
    >();
    const [states, setStates] = useState<{ label: string; value: string }[]>(
        []
    );
    const [suggestedAddresses, setSuggestedAddressesClean] = useState<
        AddressSuggestion[]
    >([]);
    const [lastAddressDebounce, setLastAddressDebounce] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const translate = useTranslate();
    const currentCountryConfig = useCountryConfig();
    const {
        userLocale,
        userData,
        goToNextSection,
        setMainAddress,
        href,
        userToken,
        mainAddress
    } = useUser();
    const [hintsOpen, setHintsOpen] = useState(false);
    const { shipToAddress, setShipToAddress, setBillingAddress } = useOrder();
    const countryCode = userLocale ? userLocale.split("-")[1] : undefined;
    const theme = useTheme();
    const { country: userCountry, language } = useTranslations();
    const updateMainAddress =
        !!currentCountryConfig?.marketExceptions?.updateMainAddress;
    const [zipManuallyChanged, setZipManuallyChanged] = useState(true);

    // Set initial country value
    useEffect(() => {
        if (shipToAddress?.country) {
            setSelectedCountry(shipToAddress.country as Alpha2);
        } else if (formType === "account" && mainAddress?.country) {
            setSelectedCountry(mainAddress.country as Alpha2);
        } else if (countryCode) {
            setSelectedCountry(countryCode as Alpha2);
        }
    }, [shipToAddress?.country, mainAddress?.country, countryCode, formType]);

    const getAddressKey = (address: AddressSuggestion): string => {
        if (!address) {
            return "";
        }
        return `${address.address1}-${address.city}-${address.state}-${address.zip}`;
    };

    const setSuggestedAddresses = (addresses: AddressSuggestion[]): void => {
        const uniqueAddresses = Array.from(
            new Set(addresses.map(address => getAddressKey(address)))
        )
            .map(uniqueKey =>
                addresses.find(address => getAddressKey(address) === uniqueKey)
            )
            .filter(
                (address): address is AddressSuggestion => address !== undefined
            );

        setSuggestedAddressesClean(uniqueAddresses);
    };

    const form = useForm({
        defaultValues: {
            name: userData?.fullName,
            country: countryCode,
            address1: "",
            address2: "",
            city: "",
            state: "",
            zip: ""
        },
        mode: "onBlur"
    });

    const { setError, handleSubmit } = form;

    const zipInputRef = useRef<HTMLInputElement>(null);

    const { setValue, watch, control } = form;

    const country = watch("country");
    const address1 = watch("address1");
    const address2 = watch("address2");
    const state = watch("state");
    const zip = watch("zip");
    const name = watch("name");
    const city = watch("city");

    const debouncedGetAddressSuggestions = debounce(async (zip: string) => {
        if (zip === lastAddressDebounce || !selectedCountry) return;
        setLastAddressDebounce(zip);

        const suggestions = await getAddressSuggestions(
            zip,
            selectedCountry,
            {
                administrativeArea:
                    selectedCountry === Alpha2.PR ? Alpha2.PR : undefined
            },
            5
        );
        setSuggestedAddresses(suggestions);
        setHintsOpen(true);
    }, 300);

    const getName = ({
        shipToAddress,
        userData,
        language
    }: GetNameOptions): string | undefined => {
        if (shipToAddress?.name) {
            return shipToAddress.name;
        }

        return language === "ja" ? userData?.firstName : userData?.lastName;
    };

    useEffect(() => {
        setZipManuallyChanged(false);
    }, []);

    useEffect(() => {
        if (!zipManuallyChanged) return;
        if (zip && zip.length >= 2) {
            debouncedGetAddressSuggestions(zip);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [zip, zipManuallyChanged]);

    useEffect(() => {
        const name = getName({
            shipToAddress: shipToAddress || undefined,
            userData: userData || undefined,
            userCountry,
            language
        });

        setValue("name", name);

        if (shipToAddress && formType === "shipping") {
            setValue("country", shipToAddress.country);
            setValue("address1", shipToAddress.address1);
            setValue("address2", shipToAddress.address2);
            setValue("city", shipToAddress.city);
            setValue("state", shipToAddress.state);
            setValue("zip", shipToAddress.zip);
        }
        if (
            (formType === "account" || formType === "shipping") &&
            mainAddress
        ) {
            setValue("country", mainAddress.country);
            setValue("address1", mainAddress.address1);
            setValue("address2", mainAddress.address2);
            setValue("city", mainAddress.city);
            setValue("state", mainAddress.state);
            setValue("zip", mainAddress.zip);
        }
    }, [language]);

    useEffect(() => {
        if (setSelectedState) {
            setSelectedState(state);
        }
    }, [state]);

    useEffect(() => {
        if (selectedCountry || countryCode) {
            const fetchStates = async (): Promise<void> => {
                const statesList = await getStates(
                    (selectedCountry as Alpha2) || (countryCode as Alpha2)
                );
                setStates(
                    statesList.map(
                        (state: { label: string; value: string }) => ({
                            label: state.label,
                            value: state.value
                        })
                    )
                );
            };

            fetchStates();
        }
    }, [selectedCountry, countryCode]);

    useEffect(() => {
        if (country) {
            setSelectedCountry(country as Alpha2);
        }
    }, [country]);

    const countryConfig = getCountries(false)
        .filter(country => country.isSupported || country.redirect)
        .map(country => ({ label: country.name, value: country.alpha2 }))
        .sort((a, b) => a.label.localeCompare(b.label));

    const billingAddressConfig = useMemo(
        () =>
            getCountryConfig((selectedCountry as Alpha2) || countryCode, false),
        [selectedCountry, countryCode]
    );

    const shouldRenderState = useMemo(
        () =>
            !billingAddressConfig?.marketExceptions.hiddenShippingProvince &&
            states.length > 1,
        [billingAddressConfig, states]
    );

    const setFormErrors = (
        fields: (keyof FormValues)[],
        message: string
    ): void => {
        fields.forEach(field => {
            setError(field, {
                type: "manual",
                message
            });
        });
    };

    useEffect(() => {
        if (formType === "billing") {
            const data = {
                name,
                address1,
                address2,
                city,
                state,
                country,
                zip
            };
            setBillingAddress(data as AddressType);
        }
    }, [zip, state, address1, address2, country, name]);

    const { getShipping } = useFetchQoutes();

    const handleFormSubmit = async (data: FormValues): Promise<void> => {
        setIsLoading(true);
        const customerData = {
            mainAddress: {
                name: data?.name,
                country: data?.country === "PR" ? "US" : data?.country,
                address1: data?.address1,
                address2: data?.address2,
                city: "",
                state: "",
                zip: data?.zip
            }
        };
        try {
            if (formType === "account") {
                setMainAddress(data as unknown as AddressType);
                try {
                    await updateCustomer(
                        customerData as unknown as AddressType,
                        href || "",
                        userToken || ""
                    );
                    if (billingAddressConfig?.isNoPurchaseMarket) {
                        goToNextSection();
                        return;
                    }
                    await getShipping({
                        country: shipToAddress?.country as Alpha2,
                        state: "",
                        city: "",
                        address1: shipToAddress?.address1 || "",
                        address2: shipToAddress?.address2 || "",
                        zip: shipToAddress?.zip || ""
                    });
                    goToNextSection();
                    return;
                } catch (error) {
                    showToast(
                        translate("error_updating_main_address"),
                        "error"
                    );
                    return;
                }
            }

            /* eslint-disable no-param-reassign */
            if (selectedCountry === "PR") data.state = "PR";

            if (updateMainAddress) {
                await updateCustomer(
                    customerData as unknown as AddressType,
                    href || "",
                    userToken || ""
                );
            }

            await getShipping({
                country: data.country as Alpha2,
                state: "",
                city: "",
                address1: data.address1,
                address2: data.address2,
                zip: data?.zip
            });

            setShipToAddress(data as unknown as AddressType);
            goToNextSection();
        } catch (error) {
            showToast(translate("error_invalid_mailing_address"), "error");
            setFormErrors(["address1"], "");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmitErrors = useCallback((): void => {
        const { errors } = form.formState;
        if (Object.keys(errors).length > 0) {
            const fieldMapping: Record<string, string> = {
                name: "billing_full_name",
                address1: "billing_address_1",
                address2: "billing_address_2",
                city: "billing_city",
                country: "billing_country",
                state: "billing_state",
                zip: "billing_zip"
            };

            const mappedErrors = Object.keys(errors).map(
                error => fieldMapping[error]
            );

            mixpanelService.trackEvent(
                MixpanelEvent.SHIPPING_VALIDATION_ERROR,
                {
                    error_name: mappedErrors
                }
            );
        }
    }, [form.formState]);

    return (
        <div css={styles.container}>
            <div css={styles.title(theme)}>{title}</div>
            <FormProvider {...form}>
                <form
                    onSubmit={handleSubmit(
                        handleFormSubmit,
                        handleFormSubmitErrors
                    )}
                >
                    <div css={styles.row(theme)}>
                        <div css={styles.fieldContainer.half(theme)}>
                            <TextField
                                label={translate("shipping_full_name")}
                                type="text"
                                name="name"
                                data-testid="shipping_full_name"
                                rules={validationRules.name}
                            />
                        </div>
                        <div css={styles.fieldContainer.half(theme)}>
                            <SelectDropdown
                                key={watch("country")}
                                className="country-dropdown"
                                name="country"
                                label={translate("shipping_select_country")}
                                data-testid="shipping_select_country"
                                options={countryConfig}
                                rules={{ required: true }}
                                value={watch("country")}
                                defaultValue={countryCode}
                                disabled={countryDisabled}
                            />
                        </div>
                    </div>
                    <div css={styles.row(theme)}>
                        <div
                            css={styles.fieldContainer.half(theme)}
                            ref={zipInputRef}
                        >
                            <TextField
                                label={translate("shipping_zip_code")}
                                data-testid="shipping_zip_code"
                                type="text"
                                name="zip"
                                rules={validateZipCode(
                                    translate,
                                    currentCountryConfig
                                )}
                                onChange={(event): void => {
                                    const formattedZip = formatZipCode(
                                        event.target.value
                                    );
                                    setValue("zip", formattedZip);
                                    setZipManuallyChanged(true);
                                    setHintsOpen(true);
                                }}
                            />
                            <AddressSuggestionDropdown
                                suggestedAddresses={suggestedAddresses}
                                selectedCountry={selectedCountry as Alpha2}
                                setSuggestedAddresses={setSuggestedAddresses}
                                hintsOpen={hintsOpen}
                                setHintsOpen={setHintsOpen}
                                anchorEl={zipInputRef.current}
                                setLastAddressDebounce={setLastAddressDebounce}
                                onSuggestionSelect={(): void => {
                                    setZipManuallyChanged(false);
                                    setHintsOpen(false);
                                }}
                            />
                        </div>
                        <div
                            css={[
                                styles.fieldContainer.half(theme),
                                true,
                                styles.labelWithTooltip(theme)
                            ]}
                        >
                            <TextField
                                label={
                                    <>
                                        {translate("shipping_address_2")}
                                        {!billingAddressConfig?.marketExceptions
                                            .hiddenTooltip && (
                                            <InfoTooltip
                                                content={translate(
                                                    "shipping_address_2_info"
                                                )}
                                            />
                                        )}
                                    </>
                                }
                                data-testid="shipping_address_2"
                                type="text"
                                name="address2"
                                rules={validationRules.address}
                            />
                        </div>
                    </div>
                    <div css={styles.rowHalf(theme)}>
                        {!billingAddressConfig?.marketExceptions
                            .hiddenShippingCity && (
                            <div css={styles.fieldContainer.half(theme)}>
                                <TextField
                                    label={translate("shipping_city")}
                                    data-testid="shipping_city"
                                    type="text"
                                    name="city"
                                    rules={validationRules.city}
                                />
                            </div>
                        )}
                        {shouldRenderState && (
                            <div css={styles.fieldContainer.quarter}>
                                {billingAddressConfig?.marketExceptions
                                    .showStatesField ? (
                                    <TextField
                                        label={translate("shipping_state")}
                                        data-testid="shipping_state"
                                        type="text"
                                        name="state"
                                        rules={{ required: true }}
                                    />
                                ) : (
                                    <SelectDropdown
                                        key={watch("state")}
                                        css={applyConditionalStyles(
                                            styles.stateDropdown(theme),
                                            shouldRenderState,
                                            styles.muiOverrides
                                        )}
                                        name="state"
                                        label={translate("shipping_state")}
                                        data-testid="shipping_state"
                                        options={states.map(state => ({
                                            label: state.label,
                                            value: state.value
                                        }))}
                                        rules={{ required: true }}
                                        value={watch("state")}
                                    />
                                )}
                            </div>
                        )}
                        <div
                            css={
                                shouldRenderState
                                    ? styles.fieldContainer.quarter
                                    : styles.fieldContainer.half(theme)
                            }
                        >
                            <TextField
                                label={translate("shipping_address_1")}
                                data-testid="shipping_address_1"
                                type="text"
                                name="address1"
                                rules={validationRules.address}
                            />
                        </div>
                    </div>
                    {showSubmitButton && (
                        <div css={styles.submitButtonContainer(theme)}>
                            {isLoading ? (
                                <div css={styles.continueButton}>
                                    <Spinner height="20px" />
                                </div>
                            ) : (
                                submitButton || translate("continue")
                            )}
                        </div>
                    )}
                </form>
            </FormProvider>
            <DevTool control={control} />
        </div>
    );
}
