import { Alpha2 } from "Constants/countryConfig/enums";

export type BasicBanner = {
    markets: Alpha2[];
    rosettaTag: string;
};

export type EmptyBasicBanner = BasicBanner | Record<string, never>;

export type ActiveMaintenanceBanner = BasicBanner & {
    messageDuration: number;
    messageStartTime: string;
};

export type MaintenanceBanner = ActiveMaintenanceBanner | Record<string, never>;

export type TechnicalDifficultyBanner = BasicBanner | Record<string, never>;
