export default function convertDateToCustomFormat(
    dateString: string,
    dateFormat = "MDY"
): string {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "Invalid Date";
    }

    const hours = date.getHours();

    const elements: { [key: string]: number } = {
        Y: date.getFullYear(),
        M: date.getMonth() + 1,
        D: date.getDate()
    };

    const formattedDate = `${elements[dateFormat[0]]}/${
        elements[dateFormat[1]]
    }/${elements[dateFormat[2]]}`;
    const formattedTime = hours % 12 || 12;
    const amPm = hours < 12 ? "A.M" : "P.M";

    return `${formattedDate} ${formattedTime} ${amPm}`;
}
