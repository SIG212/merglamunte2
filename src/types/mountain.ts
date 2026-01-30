export interface Mountain {
    id: string;
    name: string;
    maxAltitude: number;
    thresholdAltitude: number;
    difficultySummerAbove: number;
    difficultyWinterAbove: number;
    difficultySummerBelow: number;
    avalanches: boolean;
    region?: string; // Optional now as it's not in the new data
    description?: string; // Optional now
}

export interface MountainCoords {
    lat: number;
    lon: number;
    lat_high: number;
    lon_high: number;
}
