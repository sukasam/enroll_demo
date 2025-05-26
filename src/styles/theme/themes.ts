import { createTheme, Theme as MuiTheme } from "@mui/material/styles";
import breakpoints from "../foundation/breakpoints";
import colors from "../foundation/colors";
import spacing from "../foundation/spacing";
import typography from "../foundation/typography";

export interface CustomTheme extends MuiTheme {
    desktopWidth: number;
    primaryButton: string;
}

export const lightTheme = createTheme({
    palette: {
        primary: {
            main: colors.primary.main,
            dark: colors.primary.dark
        },
        secondary: {
            main: colors.secondary.main,
            light: colors.secondary.light
        },
        text: {
            primary: colors.text.primary
        },
        background: {
            default: colors.background.main
        },
        error: {
            main: colors.error.main
        }
    },

    breakpoints: {
        values: breakpoints
    },

    typography: {
        fontFamily: typography.fontFamily.primary,
        fontSize: typography.fontSize.medium,
        h1: {
            fontFamily: typography.fontFamily.primary,
            fontWeight: typography.fontWeight.bold,
            fontSize: typography.fontSize.xxl
        },
        h3: {
            fontFamily: typography.fontFamily.primary,
            fontWeight: typography.fontWeight.bold,
            fontSize: typography.fontSize.xl
        },
        body1: {
            fontFamily: typography.fontFamily.primary,
            fontWeight: typography.fontWeight.regular,
            fontSize: typography.fontSize.medium
        },
        body2: {
            fontFamily: typography.fontFamily.primary,
            fontWeight: typography.fontWeight.medium,
            fontSize: typography.fontSize.small
        },
        button: {
            fontFamily: typography.fontFamily.primary,
            fontWeight: typography.fontWeight.semiBold,
            fontSize: typography.fontSize.large
        },
        caption: {
            fontFamily: typography.fontFamily.primary,
            fontWeight: typography.fontWeight.regular,
            fontSize: typography.fontSize.small
        }
    },

    spacing: (factor: number) => `${factor * 8}px`,

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "34px",
                    textTransform: "none",
                    fontWeight: typography.fontWeight.semiBold,
                    padding: `${spacing.sm} ${spacing.lg}`
                }
            }
        },
        MuiInputLabel: {
            defaultProps: {
                shrink: true
            }
        }
    }
});
