/** @jsxImportSource @emotion/react */
import { Button } from "@mui/material";
import styles from "./styles";

function PrimaryButton(props) {
    const {
        children,
        className,
        color,
        dark,
        href,
        css,
        onClick,
        size,
        ...rest
    } = props;

    return (
        <Button
            className={dark ? "dark" : className || ""}
            css={styles({ color, size, css })}
            href={href}
            onClick={onClick}
            suppressHydrationWarning
            {...rest}
        >
            {children}
        </Button>
    );
}
export default PrimaryButton;
