/** @jsxImportSource @emotion/react */
import T from "Components/shared/Translate";
import Image from "next/image";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import styles from "./styles";

interface PaymentOptionProps {
    hasOption?: boolean;
    imageSrc: string;
    optionLabel: string;
    selectMethod: () => void;
    testIdPrefix: string;
    mixpanelName: string;
}

function PaymentOption(props: PaymentOptionProps): JSX.Element | null {
    const {
        hasOption,
        imageSrc,
        optionLabel,
        selectMethod,
        testIdPrefix,
        mixpanelName
    } = props;

    if (!hasOption) return null;

    return (
        <div css={styles}>
            <div
                className="option"
                role="button"
                tabIndex={0}
                onClick={(): void => {
                    mixpanelService.trackEvent(
                        MixpanelEvent.PAYMENT_SELECT_PAYMENT_METHOD,
                        {
                            payment_method: mixpanelName
                        }
                    );
                    selectMethod();
                }}
                data-testid={`${optionLabel}`}
                onKeyDown={(e: React.KeyboardEvent): void => {
                    if (e.key === "Enter" || e.key === "Space") {
                        selectMethod();
                    }
                }}
            >
                <div className="name">
                    <div className="icon">
                        <Image
                            alt=""
                            height={18}
                            src={imageSrc}
                            width={24}
                            data-testid={`${testIdPrefix}_image`}
                        />
                    </div>
                    <span
                        className="text"
                        data-testid={`${testIdPrefix}_label`}
                    >
                        <T>{optionLabel}</T>
                    </span>
                </div>
                <div className="action">
                    <div>
                        <span
                            data-testid={`${testIdPrefix}_payment_select_button`}
                        >
                            <T>payment_select_button</T>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentOption;
