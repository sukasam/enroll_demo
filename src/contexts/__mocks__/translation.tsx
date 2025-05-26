import { Alpha2 } from "Constants/countryConfig/enums.js";

export const useTranslations = jest.fn().mockReturnValue({
    country: "US" as Alpha2,
    language: "en",
    setCountry: jest.fn(),
    setLanguage: jest.fn(),
    fetchTranslations: jest.fn(),
    translations: {}
});

export default useTranslations;
