/** @jsxImportSource @emotion/react */
import { Radio } from "@mui/material";
import LocalImage from "Components/shared/LocalImage";
import styles from "./styles";

type StyledRadioProps = {
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    name: string;
    "data-testid": string;
};

export default function StyledRadio(props: StyledRadioProps): JSX.Element {
    return (
        <Radio
            className="radio"
            css={styles}
            {...props}
            checkedIcon={
                <LocalImage
                    height="24"
                    priority
                    src="/checked-radio.svg"
                    width="24"
                />
            }
            icon={
                <LocalImage
                    className="darkerImage"
                    height="24"
                    priority
                    src="/unchecked-radio.svg"
                    width="24"
                />
            }
        />
    );
}
