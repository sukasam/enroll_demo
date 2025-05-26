/** @jsxImportSource @emotion/react */
import T from "Components/shared/Translate";
import styles from "./styles";

interface BankInfoProps {
    titleKey: string;
    infoKey: string;
}

function BankWireInfo(props: BankInfoProps): JSX.Element {
    const { titleKey, infoKey } = props;
    return (
        <div css={styles}>
            <div className="bank_info">
                <div className="title" data-testid={`${titleKey}_label`}>
                    <T>{titleKey}</T>
                </div>
                <div className="info" data-testid={`${titleKey}_value`}>
                    <T>{infoKey}</T>
                </div>
            </div>
        </div>
    );
}

export default BankWireInfo;
