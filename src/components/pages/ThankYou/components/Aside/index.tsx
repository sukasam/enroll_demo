/** @jsxImportSource @emotion/react */
import PrimaryButton from "Components/shared/PrimaryButton";
import T, { useTranslate } from "Components/shared/Translate";
import { useCountryConfig } from "Constants/countryConfig";
import { useOrder } from "Contexts/OrderContext";
import Image from "next/image";
import Link from "next/link";
import styles from "./styles";

interface AsideProps {
    feedbackComponent?: React.ReactNode;
}

export default function Aside({ feedbackComponent }: AsideProps): JSX.Element {
    const translate = useTranslate();
    const { orderResult } = useOrder();
    const isCashPayment = orderResult?.transactions?.items[0].method === "Cash";
    const countryConfig = useCountryConfig();
    const marketExceptions = countryConfig?.marketExceptions;

    const imageSrc = marketExceptions?.thankYouImage
        ? marketExceptions?.thankYouImage
        : "/img/feel-great-guide.jpg";

    return (
        <div css={styles}>
            <div className="tile aside office">
                <Image
                    src="/img/office.jpg"
                    alt="Office location"
                    width={150}
                    height={100}
                    style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover"
                    }}
                    data-testid="office_image"
                    quality={75}
                    priority
                />
                <div className="title" data-testid="office_title">
                    <T>thank_you_ready_to_get_started</T>
                </div>
                <div className="description" data-testid="office_description">
                    <T>thank_you_visit_office</T>
                </div>
                <div className="button">
                    <PrimaryButton
                        dark
                        href={translate("thank_you_guide_link")}
                        target="_blank"
                        data-testid="office_button"
                        id="go_to_office"
                    >
                        <T>thank_you_get_started_button</T>
                    </PrimaryButton>
                </div>
            </div>

            {feedbackComponent}

            {countryConfig?.marketExceptions.showOnboardingGuide ? (
                <div className="tile feel-great">
                    <div className="image">
                        <Image
                            src={imageSrc}
                            alt="guide_image"
                            width={200}
                            height={100}
                            style={{
                                width: "100%",
                                height: "auto",
                                objectFit: "cover"
                            }}
                            data-testid="guide_image_mobile"
                        />
                    </div>
                    <div className="content">
                        <div className="title" data-testid="guide_title">
                            <T>thank_you_onboarding_guide</T>
                        </div>
                        <div
                            className="description"
                            data-testid="guide_description"
                        >
                            <T>thank_you_onboarding_guide_description</T>
                        </div>
                        <PrimaryButton
                            href={translate("thank_you_guide_link")}
                            target="_blank"
                            data-testid="guide_button_mobile"
                            id="download_onboarding"
                        >
                            <T>thank_you_download_today</T>
                        </PrimaryButton>
                    </div>
                </div>
            ) : null}

            <div className="tile aside contact">
                <div className="title" data-testid="contact_title">
                    <T>thank_you_questions_help</T>
                </div>
                <div className="info-container">
                    {!marketExceptions?.hideUnicityPhone && (
                        <div className="info">
                            <div className="image-container">
                                <Image
                                    alt=""
                                    height="18"
                                    src="/svg/phone.svg"
                                    width="12"
                                    data-testid="contact_phone_image"
                                />
                            </div>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: translate("thank_you_contact_phone")
                                }}
                                data-testid="contact_phone_value"
                            />
                        </div>
                    )}
                    {isCashPayment && (
                        <div className="info">
                            <div className="image-container">
                                <Image
                                    alt=""
                                    height="18"
                                    src="/svg/phone.svg"
                                    width="12"
                                    data-testid="whatsapp_phone_image"
                                />
                            </div>
                            <span data-testid="whatsapp_phone_value">
                                <T>thank_you_whatsapp_phone</T>
                            </span>
                        </div>
                    )}
                    <div className="info">
                        <div className="image-container">
                            <Image
                                alt=""
                                height="12"
                                src="/svg/email.svg"
                                width="18"
                                data-testid="contact_email_image"
                            />
                        </div>
                        <span data-testid="contact_email_value">
                            <Link
                                className="links"
                                href={`mailto:${translate(
                                    "thank_you_contact_email"
                                )}`}
                            >
                                <T>thank_you_contact_email</T>
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
