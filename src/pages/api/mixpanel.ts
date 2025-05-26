import mixpanel from "mixpanel";
import { NextApiRequest, NextApiResponse } from "next";
import uaParser from "ua-parser-js";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN;

// Initialize Mixpanel only if token is available
const mixpanelInstance = MIXPANEL_TOKEN
    ? mixpanel.init(MIXPANEL_TOKEN, {
          verbose: process.env.NODE_ENV === "development",
          debug: process.env.NODE_ENV === "development",
          logger: console,
          host: "api-eu.mixpanel.com",
          geolocate: process.env.NODE_ENV === "development"
      })
    : null;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
        return;
    }

    // Return early if Mixpanel is not initialized
    if (!mixpanelInstance) {
        res.status(200).json({
            message: "Mixpanel tracking disabled - no token available"
        });
        return;
    }

    try {
        const { action, event, properties } = req.body;

        const $browser = uaParser(req.headers["user-agent"]).browser.name;
        const $os = uaParser(req.headers["user-agent"]).os.name;
        // eslint-disable-next-line camelcase
        const $browser_version = uaParser(req.headers["user-agent"]).browser
            .version;
        const $device = uaParser(req.headers["user-agent"]).device.model;

        const enrichedProperties = {
            ...properties,
            $browser,
            $os,
            $browser_version,
            $device,
            ip: req.headers["cf-connecting-ip"]
        };

        if (action === "trackEvent" && event) {
            mixpanelInstance.track(event, enrichedProperties);
        } else if (action === "setPeopleProperties") {
            mixpanelInstance.people.set(
                properties.$user_id,
                enrichedProperties
            );
        }

        res.status(200).json({ message: "Event tracked successfully" });
    } catch (error) {
        console.error("Error tracking Mixpanel event:", error);
        res.status(500).json({ error: "Failed to track event" });
    }
}
