export default function formatHref(href: string): string {
    return href.replace(/^.*customers\//, "");
}
