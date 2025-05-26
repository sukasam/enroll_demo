/** @jsxImportSource @emotion/react */
import { getCountries } from "Constants/countryConfig";
import { useTranslations } from "Contexts/translation";
import Flag from "react-world-flags";
import styles from "./styles";

function CountryDisplay(): JSX.Element {
    const { country } = useTranslations();

    const countryConfig = getCountries(true)
        .filter(country => country.isSupported || country.redirect)
        .map(country => ({ label: country.name, value: country.alpha2 }))
        .sort((a, b) => a.label.localeCompare(b.label));

    return (
        <div css={styles.container} data-testid="country_display_container">
            <Flag height={24} width={24} code={country} css={styles.flag} />
            <span css={styles.text}>
                {countryConfig.find(c => c.value === country)?.label}
            </span>
        </div>
    );
}

export default CountryDisplay;
