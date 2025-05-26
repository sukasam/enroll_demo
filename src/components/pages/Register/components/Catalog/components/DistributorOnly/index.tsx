/** @jsxImportSource @emotion/react */
import CurrencyFormatter from "Components/shared/CurrencyFormatter";
import { useTranslate } from "Components/shared/Translate";
import { useProducts } from "Contexts/ProductContext";
import { useUser } from "Contexts/UserContext";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import styles from "./styles";

function DistributorOnly(): JSX.Element {
    const { goToNextSection } = useUser();
    const translate = useTranslate();
    const { setShoppingCart, noPurchaseVariantData } = useProducts();
    return (
        <div css={styles}>
            <h3>{translate("catalog_distributor_only")}</h3>
            <div>
                <CurrencyFormatter>{0}</CurrencyFormatter> | PV: 0 |{" "}
                <span>{translate("catalog_payment_distributor_only")}</span>
            </div>
            <p>{translate("catalog_distributor_only_description")}</p>
            <button
                type="button"
                onClick={(): void => {
                    mixpanelService.trackEvent(
                        MixpanelEvent.REGISTER_STARTER_KIT_SELECTED,
                        {
                            basic_kit_selected: true,
                            basic_kit_available: true
                        }
                    );
                    setShoppingCart(noPurchaseVariantData);
                    goToNextSection();
                }}
                className="continue-button"
            >
                {translate("button_distributor_only")}
            </button>
        </div>
    );
}

export default DistributorOnly;
