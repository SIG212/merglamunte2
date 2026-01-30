import type { Mountain, MountainCoords } from '../types/mountain';

export const MOUNTAINS: Mountain[] = [
    { "id": "bucegi", "name": "Bucegi", "maxAltitude": 2505, "thresholdAltitude": 1800, "difficultySummerAbove": 3, "difficultyWinterAbove": 5, "difficultySummerBelow": 2, "avalanches": true },
    { "id": "fagaras", "name": "Făgăraș", "maxAltitude": 2544, "thresholdAltitude": 1600, "difficultySummerAbove": 4, "difficultyWinterAbove": 5, "difficultySummerBelow": 2, "avalanches": true },
    { "id": "rodnei", "name": "Rodnei", "maxAltitude": 2303, "thresholdAltitude": 1800, "difficultySummerAbove": 3, "difficultyWinterAbove": 5, "difficultySummerBelow": 2, "avalanches": true },
    { "id": "retezat", "name": "Retezat", "maxAltitude": 2509, "thresholdAltitude": 1600, "difficultySummerAbove": 4, "difficultyWinterAbove": 5, "difficultySummerBelow": 2, "avalanches": true },
    { "id": "piatra_craiului", "name": "Piatra Craiului", "maxAltitude": 2238, "thresholdAltitude": 1400, "difficultySummerAbove": 5, "difficultyWinterAbove": 5, "difficultySummerBelow": 3, "avalanches": true },
    { "id": "bistritei", "name": "Bistriței", "maxAltitude": 1859, "thresholdAltitude": 1700, "difficultySummerAbove": 2, "difficultyWinterAbove": 4, "difficultySummerBelow": 2, "avalanches": false },
    { "id": "ceahlau", "name": "Ceahlău", "maxAltitude": 1907, "thresholdAltitude": 1800, "difficultySummerAbove": 2, "difficultyWinterAbove": 3, "difficultySummerBelow": 2, "avalanches": false },
    { "id": "calimani", "name": "Călimani", "maxAltitude": 2100, "thresholdAltitude": 1800, "difficultySummerAbove": 3, "difficultyWinterAbove": 5, "difficultySummerBelow": 2, "avalanches": true },
    { "id": "hasmas", "name": "Hășmaș", "maxAltitude": 1792, "thresholdAltitude": 1700, "difficultySummerAbove": 2, "difficultyWinterAbove": 2, "difficultySummerBelow": 2, "avalanches": false },
    { "id": "maramuresului", "name": "Maramureșului", "maxAltitude": 1957, "thresholdAltitude": 1800, "difficultySummerAbove": 3, "difficultyWinterAbove": 4, "difficultySummerBelow": 2, "avalanches": true },
    { "id": "parang_sureanu", "name": "Parâng, Șureanu", "maxAltitude": 2519, "thresholdAltitude": 2000, "difficultySummerAbove": 3, "difficultyWinterAbove": 5, "difficultySummerBelow": 2, "avalanches": true },
    { "id": "ciucas_piatra_mare", "name": "Ciucaș, Piatra Mare", "maxAltitude": 1954, "thresholdAltitude": 1600, "difficultySummerAbove": 2, "difficultyWinterAbove": 3, "difficultySummerBelow": 2, "avalanches": false },
    { "id": "tarcu_godeanu", "name": "Țarcu, Godeanu", "maxAltitude": 2190, "thresholdAltitude": 1800, "difficultySummerAbove": 3, "difficultyWinterAbove": 4, "difficultySummerBelow": 2, "avalanches": true },
    { "id": "buila", "name": "Buila-Vânturărița", "maxAltitude": 1885, "thresholdAltitude": 1400, "difficultySummerAbove": 2, "difficultyWinterAbove": 5, "difficultySummerBelow": 2, "avalanches": true },
    { "id": "cozia", "name": "Cozia", "maxAltitude": 1668, "thresholdAltitude": 1668, "difficultySummerAbove": 2, "difficultyWinterAbove": 2, "difficultySummerBelow": 2, "avalanches": false },
    { "id": "iezer", "name": "Iezer-Păpușa", "maxAltitude": 2391, "thresholdAltitude": 1700, "difficultySummerAbove": 3, "difficultyWinterAbove": 4, "difficultySummerBelow": 2, "avalanches": true },
    { "id": "baiului", "name": "Baiului", "maxAltitude": 1799, "thresholdAltitude": 1700, "difficultySummerAbove": 2, "difficultyWinterAbove": 3, "difficultySummerBelow": 2, "avalanches": false },
    { "id": "cindrel", "name": "Cindrel", "maxAltitude": 2244, "thresholdAltitude": 1800, "difficultySummerAbove": 2, "difficultyWinterAbove": 3, "difficultySummerBelow": 2, "avalanches": false },
    { "id": "mehedinti_cernei", "name": "Mehedinți, Cernei", "maxAltitude": 1466, "thresholdAltitude": 1800, "difficultySummerAbove": 2, "difficultyWinterAbove": 2, "difficultySummerBelow": 2, "avalanches": false },
    { "id": "apuseni", "name": "Apuseni", "maxAltitude": 1849, "thresholdAltitude": 1500, "difficultySummerAbove": 2, "difficultyWinterAbove": 3, "difficultySummerBelow": 1, "avalanches": false }
];

export const STATII_METEO: Record<string, MountainCoords> = {
    "bucegi": { "lat": 45.467, "lon": 25.500, "lat_high": 45.400, "lon_high": 25.457 },
    "fagaras": { "lat": 45.653, "lon": 24.787, "lat_high": 45.596, "lon_high": 24.635 },
    "rodnei": { "lat": 47.613, "lon": 24.856, "lat_high": 47.590, "lon_high": 24.630 },
    "retezat": { "lat": 45.372, "lon": 23.064, "lat_high": 45.350, "lon_high": 22.880 },
    "piatra_craiului": { "lat": 45.506, "lon": 25.265, "lat_high": 45.520, "lon_high": 25.215 },
    "bistritei": { "lat": 47.111, "lon": 25.247, "lat_high": 47.111, "lon_high": 25.247 },
    "ceahlau": { "lat": 46.988, "lon": 25.958, "lat_high": 46.978, "lon_high": 25.945 },
    "calimani": { "lat": 47.111, "lon": 25.247, "lat_high": 47.096, "lon_high": 25.233 },
    "hasmas": { "lat": 46.685, "lon": 25.826, "lat_high": 46.685, "lon_high": 25.826 },
    "maramuresului": { "lat": 47.930, "lon": 24.550, "lat_high": 47.930, "lon_high": 24.550 },
    "parang_sureanu": { "lat": 45.387, "lon": 23.482, "lat_high": 45.345, "lon_high": 23.530 },
    "ciucas_piatra_mare": { "lat": 45.522, "lon": 25.926, "lat_high": 45.522, "lon_high": 25.926 },
    "tarcu_godeanu": { "lat": 45.290, "lon": 22.530, "lat_high": 45.290, "lon_high": 22.530 },
    "buila": { "lat": 45.238, "lon": 24.132, "lat_high": 45.238, "lon_high": 24.132 },
    "cozia": { "lat": 45.302, "lon": 24.341, "lat_high": 45.302, "lon_high": 24.341 },
    "iezer": { "lat": 45.464, "lon": 25.088, "lat_high": 45.440, "lon_high": 25.010 },
    "baiului": { "lat": 45.412, "lon": 25.667, "lat_high": 45.412, "lon_high": 25.667 },
    "cindrel": { "lat": 45.623, "lon": 23.892, "lat_high": 45.623, "lon_high": 23.892 },
    "mehedinti_cernei": { "lat": 45.163, "lon": 22.699, "lat_high": 45.163, "lon_high": 22.699 },
    "apuseni": { "lat": 46.544, "lon": 22.854, "lat_high": 46.682, "lon_high": 22.711 }
};
