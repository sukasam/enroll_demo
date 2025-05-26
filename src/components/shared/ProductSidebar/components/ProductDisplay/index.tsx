/** @jsxImportSource @emotion/react */

import CurrencyFormatter from "Components/shared/CurrencyFormatter";
import Spinner from "Components/shared/Spinner";
import T, { useTranslate } from "Components/shared/Translate";
import { useProducts } from "Contexts/ProductContext";
import Image from "next/image";
import { useMemo } from "react";
import styles from "./styles";

export default function ProductDisplay(): JSX.Element {
    const { shoppingCart } = useProducts();
    const translate = useTranslate();

    const displayableShoppingCart = useMemo(() => {
        // Filter to get only digital items
        const digitalItems = shoppingCart.filter(item => item.isDigital);

        // If all items are digital or there's only one item and it's digital, return them
        if (
            digitalItems.length === shoppingCart.length ||
            (shoppingCart.length === 1 && digitalItems.length === 1)
        ) {
            return digitalItems;
        }

        // Otherwise, filter out digital items
        return shoppingCart.filter(
            item =>
                item?.productImage &&
                item?.name &&
                item?.description &&
                item?.price &&
                item?.rrp &&
                !item.isDigital // Exclude digital items if there are other types of items
        );
    }, [shoppingCart]);

    if (displayableShoppingCart?.length === 0)
        return <Spinner dark height="32px" />;

    return (
        <div css={styles}>
            {displayableShoppingCart?.length > 0 ? (
                displayableShoppingCart.map(item => (
                    <div key={item.sku}>
                        <div className="top-row">
                            <Image
                                alt=""
                                data-testid="product_img"
                                src={item.productImage}
                                width={64}
                                height={64}
                            />
                            <div className="info">
                                <div
                                    className="title"
                                    data-testid="product_title"
                                >
                                    <T>{item.name}</T>
                                </div>

                                {!!Object.entries(item.options).length && (
                                    <div className="options">
                                        {Object.entries(item.options).map(
                                            option => (
                                                <div
                                                    className="option"
                                                    data-testid={`option_${option[0]}`}
                                                    key={option[0]}
                                                >
                                                    <span className="option-name">
                                                        <T>{option[0]}</T>
                                                    </span>
                                                    <span className="option-value">
                                                        <T>{option[1].title}</T>
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="product-prices">
                                <div
                                    className="price"
                                    data-testid="product_price"
                                >
                                    <CurrencyFormatter>
                                        {item.price}
                                    </CurrencyFormatter>
                                </div>
                                {item.price !== item.rrp && (
                                    <div className="rrp">
                                        <CurrencyFormatter>
                                            {item.rrp}
                                        </CurrencyFormatter>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div
                            className="description"
                            data-testid="product_description"
                            dangerouslySetInnerHTML={{
                                __html: translate(item.description)
                            }}
                        />
                        {/* <button
                        // hidden={section.id === openAccordionId}
                        type="button"
                        className="change-button"
                        onClick={(event): void => {
                            event.stopPropagation();
                            // setOpenAccordionId(section.id);
                            onAccordionChange(1);
                        }}
                    >
                        Change
                    </button> */}
                    </div>
                ))
            ) : (
                <Spinner dark height="32px" />
            )}
        </div>
    );
}
