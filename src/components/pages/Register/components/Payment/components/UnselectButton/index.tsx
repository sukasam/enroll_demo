/** @jsxImportSource @emotion/react */
import { useTranslate } from "Components/shared/Translate";
import { TransactionMethod } from "Hydra/order/types";
import styles from "./styles";

type UnselectButtonProps = {
    selectPaymentMethod: (paymentMethod: TransactionMethod | null) => void;
};

function UnselectButton(props: UnselectButtonProps): JSX.Element {
    const { selectPaymentMethod } = props;
    const translate = useTranslate();

    return (
        <div css={styles.actionButton} data-testid="payment_unselect_button">
            <button
                type="button"
                css={styles.changeButton}
                onClick={(): void => {
                    selectPaymentMethod(null);
                }}
            >
                {translate("payment_unselect_button")}
            </button>
        </div>
    );
}

export default UnselectButton;
