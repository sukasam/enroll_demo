export function upperCaseFormatter(value: string): string {
    return value.toUpperCase();
}

export function expirationDateFormatter(value: string): string {
    let formatted = value;

    if (value.length >= 3 && value[2] !== "/" && value.indexOf("/") === -1) {
        formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
    }

    return formatted;
}

export function cardNumberFormatter(value: string): string {
    let formatted = value;

    formatted = formatted.replace(/ /g, "");
    formatted = formatted.replace(/(.{4})/g, "$1 ");
    formatted = formatted.trim();

    return formatted;
}

export function ibanFormatter(value: string): string {
    let formatted = value;

    formatted = formatted.toUpperCase();

    formatted = formatted.replace(/ /g, "");
    formatted = formatted.replace(/(.{4})/g, "$1 ");
    formatted = formatted.trim();

    return formatted;
}
