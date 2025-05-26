export const useCountryConfig = jest.fn().mockReturnValue({
    marketExceptions: {
        showOnboardingGuide: true,
        hideUnicityPhone: false,
        thankYouImage: "/img/custom-image.jpg"
    }
});

export const getSuppotedCountries = jest.fn();
export const getUnsupportedCountries = jest.fn();
export const getCountries = jest.fn();
export const getCountryConfig = jest.fn();
export const isSupported = jest.fn();
export const getDefaultLanguage = jest.fn();
export const countryConfigs = [];
