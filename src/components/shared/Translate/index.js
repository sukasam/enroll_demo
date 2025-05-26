import { useTranslations } from "Contexts/translation";
import { useCallback } from "react";
import serverStore from "Services/serverStore/serverStore";
import isClient from "Services/utils/isClient";

// เพิ่มฟังก์ชันสำหรับทำความสะอาด HTML
function sanitizeHTML(html) {
    // ใช้ DOMParser เพื่อแปลง HTML string เป็น DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body.innerHTML;
}

function replaceVariables(phrase, replacements) {
    let newPhrase = phrase;

    Object.entries(replacements).forEach(([key, value]) => {
        const regExp = new RegExp(`{{${key}}}`, "g");
        newPhrase = newPhrase.replace(regExp, value);
    });

    return newPhrase;
}

const Translate = ({
    children,
    dynamic = null,
    variables = {},
    allowHTML = false
}) => {
    const { translations } = useTranslations();

    // Determine which key to use for translation
    const key = dynamic || children;
    const translation = translations?.[key] || key;

    // Replace variables in the translation
    const processedText = replaceVariables(translation, variables);

    // ถ้า allowHTML เป็น true ให้ใช้ dangerouslySetInnerHTML
    if (allowHTML) {
        const sanitizedHTML = sanitizeHTML(processedText);
        return <span dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
    }

    // ถ้าไม่ใช่ return ตามปกติ
    return processedText;
};

const T = Translate;

export default T;

export function useTranslate(_translations = null) {
    const { translations, basicTranslations } = useTranslations();
    // Hack to get the translations to work on the server side. If we can get the local into this method with out prop drilling the full application we could fix this.
    const translationsToUse = !isClient()
        ? serverStore?.getTranslation("en-US")
        : _translations || translations;
    return useCallback(
        (value, variables = {}, allowHTML = false) => {
            const translatedText = replaceVariables(
                translationsToUse?.[value] ??
                    basicTranslations?.[value] ??
                    value,
                variables
            );
            if (allowHTML) {
                return sanitizeHTML(translatedText);
            }
            return translatedText;
        },
        [translations]
    );
}

export function updateAnchorTags(inputString) {
    // Regular expression to match <a> tags and capture existing attributes
    const anchorTagRegex = /<a\s+([^>]*href=['"][^'"]*['"][^>]*)>/gi;

    return inputString.replace(anchorTagRegex, (match, p1) => {
        // Check if rel attribute exists, if not add it
        if (!/rel=/.test(p1)) {
            p1 += " rel='noopener'";
        }
        // Check if target attribute exists, if not add it
        if (!/target=/.test(p1)) {
            p1 += " target='_blank'";
        }
        return `<a ${p1}>`;
    });
}

export function useBasicTranslate(_translations = null) {
    const { basicTranslations } = useTranslations();

    return (value, variables = {}) =>
        replaceVariables(
            (Object.keys(basicTranslations).length
                ? basicTranslations
                : _translations)?.[value] ?? value,
            variables
        );
}

export function useHasTranslation() {
    const { translations } = useTranslations();

    return value => !!translations?.[value];
}
