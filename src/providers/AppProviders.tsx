import { ThemeProvider } from "@mui/material/styles";
import { OrderProvider } from "Contexts/OrderContext";
import { ProductProvider } from "Contexts/ProductContext";
import { UserProvider } from "Contexts/UserContext";
import { TranslationProvider } from "Contexts/translation";
import { lightTheme } from "Styles/theme/themes";
import { ReactNode } from "react";

interface AppProvidersProps {
    children: ReactNode;
}

export default function AppProviders({
    children
}: AppProvidersProps): JSX.Element {
    return (
        <ThemeProvider theme={lightTheme}>
            <TranslationProvider>
                <ProductProvider>
                    <OrderProvider>
                        <UserProvider>{children}</UserProvider>
                    </OrderProvider>
                </ProductProvider>
            </TranslationProvider>
        </ThemeProvider>
    );
}
