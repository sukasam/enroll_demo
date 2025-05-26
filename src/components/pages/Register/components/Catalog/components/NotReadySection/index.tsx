/** @jsxImportSource @emotion/react */

import PrimaryButton from "Components/shared/PrimaryButton";
import T from "Components/shared/Translate";

import styles from "./styles";

interface Props {
    enrollerId: string | null;
}

export default function NotReadySection({ enrollerId }: Props): JSX.Element {
    return (
        <div css={styles}>
            <div className="wrapper">
                <h2 data-testid="not_ready_to_start_business">
                    <T>not_ready_to_start_business</T>
                </h2>
                <p data-testid="not_ready_to_start_business_description">
                    <T>not_ready_to_start_business_description</T>
                </p>
                <div className="button-wrapper">
                    {/* Without this condition enrollerId is always null 🤷 */}
                    {enrollerId && (
                        <PrimaryButton
                            href={`https://ufeelgreat.com/c/${enrollerId}`}
                            target="_blank"
                            id="catalog_go_to_membership"
                            data-testid="learn_more"
                        >
                            <T>learn_more</T>
                        </PrimaryButton>
                    )}
                </div>
            </div>
        </div>
    );
}
