import { useTranslations } from "Contexts/translation";
import { useMemo } from "react";
import countries from "./countries";
import { Alpha2 } from "./enums";
import {
    CountryConfig,
    Locale,
    SupportedCountryConfig,
    UnsupportedCountryConfig
} from "./types";

// This makes importing less confusing
export { countries as countryConfigs };

export function getSuppotedCountries(): SupportedCountryConfig[] {
    return countries.filter<SupportedCountryConfig>(
        (config): config is SupportedCountryConfig => config.isSupported
    );
}

export function getUnsupportedCountries(): UnsupportedCountryConfig[] {
    return countries.filter(
        (config): config is UnsupportedCountryConfig => !config.isSupported
    );
}

export function getCountries(supported: boolean): CountryConfig[] {
    if (supported) {
        return getSuppotedCountries();
    }

    return countries;
}

export function getCountryConfig(
    countryCode: Alpha2,
    supportedOnly: true
): SupportedCountryConfig | undefined;

export function getCountryConfig(
    countryCode: Alpha2,
    supportedOnly: false
): CountryConfig | undefined;

export function getCountryConfig(
    countryCode: Alpha2,
    supportedOnly: boolean
): CountryConfig | undefined {
    if (supportedOnly) {
        return getSuppotedCountries().find(
            config => config.alpha2 === countryCode
        );
    }

    return countries.find(config => config.alpha2 === countryCode);
}

export function isSupported(
    config: CountryConfig
): config is SupportedCountryConfig {
    return config.isSupported;
}

export function useCountryConfig(): SupportedCountryConfig | undefined {
    const { country } = useTranslations();
    const alpha2 = country as Alpha2;
    const config = useMemo(() => getCountryConfig(alpha2, true), [alpha2]);
    return config;
}

export function getDefaultLanguage(alpha2: Alpha2): string {
    const config = getCountryConfig(alpha2, true);

    return config?.languages.find(lang => lang.default)?.code ?? "en";
}

export function getValidatedLocale(
    countryCode: string | null | Alpha2,
    language: string | null
): Locale {
    // Default to US if no country or invalid country
    const countryConfig =
        getCountryConfig(countryCode as Alpha2, true) ||
        getCountryConfig(Alpha2.US, true);

    // Get default language for the country
    const defaultLanguage = getDefaultLanguage(countryCode as Alpha2);

    // Validate the provided language against country's available languages
    const isValidLanguage =
        language &&
        countryConfig?.languages?.some(lang => lang.code === language);

    return {
        countryCode: countryConfig?.alpha2 || Alpha2.US,
        language: isValidLanguage ? language! : defaultLanguage
    };
}
