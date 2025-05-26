/** @jsxImportSource @emotion/react */
import { useMediaQuery } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import useAvailableLanguages from "Components/pages/Home/components/HomeContent/Form/hooks";
import { Alpha2 } from "Constants/countryConfig/enums";
import { useTranslations } from "Contexts/translation";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import { useRouter } from "next/router";
import { SetStateAction, useEffect } from "react";
import styles from "./styles";

type Language = {
    label: string;
    value: string;
};

const AUTH_ROUTES = ["/login", "/register", "/thank-you"];

export default function LanguageSelect(): JSX.Element | null {
    const { pathname } = useRouter();
    const { language, setLanguage, country, fetchTranslations } =
        useTranslations();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isAuthRoute = AUTH_ROUTES.includes(pathname);
    const isLoginRoute = pathname === "/login";

    const availableLanguages = useAvailableLanguages(
        isLoginRoute ? null : (country as Alpha2)
    );

    // Ensure the current language is valid when available languages change
    useEffect(() => {
        if (availableLanguages.length > 0) {
            const isValidLanguage = availableLanguages.some(
                lang => lang.value === language
            );
            if (!isValidLanguage) {
                // Set to the first available language if current is invalid
                setLanguage(availableLanguages[0].value);
            }
        }
    }, [availableLanguages, language, setLanguage]);

    if (!isAuthRoute || availableLanguages.length === 0) {
        return null;
    }

    const updateLanguage = (e: {
        target: { value: SetStateAction<string> };
    }): void => {
        const newLanguage = e.target.value as string;
        const selectedLanguage = availableLanguages.find(
            lang => lang.value === newLanguage
        );

        setLanguage(newLanguage);
        fetchTranslations(
            isLoginRoute ? selectedLanguage?.defaultCountry || "" : country,
            newLanguage
        );

        // Track language change in analytics
        mixpanelService.registerSuperProperties({
            user_language: newLanguage
        });
        mixpanelService.trackEvent(MixpanelEvent.USER_LANGUAGE_CHANGED, {
            previous_user_language: language,
            user_language: newLanguage,
            event_location: window.location.pathname.split("/")[1]
        });
    };

    return (
        <div
            className="language-select"
            data-testid="language_select_container"
        >
            <FormControl
                variant="outlined"
                sx={{
                    m: 1,
                    minWidth: { xs: 50, sm: 120 },
                    top: "0px"
                }}
                size="small"
            >
                <Select
                    css={styles.select}
                    data-testid="language_select"
                    labelId="languageSelect"
                    id="languageSelect"
                    value={language}
                    label="language"
                    onChange={updateLanguage}
                >
                    {availableLanguages.map((language: Language) => (
                        <MenuItem key={language.value} value={language.value}>
                            {isMobile
                                ? language.label.slice(0, 2)
                                : language.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
