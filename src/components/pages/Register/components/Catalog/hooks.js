import { useCountryConfig } from "Constants/countryConfig";
import { useProducts } from "Contexts/ProductContext";
import { useTranslations } from "Contexts/translation";
import getProducts from "Hydra/getProducts";
import { useEffect } from "react";

export default function useLoadProducts() {
    const { setProducts } = useProducts();
    const { country, language } = useTranslations();
    const countryConfig = useCountryConfig();

    async function load() {
        if (countryConfig?.isNoPurchaseMarket) return;

        const catalog = await getProducts({
            alpha2: country,
            customerType: "Member",
            language
        });
        setProducts(catalog.catalogSlides);
    }

    useEffect(() => {
        load();
    }, [language, country]);
}
