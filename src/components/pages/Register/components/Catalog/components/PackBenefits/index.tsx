/** @jsxImportSource @emotion/react */
import Checkmark from "Components/shared/Checkmark";
import { useTranslate } from "Components/shared/Translate";
import { Alpha2 } from "Constants/countryConfig/enums";
import { CompletePack } from "Constants/countryConfig/types";
import { getCookie } from "cookies-next";
import useProductConfig from "Hooks/useProductConfig";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { toAlpha3 } from "Services/locale";
import styles from "./styles";

function PackBenefits(): JSX.Element {
    const productConfig = useProductConfig();
    const t = useTranslate();

    const country = getCookie("country") as Alpha2;
    const alpha3Country = toAlpha3(country);

    const filteredPacks = useMemo(() => {
        if (!productConfig) {
            return null;
        }

        return productConfig.packs
            .filter(pack => pack.variants.length > 0)
            .filter(pack => !pack.isDigital) as CompletePack[];
    }, [productConfig]);
    const description = t("catalog_modal_business_builder_description");
    const benefits = filteredPacks?.flatMap(pack =>
        pack.mainFeatures.map(mainFeature => t(mainFeature))
    );
    const linkLearnMore = t("right_column_learn_more_link").replace(
        "{{alpha2}}",
        alpha3Country.toLowerCase() || "usa"
    );

    return (
        <div css={styles}>
            <h2 className="title" data-testid="starter_kit_header">
                {t("right_column_your_starter_kit")}
            </h2>
            <div
                className="description"
                data-testid="product_description_recommended_label"
                dangerouslySetInnerHTML={{
                    __html: description
                }}
            />
            <div className="list">
                {benefits
                    ?.slice(0, country === "JP" || country === "PH" ? 3 : 4)
                    .map((benefit, index) => (
                        <div className="list-item" key={benefit}>
                            <div
                                className="icon"
                                data-testid={`benefit_${index + 1}_icon`}
                            >
                                <Checkmark />
                            </div>
                            <div
                                className="benefit"
                                data-testid={`benefit_${index + 1}_label`}
                            >
                                {benefit}
                            </div>
                        </div>
                    ))}
            </div>
            <div className="slide-link">
                <Link
                    href={linkLearnMore}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-testid="right_column_learn_more"
                >
                    {t("right_column_learn_more")}
                    <Image
                        alt=""
                        src="/svg/external-link.svg"
                        width={16}
                        height={16}
                        quality={85}
                    />
                </Link>
            </div>
        </div>
    );
}

export default PackBenefits;
