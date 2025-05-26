/** @jsxImportSource @emotion/react */
import { Radio } from "@mui/material";
import LocalImage from "Components/shared/LocalImage";
import styles from "./styles";

export default function StyledRadio({ onChange, ...props }) {
    const handleChange = event => {
        if (onChange) {
            onChange(event);
        }
    };

    return (
        <Radio
            css={styles}
            {...props}
            onChange={handleChange}
            checkedIcon={
                <LocalImage
                    height="24"
                    priority
                    src="/checked-radio.svg"
                    width="24"
                    alt="Selected radio button"
                />
            }
            icon={
                <LocalImage
                    height="24"
                    priority
                    src="/unchecked-radio.svg"
                    width="24"
                    alt="Unselected radio button"
                />
            }
        />
    );
}
