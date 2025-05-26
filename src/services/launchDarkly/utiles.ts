import { BasicBanner, EmptyBasicBanner } from "./types";

export default function isActiveBanner(
    banner: EmptyBasicBanner | null | undefined
): banner is BasicBanner {
    return (
        banner !== null &&
        banner !== undefined &&
        Object.keys(banner).length > 0
    );
}
