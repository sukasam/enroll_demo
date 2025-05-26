/** @jsxImportSource @emotion/react */
import PageLoader from "Components/shared/PageLoader";
import { useTranslate } from "Components/shared/Translate";
import { useState } from "react";
import CreateAccountForm from "./components/Form";
import styles from "./styles";

function CreateAccount(): JSX.Element {
    const translate = useTranslate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    return (
        <div css={styles} data-test-id="create_account_account_information">
            {isLoading && <PageLoader />}
            <h1 className="formTitle">
                {translate("create_account_account_information")}
            </h1>
            <CreateAccountForm
                setIsLoading={setIsLoading}
                isLoading={isLoading}
            />
        </div>
    );
}

export default CreateAccount;
