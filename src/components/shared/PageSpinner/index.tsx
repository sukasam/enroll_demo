/** @jsxImportSource @emotion/react */
import Spinner from "Components/shared/Spinner";
import styles from "./styles";

function PageSpinner(): JSX.Element {
    return (
        <div css={styles}>
            <Spinner height="100px" data-testid="page_spinner" dark />
        </div>
    );
}

export default PageSpinner;
