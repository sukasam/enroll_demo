import { css } from "@emotion/react";
import theme from "Styles/theme";

const colorMap = {
    // bga = background active
    // ca = color active
    // bgh = background hover
    // ch = color hover
    primary: { bg: theme.colors.primary, c: "#ffffff" },
    secondary: { bg: theme.colors.secondary, c: "#ffffff" },
    darkBlue: { bg: theme.darkBlue, c: "#ffffff" }
};
const sizeMap = {
    // xs, lg and xl are random values, feel free to tweak as necessary
    xs: "150px",
    sm: "170px",
    md: "280px",
    lg: "380px",
    xl: "500px"
};

const addColorMap = color => {
    const { bg, c, bga, bgh, ca, ch } = colorMap[color];
    return css`
        background: ${bg};
        color: ${c};
        &:hover {
            background: ${bgh || bg};
            color: ${ch || c};
        }
        &:active {
            background: ${bga || bg};
            color: ${ca || c};
        }
    `;
};

const addSizeMap = size => {
    const width = sizeMap[size];
    return css`
        width: ${width};
    `;
};

export default ({ color, size, width }) => {
    const buttonStyles = [theme.primaryButton];

    if (color && colorMap[color]) {
        buttonStyles.push(addColorMap(color));
    }
    if (size && sizeMap[size]) {
        buttonStyles.push(addSizeMap(size));
    }
    if (width) {
        buttonStyles.push(
            css`
                width: ${width};
            `
        );
    }
    return buttonStyles;
};
