/** @jsxImportSource @emotion/react */

import T, { useTranslate } from "Components/shared/Translate";
import { useCountryConfig } from "Constants/countryConfig";
import styles from "./styles";

export default function ProcessingPopup() {
    const translate = useTranslate();
    const countryConfig = useCountryConfig();
    const { isNoPurchaseMarket } = countryConfig;

    return (
        <div css={styles}>
            <div className="popup">
                <div className="top">
                    <div className="loader" data-testid="loader">
                        <div
                            className="outside-line"
                            data-testid="outside-line"
                        />
                        <div
                            className="inside-line"
                            data-testid="inside-line"
                        />
                        <div
                            className="outside-line"
                            data-testid="outside-line"
                        />
                    </div>
                    <div className="title">
                        {isNoPurchaseMarket ? (
                            <T>upgrade_processing</T>
                        ) : (
                            <T>payment_processing</T>
                        )}
                    </div>
                </div>
                {isNoPurchaseMarket ? (
                    <div
                        className="description"
                        dangerouslySetInnerHTML={{
                            __html: translate("upgrade_processing_description")
                        }}
                    />
                ) : (
                    <div
                        className="description"
                        dangerouslySetInnerHTML={{
                            __html: translate("payment_processing_description")
                        }}
                    />
                )}
            </div>
        </div>
    );
}
