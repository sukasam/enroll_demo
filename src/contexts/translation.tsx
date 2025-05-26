import { debounce } from "@mui/material";
import { translationsSvc } from "Hydra/translationsSvc";
import { sendEvent } from "Services/googleAnalytics";
import { getCookie, setCookie } from "cookies-next";
import {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

export interface TranslationContextType {
    translations: Record<string, string>;
    basicTranslations: Record<string, string>;
    country: string;
    language: string;
    setTranslations: (translations: Record<string, string>) => void;
    setBasicTranslations: (basicTranslations: Record<string, string>) => void;
    setCountry: (country: string) => void;
    setLanguage: (language: string) => void;
    fetchTranslations: (country: string, language: string) => void;
}

const defaultState: TranslationContextType = {
    translations: {},
    basicTranslations: {},
    country: getCookie("country") || "US",
    language: getCookie("language") || "en",
    setTranslations: () => null,
    setBasicTranslations: () => null,
    setCountry: () => null,
    setLanguage: () => null,
    fetchTranslations: () => null
};

function getInitialState(): TranslationContextType {
    if (typeof window !== "undefined") {
        const cachedData = sessionStorage.getItem("translationContext");
        if (cachedData) {
            try {
                return JSON.parse(cachedData);
            } catch (error) {
                console.error(
                    "Failed to parse translation context data from sessionStorage:",
                    error
                );
            }
        }
    }
    return defaultState;
}

const TranslationContext = createContext<TranslationContextType>(defaultState);
TranslationContext.displayName = "Translations Context";

function HtmlLangSync(props: { language: string }): React.ReactElement | null {
    const { language } = props;
    useEffect(() => {
        if (typeof document !== "undefined" && language) {
            document.documentElement.lang = language;
        }
    }, [language]);
    return null;
}

export function TranslationProvider({
    children,
    testValues
}: {
    children: ReactNode;
    testValues?: Record<string, string>;
}): React.ReactElement {
    const initialState = useMemo(() => getInitialState(), []);

    const [translations, setTranslations] = useState<Record<string, string>>(
        initialState.translations
    );
    const [basicTranslations, setBasicTranslations] = useState<
        Record<string, string>
    >(initialState.basicTranslations);
    const [country, setCountry] = useState<string>(initialState.country);
    const [language, setLanguage] = useState<string>(initialState.language);

    useEffect(() => {
        setCookie("country", country);
        setCookie("language", language);
        sendEvent("page_configration", {
            country,
            language
        });
    }, [country, language]);

    const fetchTranslations = debounce(
        async (_country: string, _language: string) => {
            try {
                const response = await translationsSvc.get({
                    country: _country || country,
                    language: _language || language
                });

                if (response.ok === false) {
                    throw new Error("Failed to fetch translations");
                }
                // const translations = await response.json();
                setTranslations(response);
            } catch (error) {
                console.error("Error fetching translations:", error);
            }
        },
        500
    );

    const updateCachedTranslationData = useCallback(() => {
        if (typeof window !== "undefined") {
            const dataToCache = {
                translations,
                basicTranslations,
                country,
                language
            };
            try {
                sessionStorage.setItem(
                    "translationContext",
                    JSON.stringify(dataToCache)
                );
            } catch (error) {
                console.error(
                    "Failed to save translation context data to sessionStorage:",
                    error
                );
            }
        }
    }, [translations, basicTranslations, country, language]);

    useEffect(() => {
        updateCachedTranslationData();
    }, [updateCachedTranslationData]);

    const value = useMemo(
        () => ({
            translations,
            basicTranslations,
            country,
            language,
            setTranslations,
            setBasicTranslations,
            setCountry,
            setLanguage,
            fetchTranslations
        }),
        [translations, basicTranslations, country, language, fetchTranslations]
    );

    const providerValue = useMemo(
        () => ({
            ...value,
            ...testValues
        }),
        [value, testValues]
    );

    return (
        <TranslationContext.Provider value={providerValue}>
            <HtmlLangSync language={language} />
            {children}
        </TranslationContext.Provider>
    );
}

export const useTranslations = (): TranslationContextType =>
    useContext(TranslationContext);
