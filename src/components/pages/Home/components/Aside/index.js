import { useTranslate } from "Components/shared/Translate";
import Image from "next/image";
import Link from "next/link";

export default function Aside() {
    const translate = useTranslate();

    return (
        <div className="tile aside">
            <div className="banner">
                <div className="overlay" data-testid="home_page_overlay" />
                <div className="content">
                    <div
                        className="title"
                        data-testid="right_column_starting_your_business_just_got_easier"
                    >
                        {translate(
                            "right_column_starting_your_business_just_got_easier"
                        )}
                    </div>
                </div>
            </div>
            <div
                className="title"
                data-testid="right_column_your_business_your_way"
            >
                {translate("right_column_your_business_your_way")}
            </div>
            <p data-testid="right_column_unicity_help_become_leader">
                {translate("right_column_unicity_help_become_leader")}
            </p>
            <ul>
                <li data-testid="right_column_wholesale_product_pricing">
                    {translate("right_column_wholesale_product_pricing")}
                </li>
                <li data-testid="right_column_earn_commissions_product_sales">
                    {translate("right_column_earn_commissions_product_sales")}
                </li>
                <li data-testid="right_column_build_your_business_your_way">
                    {translate("right_column_build_your_business_your_way")}
                </li>
                <li data-testid="right_column_growth_incentives">
                    {translate("right_column_growth_incentives")}
                </li>
                <li data-testid="right_column_training_education">
                    {translate("right_column_training_education")}
                </li>
                <li data-testid="right_column_business_building_tools">
                    {translate("right_column_business_building_tools")}
                </li>
                <li data-testid="right_column_networking_opportunities">
                    {translate("right_column_networking_opportunities")}
                </li>
                <li data-testid="right_column_be_part_of_community">
                    {translate("right_column_be_part_of_community")}
                </li>
            </ul>
            <Link
                href={translate("right_column_learn_more_link")}
                target="_blank"
                rel="noreferrer noopener"
                data-testid="right_column_learn_more"
            >
                {translate("right_column_learn_more")}
                <Image
                    alt=""
                    src="/svg/external-link.svg"
                    width={16}
                    height={16}
                    quality={85}
                />
            </Link>
        </div>
    );
}
