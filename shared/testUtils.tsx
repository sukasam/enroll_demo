import { ThemeProvider } from "@mui/material/styles";
import { render, RenderOptions } from "@testing-library/react";
import { lightTheme } from "Styles/theme/themes";

const customRender = (
    ui: React.ReactElement,
    options?: Omit<RenderOptions, "wrapper">
): ReturnType<typeof render> =>
    render(ui, {
        wrapper: ({ children }) => (
            <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
        ),
        ...options
    });

export * from "@testing-library/react";
export { customRender as render };
