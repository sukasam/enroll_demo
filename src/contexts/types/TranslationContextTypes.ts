import { Alpha2 } from "Constants/countryConfig/enums";

export type TranslationContextType = {
    translations: Record<string, string>;
    basicTranslations: Record<string, string>;
    country: string;
    language: string;
    setTranslations: (translations: Record<string, string>) => void;
    setBasicTranslations: (basicTranslations: Record<string, string>) => void;
    setCountry: (country: Alpha2) => void;
    setLanguage: (language: string) => void;
    fetchTranslations: (country: string, language: string) => void;
};
