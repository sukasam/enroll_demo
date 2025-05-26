import PrimaryButton from "Components/shared/PrimaryButton";
import T, { useTranslate } from "Components/shared/Translate";
import { useCountryConfig } from "Constants/countryConfig";
import Image from "next/image";

export default function Guide() {
    const t = useTranslate();
    const countryConfig = useCountryConfig();
    const { marketExceptions } = countryConfig;

    const imageSrc = marketExceptions?.thankYouImage
        ? marketExceptions?.thankYouImage
        : "/img/mx-confirmation-success.jpg";

    return (
        <div className="tile feel-great">
            <div className="image">
                <Image
                    src={imageSrc}
                    alt="Onboarding guide illustration"
                    width={200}
                    height={100}
                    style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover"
                    }}
                    data-testid="guide_image"
                />
            </div>
            <div className="content">
                <div className="title" data-testid="guide_title">
                    <T>thank_you_onboarding_guide</T>
                </div>
                <div className="description" data-testid="guide_description">
                    <T>thank_you_onboarding_guide_description</T>
                </div>
                <PrimaryButton
                    href={t("thank_you_guide_link")}
                    target="_blank"
                    data-testid="guide_button"
                    id="download_onboarding"
                >
                    <T>thank_you_download_today</T>
                </PrimaryButton>
            </div>
        </div>
    );
}
