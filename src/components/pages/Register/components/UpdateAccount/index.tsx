/** @jsxImportSource @emotion/react */
import PageLoader from "Components/shared/PageLoader";
import T from "Components/shared/Translate";
import { useState } from "react";
import UpdateAccountForm from "./components/Form";
import styles from "./styles";

function UpdateAccount(): JSX.Element {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    return (
        <div css={styles} data-test-id="create_your_account_section">
            {isLoading && <PageLoader />}
            <h1 className="formTitle">
                <T>create_account_account_information</T>
            </h1>
            <UpdateAccountForm
                setIsLoading={setIsLoading}
                isLoading={isLoading}
            />
        </div>
    );
}

export default UpdateAccount;
