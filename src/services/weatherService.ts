import { STATII_METEO, MOUNTAINS } from '../data/mountains';

/**
 * Weather service using Open-Meteo API and real Avalanche data from GitHub
 */
export interface WeatherData {
    temperature: number;      // Max Temperature (08-20)
    windSpeed: number;        // Max Wind Speed (08-20)
    windGusts: number;        // Max Wind Gusts (08-20)
    precipitation: number;    // Total precipitation (08-20)
    maxPrecipHour: number;    // Max hourly precipitation (08:00 - 20:00)
    snowfall: number;         // Total snowfall (08-20)
    snowDepth: number;        // Current snow depth (cm)
    windChill: number;        // Apparent temperature (lowest 08-20)
    weatherCode: number;
    precipProb: number;       // Max precipitation probability (08-20)
    uvIndex: number;          // Max UV factor
    visibility: number;       // Min visibility (08-20) (meters)
    visibilitySnapshots: {    // Specific snapshots for evolution
        h08: number;
        h12: number;
        h16: number;
    };
    humidity: number;         // Average relative humidity (08-20)
    condition: string;
    avalancheRisk?: {
        level: number;
        text: string;
        message?: string;
    };
}

const AVALANCHE_DATA_URL = 'https://raw.githubusercontent.com/SIG212/meteo-scraper/main/date_meteo.json';

// Mapping between our mountain IDs and the JSON keys
const AVALANCHE_MAPPING: Record<string, string> = {
    'bucegi': 'bucegi',
    'fagaras': 'fagaras',
    'rodnei': 'rodnei',
    'retezat': 'retezat',
    'piatra_craiului': 'piatra_craiului',
    'bistritei': 'bistritei',
    'ceahlau': 'ceahlau',
    'calimani': 'calimani',
    'hasmas': 'hasmas',
    'parang_sureanu': 'parang',
    'tarcu_godeanu': 'tarcu',
    'apuseni': 'apuseni',
    'iezer': 'iezer_papusa',
    'baiului': 'baiului',
    'ciucas_piatra_mare': 'ciucas'
};

export const weatherService = {
    getForecast: async (mountainId: string, date: string, altitude: number): Promise<WeatherData> => {
        const mountain = MOUNTAINS.find(m => m.id === mountainId);
        const coords = STATII_METEO[mountainId];

        if (!coords || !mountain) {
            throw new Error(`Coordinates not found for mountain: ${mountainId}`);
        }

        const isHigh = altitude > mountain.thresholdAltitude;
        const lat = isHigh ? coords.lat_high : coords.lat;
        const lon = isHigh ? coords.lon_high : coords.lon;

        // Fetch Weather and Avalanche data in parallel
        const [weatherRes, avalancheRes] = await Promise.all([
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&elevation=${altitude}&daily=uv_index_max&hourly=temperature_2m,apparent_temperature,rain,showers,snowfall,snow_depth,visibility,weather_code,wind_speed_80m,windgusts_10m,relative_humidity_2m,precipitation_probability,precipitation&timezone=Europe/Bucharest&windspeed_unit=kmh&precipitation_unit=mm&forecast_days=16`),
            fetch(AVALANCHE_DATA_URL).catch(() => null)
        ]);

        if (!weatherRes.ok) {
            throw new Error('Failed to fetch weather data from Open-Meteo');
        }

        const weatherData = await weatherRes.json();
        let avalancheRisk;

        if (avalancheRes && avalancheRes.ok) {
            const avalancheJson = await avalancheRes.json();
            const mappingKey = AVALANCHE_MAPPING[mountainId];
            const massifData = mappingKey ? avalancheJson.date[mappingKey] : null;

            if (massifData) {
                // Determine altitude category for avalanche
                const category = altitude >= 1800 ? 'peste_1800' : 'sub_1800';
                const riskData = massifData[category];
                if (riskData) {
                    avalancheRisk = {
                        level: riskData.nivel,
                        text: riskData.text,
                        message: massifData.mesaj
                    };
                }
            }
        }

        // 1. Daily Data Parsing
        const dailyTime = weatherData.daily?.time || [];
        const dayIndex = dailyTime.findIndex((t: string) => t === date);
        const idxDaily = dayIndex !== -1 ? dayIndex : 0;
        const uvIndex = weatherData.daily?.uv_index_max?.[idxDaily] || 0;

        // 2. Hourly Data Parsing
        const hourlyTimes = weatherData.hourly.time;
        const dayStartIndex = hourlyTimes.findIndex((t: string) => t.startsWith(date));

        if (dayStartIndex === -1) {
            throw new Error(`Data for date ${date} not available in Open-Meteo response`);
        }

        let maxPrecipHour = 0;
        let totalPrecip = 0;
        let totalSnowfall = 0;
        let maxWindSpeed = 0;
        let maxGusts = 0;
        let minApparentTemp = 999;
        let maxPrecipProb = 0;
        let maxTemp = -999;
        let minVisibility = 99999;
        let sumHumidity = 0;
        let countHumidity = 0;
        let maxSnowDepth = 0;
        let midDayWeatherCode = 0;

        let vis08 = 0, vis12 = 0, vis16 = 0;

        // Scan the window 08:00 - 20:00 (13 hours)
        for (let i = 8; i <= 20; i++) {
            const hIdx = dayStartIndex + i;
            if (!hourlyTimes[hIdx]) break;

            const hPrecip = weatherData.hourly.precipitation[hIdx] || 0;
            if (hPrecip > maxPrecipHour) maxPrecipHour = hPrecip;
            totalPrecip += hPrecip;

            totalSnowfall += weatherData.hourly.snowfall[hIdx] || 0;

            const hWind = weatherData.hourly.wind_speed_80m?.[hIdx] || weatherData.hourly.windspeed_10m?.[hIdx] || 0;
            if (hWind > maxWindSpeed) maxWindSpeed = hWind;

            const hGusts = weatherData.hourly.windgusts_10m?.[hIdx] || 0;
            if (hGusts > maxGusts) maxGusts = hGusts;

            const hApparent = weatherData.hourly.apparent_temperature[hIdx];
            if (hApparent < minApparentTemp) minApparentTemp = hApparent;

            const hTemp = weatherData.hourly.temperature_2m[hIdx];
            if (hTemp > maxTemp) maxTemp = hTemp;

            const hVisibility = weatherData.hourly.visibility[hIdx] || 24000;
            if (hVisibility < minVisibility) minVisibility = hVisibility;

            const hSnowDepth = weatherData.hourly.snow_depth[hIdx] || 0;
            if (hSnowDepth > maxSnowDepth) maxSnowDepth = hSnowDepth;

            sumHumidity += weatherData.hourly.relative_humidity_2m[hIdx] || 50;
            countHumidity++;

            const hProb = weatherData.hourly.precipitation_probability[hIdx] || 0;
            if (hProb > maxPrecipProb) maxPrecipProb = hProb;

            if (i === 12) midDayWeatherCode = weatherData.hourly.weather_code[hIdx];

            // Snapshots
            if (i === 8) vis08 = hVisibility;
            if (i === 12) vis12 = hVisibility;
            if (i === 16) vis16 = hVisibility;
        }

        return {
            temperature: Math.round(maxTemp),
            windSpeed: Math.round(maxWindSpeed),
            windGusts: Math.round(maxGusts),
            precipitation: Math.round(totalPrecip * 10) / 10,
            maxPrecipHour: Math.round(maxPrecipHour * 10) / 10,
            snowfall: Math.round(totalSnowfall * 10) / 10,
            snowDepth: Math.round(maxSnowDepth * 100),
            weatherCode: midDayWeatherCode,
            windChill: Math.round(minApparentTemp),
            precipProb: maxPrecipProb,
            uvIndex: uvIndex,
            visibility: Math.round(minVisibility),
            visibilitySnapshots: {
                h08: Math.round(vis08),
                h12: Math.round(vis12),
                h16: Math.round(vis16)
            },
            humidity: countHumidity > 0 ? Math.round(sumHumidity / countHumidity) : 0,
            condition: totalPrecip > 0 ? (totalSnowfall > totalPrecip / 2 ? 'Snowy' : 'Rainy') : 'Clear/Cloudy',
            avalancheRisk
        };
    }
};
