export default function worldPayRedirect(redirectURL: string): void {
    if (window.self === window.top) return;
    const message = `{"domain":"enrollment.unicity","redirectURL":"${redirectURL}"}`;
    console.vlog("--- WP WorldPayRedirect:", "gray", message);
    window.parent.postMessage(message, "*");
}
