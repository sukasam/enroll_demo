import { Alpha2 } from "./countryConfig/enums";

type Language = {
    label: string;
    value: string;
    defaultCountry: Alpha2;
};

const languages: Language[] = [
    {
        label: "Deutsch",
        value: "de",
        defaultCountry: Alpha2.DE
    },
    {
        label: "English",
        value: "en",
        defaultCountry: Alpha2.US
    },
    {
        label: "Spanish",
        value: "es",
        defaultCountry: Alpha2.US
    },
    {
        label: "French",
        value: "fr",
        defaultCountry: Alpha2.CA
    },
    // {
    //     label: "Italian",
    //     value: "it",
    //     defaultCountry: Alpha2.IT
    // },
    {
        label: "Japanese",
        value: "ja",
        defaultCountry: Alpha2.JP
    },
    {
        label: "Dutch",
        value: "nl",
        defaultCountry: Alpha2.NL
    },
    {
        label: "Turkish",
        value: "tr",
        defaultCountry: Alpha2.TR
    }
];

export default languages;
