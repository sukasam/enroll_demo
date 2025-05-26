/** @jsxImportSource @emotion/react */
import T from "Components/shared/Translate";
import Image from "next/image";
import styles from "./styles";

function GettingStarted(): React.ReactElement {
    const gettingStartedConfig = [
        {
            title: "create_account_free_easy_to_join",
            description: "create_account_free_easy_to_join_description",
            icon: "/svg/Green-icon.svg"
        },
        {
            title: "create_account_exclusive_member_pricing",
            description: "create_account_exclusive_member_pricing_description",
            icon: "/svg/Blue-icon.svg"
        },
        {
            title: "create_account_earn_rewards",
            description: "create_account_earn_rewards_description",
            icon: "/svg/Pink-icon.svg"
        }
    ];
    return (
        <div css={styles}>
            <div className="getting-started">
                <T>create_account_start_by_creating_account</T>
            </div>
            <div className="getting-started-details">
                <div className="details-container">
                    {gettingStartedConfig.map(item => (
                        <div className="item-container" key={item.title}>
                            <div className="icon-container">
                                <Image
                                    priority
                                    src={item.icon}
                                    alt={item.title}
                                    width={95}
                                    height={95}
                                />
                            </div>
                            <div className="text-container">
                                <div className="title">
                                    <T>{item.title}</T>
                                </div>
                                <div className="description">
                                    <T>{item.description}</T>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GettingStarted;
