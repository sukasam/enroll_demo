import creditCardType from "credit-card-type";

function getCardIcon(cardNumber) {
    if (!cardNumber) {
        return "/cards/new.svg";
    }

    let cardImage = "/cards/default.svg";

    const cardInfo = creditCardType(cardNumber);
    const cardImages = ["visa", "mastercard", "american-express", "discover"];
    const cardType = cardInfo[0]?.type;

    if (cardImages.indexOf(cardType) > -1) {
        cardImage = `/cards/${cardType}.svg`;
    }

    return cardImage;
}

export default getCardIcon;
