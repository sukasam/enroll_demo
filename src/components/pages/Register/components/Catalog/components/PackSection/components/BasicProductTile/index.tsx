/** @jsxImportSource @emotion/react */

import { Grid, useTheme } from "@mui/material";
import CurrencyFormatter from "Components/shared/CurrencyFormatter";
import T from "Components/shared/Translate";
import styles from "./styles";

interface BasicProductTileProps {
    backgroundColor: string;
    title: string;
    price: number;
    description: string;
    buttonText: string;
    buttonClick: () => void;
    showPaymentType: boolean;
}

export default function BasicProductTile({
    backgroundColor,
    title,
    price,
    description,
    buttonText,
    buttonClick,
    showPaymentType
}: BasicProductTileProps): JSX.Element {
    const theme = useTheme();

    return (
        <Grid
            container
            css={styles.container(theme)}
            rowSpacing={2}
            style={{
                backgroundColor
            }}
        >
            <Grid css={styles.basicInfo(theme)} item md={8} xs={12}>
                <div
                    css={styles.title(theme)}
                    data-testid="product_title_basic_label"
                >
                    {title}
                </div>
                <div
                    css={styles.value(theme)}
                    data-testid="product_price_basic_label"
                >
                    <div css={styles.priceAndLabel(theme)}>
                        <div css={styles.price(theme)}>
                            <CurrencyFormatter>{price}</CurrencyFormatter>
                        </div>
                        <div css={styles.label(theme)}>| PV: 0 |</div>
                    </div>

                    {showPaymentType && (
                        <div
                            css={styles.labelPaymentType(theme)}
                            data-testid="payment_type_basic_label"
                        >
                            <T>catalog_basic_distributor_one_time_payment</T>
                        </div>
                    )}
                </div>

                <div
                    css={styles.description(theme)}
                    data-testid="product_description_basic_label"
                    dangerouslySetInnerHTML={{
                        __html: description
                    }}
                />
            </Grid>
            <Grid css={styles.basicButtonContainer(theme)} item md={4} xs={12}>
                <div
                    css={styles.basicBtn(theme)}
                    onClick={buttonClick}
                    onKeyUp={(e): void => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            buttonClick();
                        }
                    }}
                    tabIndex={0}
                    role="button"
                    id="catalog_get_basic"
                    data-testid="get_basic_button"
                >
                    <T>{buttonText}</T>
                </div>
            </Grid>
        </Grid>
    );
}
