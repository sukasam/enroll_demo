/** @jsxImportSource @emotion/react */
import { DevTool } from "@hookform/devtools";
import { Checkbox, FormControlLabel } from "@mui/material";
import TextField from "Components/shared/Form/components/TextField";
import ProcessingPopup from "Components/shared/ProcessingPopup";
import showToast from "Components/shared/ShowToaster";
import Spinner from "Components/shared/Spinner";
import { updateAnchorTags, useTranslate } from "Components/shared/Translate";
import { useCountryConfig } from "Constants/countryConfig";
import { useOrder } from "Contexts/OrderContext";
import { useUser } from "Contexts/UserContext";
import upgradeCustomerWithoutPurchase, {
    UpgradeCustomerDataPatch,
    UpgradeCustomerDataPost
} from "Hydra/upgradeCustomerWithoutPurchase";
import router from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import styles from "./styles";
import validationRules from "./validationRules";

type FormValues = {
    agreeToDistributorTerms: boolean;
    eSignature: string;
    [key: string]: any;
};

function DistributorAgreementsSection(): JSX.Element {
    const form = useForm<FormValues>({
        mode: "onBlur",
        reValidateMode: "onBlur"
    });
    const { goToNextSection, userToken, href } = useUser();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = form;

    const {
        setSignedTerms,
        setTaxId,
        setSecondaryTaxId,
        setUserSignature,
        setSignatureDateTimeStamp
    } = useOrder();
    const { mainAddress } = useUser();
    const translate = useTranslate();
    const countryConfig = useCountryConfig();
    const countryCode = countryConfig?.alpha2;
    const isNoPurchaseMarket = countryConfig?.isNoPurchaseMarket;
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const onSubmit = async (data: FormValues): Promise<void> => {
        setSignedTerms(data.agreeToDistributorTerms);
        setSignatureDateTimeStamp(new Date());
        setUserSignature(data.eSignature);
        setIsLoading(true);
        if (data.RFC && data.CURP) {
            setTaxId(data.RFC);
            setSecondaryTaxId(data.CURP);
        }
        if (data.PID) {
            setTaxId(data.PID);
        }
        if (data.TC) {
            setTaxId(data.TC);
        }
        if (data.PAN) {
            setTaxId(data.PAN);
        }

        if (isNoPurchaseMarket && href && userToken && mainAddress) {
            setIsProcessing(true);
            const taxId = data.TC || data.PAN;
            // HearBeDragons : The API Patch and Post update diffrent data we will need to make both calls
            const upgradeDataPatch: UpgradeCustomerDataPatch = {
                status: "Active",
                type: "Associate",
                signature: {
                    value: data.eSignature.trim()
                }
            };

            const upgradeDataPost: UpgradeCustomerDataPost = {
                mainAddress: {
                    city: mainAddress?.city,
                    country: mainAddress?.country,
                    zip: mainAddress?.zip,
                    address1: mainAddress?.address1,
                    address2: mainAddress?.address2,
                    state: mainAddress?.state
                }
            };

            if (taxId) {
                upgradeDataPost.taxTerms = {
                    taxId
                };
                upgradeDataPost.identification = {
                    documentId: taxId,
                    documentType: "Passport"
                };
            }

            try {
                await upgradeCustomerWithoutPurchase(
                    upgradeDataPost,
                    href,
                    userToken,
                    "POST"
                );
                await upgradeCustomerWithoutPurchase(
                    upgradeDataPatch,
                    href,
                    userToken,
                    "PATCH"
                );
                mixpanelService.trackEvent(MixpanelEvent.AGREEMENTS_ACCEPTED, {
                    enrollment_with_payment: !isNoPurchaseMarket
                });
                mixpanelService.trackEvent(MixpanelEvent.ENROLLMENT_COMPLETED, {
                    enrollment_with_payment: false,
                    payment_method: "none"
                });
                router.push({
                    pathname: "/thank-you",
                    query: { noPurchase: true }
                });
            } catch (error: any) {
                setIsProcessing(false);
                showToast(translate(error.message), "error");
            }
        } else {
            setIsProcessing(false);
            setIsLoading(false);
            mixpanelService.trackEvent(MixpanelEvent.AGREEMENTS_ACCEPTED, {
                enrollment_with_payment: !isNoPurchaseMarket
            });
            goToNextSection();
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        e.target.value = e.target.value.toLocaleUpperCase();
    };

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const fieldMapping: Record<string, string> = {
                PAN: "PAN",
                RFC: "RFC",
                CURP: "CURP",
                eSignature: "signature",
                agreeToDistributorTerms: "TandC"
            };

            const mappedErrors = Object.keys(errors).map(
                error => fieldMapping[error]
            );

            mixpanelService.trackEvent(
                MixpanelEvent.AGREEMENTS_VALIDATION_ERROR,
                {
                    error_name: mappedErrors
                }
            );
        }
    }, [errors, form.formState]);

    const getButtonLabel = (): string => {
        if (isNoPurchaseMarket) {
            return translate("button_complete_enrollment");
        }
        return translate("button_continue");
    };

    const renderButton = (): JSX.Element => {
        if (isLoading) {
            return (
                <div
                    css={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Spinner height="20px" />
                </div>
            );
        }
        return <span>{getButtonLabel()}</span>;
    };

    return (
        <div>
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div
                        css={styles.formField}
                        data-testid="distributor_agreements_form_field"
                    >
                        {errors.agreeToDistributorTerms && (
                            <p css={styles.errorTerms}>
                                {translate(
                                    errors.agreeToDistributorTerms.message
                                )}
                            </p>
                        )}
                        <FormControlLabel
                            data-testid="distributor_agreements_checkbox"
                            css={styles.agreementCheckbox}
                            control={
                                <Checkbox
                                    {...register("agreeToDistributorTerms", {
                                        required: "agreement_must_agree"
                                    })}
                                    name="agreeToDistributorTerms"
                                />
                            }
                            label={
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: `${updateAnchorTags(
                                            translate(
                                                "agreement_checkbox_text",
                                                {
                                                    terms_url: translate(
                                                        "agreement_by_terms_url",
                                                        {
                                                            alpha2:
                                                                countryCode ||
                                                                "us"
                                                        }
                                                    )
                                                }
                                            )
                                        )}`
                                    }}
                                />
                            }
                        />

                        <div
                            css={styles.agreementText}
                            data-testid="distributor_agreements_text"
                            dangerouslySetInnerHTML={{
                                __html: `${updateAnchorTags(
                                    translate("agreement_by_checking_box", {
                                        terms_url: translate(
                                            "agreement_by_terms_url",
                                            { alpha2: countryCode || "us" }
                                        ),
                                        compensation_url: translate(
                                            "agreement_by_compensation_url",
                                            { alpha2: countryCode || "us" }
                                        ),
                                        policies_url: translate(
                                            "agreement_by_policies_url",
                                            { alpha2: countryCode || "us" }
                                        )
                                    }).replace(
                                        /<a\s/g,
                                        '<a style="color: inherit; text-decoration: underline;" '
                                    )
                                )}`
                            }}
                        />
                    </div>
                    {countryConfig?.marketExceptions.hasSecondaryTaxId && (
                        <div
                            css={styles.optionalFields}
                            data-testid="distributor_agreements_optional_fields"
                        >
                            <div css={styles.taxFieldsContainer}>
                                {countryConfig.marketExceptions.secondaryTaxIdData?.map(
                                    (taxId, index, array) => (
                                        <TextField
                                            key={`tax_input_${taxId.label}`}
                                            css={[
                                                styles.taxField,
                                                array.length === 1 &&
                                                    styles.singleTaxField
                                            ]}
                                            label={taxId.label}
                                            name={taxId.label}
                                            rules={validationRules[taxId.label]}
                                            type="text"
                                            data-testid={`tax_input_${taxId.label}`}
                                            onChange={handleInputChange}
                                            capitalize
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    )}
                    <div css={styles.singleField}>
                        <TextField
                            css={styles.eSignatureField}
                            label={translate("agreement_esignature_label")}
                            name="eSignature"
                            rules={validationRules.eSignature}
                            type="text"
                            data-testid="agreement_esignature_label"
                        />
                    </div>

                    {/* TODO: we have to update and reuse the PrimaryButton component to normalize the button styles and behavior */}
                    <button
                        type="submit"
                        data-testid="distributor_agreements_continue_button"
                        css={styles.continueButton}
                    >
                        {renderButton()}
                    </button>
                </form>
            </FormProvider>
            <DevTool control={form.control} />
            {isProcessing && <ProcessingPopup />}
        </div>
    );
}

export default DistributorAgreementsSection;
