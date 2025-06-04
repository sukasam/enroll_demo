import { css, SerializedStyles } from "@emotion/react";

const applyConditionalStyles = (
    baseStyle: SerializedStyles,
    condition: boolean,
    conditionalStyle: SerializedStyles
): SerializedStyles => css`
    ${baseStyle};
    ${condition && conditionalStyle};
`;

export default applyConditionalStyles;
