import { datadogRum } from "@datadog/browser-rum";
import { getGA4SessionId } from "Pages/_app.hooks";
import pkgJson from "Root/package.json";
import mixpanelService from "Services/mixpanel/initializeMixPanel";

let isInitialized = false;

export default function initializeDatadog(): void {
    if (isInitialized) {
        return;
    }

    if (
        process.env.NEXT_PUBLIC_DATADOG_ENV === "production" ||
        process.env.NEXT_PUBLIC_DATADOG_ENV === "development"
    ) {
        datadogRum.init({
            applicationId: process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID || "",
            clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN || "",
            site: "us5.datadoghq.com",
            service: "enrollment2.0",
            env: process.env.NEXT_PUBLIC_DATADOG_ENV,
            version: pkgJson.version,
            sessionSampleRate: 100,
            premiumSampleRate: 100,
            trackResources: true,
            trackLongTasks: true,
            trackUserInteractions: true,
            defaultPrivacyLevel: "mask-user-input",
            trackFrustrations: true,
            beforeSend: event => {
                const gaSessionId = getGA4SessionId();
                /* eslint-disable-next-line no-param-reassign */
                event.context = {
                    ...event.context,
                    gaSessionId
                };
            }
        });

        datadogRum.startSessionReplayRecording();

        datadogRum.onReady(() => {
            const internalContext = datadogRum.getInternalContext();
            if (internalContext && internalContext.session_id) {
                mixpanelService.registerSuperProperties({
                    datadog_session_id: internalContext.session_id
                });
            }
        });

        isInitialized = true;
    }
}
