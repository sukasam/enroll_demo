/** @jsxImportSource @emotion/react */
import T from "Components/shared/Translate";
import styles from "./styles";

function CashPayment(): JSX.Element {
    return (
        <div css={styles}>
            <div className="cash_payment">
                <T>payment_cash_label</T>
            </div>
            <div className="cash_payment_message">
                <T allowHTML>payment_cash_payment_message</T>
            </div>
        </div>
    );
}

export default CashPayment;
