/** @jsxImportSource @emotion/react */
import { Checkbox } from "@mui/material";
import LocalImage from "Components/shared/LocalImage";
import styles from "./styles";

export default function StyledCheckbox(props) {
    const { onChange } = props;
    return (
        <Checkbox
            css={styles}
            {...props}
            checkedIcon={
                <LocalImage
                    height="24"
                    priority
                    src="/svg/checked-checkbox.svg"
                    width="24"
                    alt="Selected checkbox"
                />
            }
            icon={
                <LocalImage
                    height="24"
                    priority
                    src="/svg/unchecked-checkbox.svg"
                    width="24"
                    alt="Unselected checkbox"
                />
            }
            onChange={event => {
                if (onChange) {
                    onChange(event);
                }
            }}
        />
    );
}
