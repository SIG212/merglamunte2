import { NextRequest, NextResponse } from 'next/server';
import { MASIVE_DATA } from '@/lib/constants';
import { MasivKey, AltitudineType } from '@/types/weather';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const masiv = searchParams.get('masiv') as MasivKey;
    const date = searchParams.get('date');
    const altitudine = searchParams.get('altitudine') as AltitudineType;

    if (!masiv || !date || !altitudine) {
        return NextResponse.json(
            { error: 'Missing required parameters: masiv, date, altitudine' },
            { status: 400 }
        );
    }

    const masivData = MASIVE_DATA[masiv];
    if (!masivData) {
        return NextResponse.json(
            { error: 'Invalid masiv' },
            { status: 400 }
        );
    }

    const coords = masivData.coords[altitudine];
    const apiKey = process.env.METEOBLUE_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: 'API key not configured' },
            { status: 500 }
        );
    }

    try {
        const apiUrl = `https://my.meteoblue.com/packages/basic-1h_basic-day_air-3h_snowice-3h?apikey=${apiKey}&lat=${coords.lat}&lon=${coords.lon}&asl=2000&format=json`;

        const response = await fetch(apiUrl, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`Meteoblue API error: ${response.status}`);
        }

        const data = await response.json();

        // Process data for the selected date
        const selectedDate = new Date(date);
        const dateStr = selectedDate.toISOString().split('T')[0];

        // Daily data
        const dateIndexDay = data.data_day.time.findIndex((t: string) => t.startsWith(dateStr));
        if (dateIndexDay === -1) {
            return NextResponse.json(
                { error: 'Date not found in forecast' },
                { status: 404 }
            );
        }

        // Hourly data - filter hours 8-20 for the selected date
        const hourlyData = data.data_1h.time.map((time: string, idx: number) => ({
            time: time,
            hour: new Date(time).getHours(),
            date: time.split('T')[0],
            precipitation: data.data_1h.precipitation[idx],
            temperature: data.data_1h.temperature[idx],
            pictocode: data.data_1h.pictocode[idx]
        })).filter((h: any) => h.date === dateStr && h.hour >= 8 && h.hour <= 20);

        // Calculate precipitation max and total for 8-20 interval
        const precipMaxHourly = Math.max(...hourlyData.map((h: any) => h.precipitation), 0);
        const precipTotalDaily = hourlyData.reduce((sum: number, h: any) => sum + h.precipitation, 0);

        // Get snow fraction (3h intervals, find closest to midday)
        const snowData = data.data_3h_snowice?.snowfraction || [];
        const snowTimes = data.data_3h_snowice?.time || [];
        const middayIdx = snowTimes.findIndex((t: string) => t.startsWith(dateStr) && t.includes('12:00'));
        const snowFraction = middayIdx >= 0 ? snowData[middayIdx] : 0;

        // Determine precipitation type
        let precipType = 'Fără';
        if (precipMaxHourly > 0.1) {
            if (snowFraction > 0.7) precipType = 'Zăpadă';
            else if (snowFraction > 0.3) precipType = 'Lapoviță';
            else precipType = 'Ploaie';
        }

        // Thunderstorm probability (3h intervals, get max for the day)
        const thunderData = data.data_3h?.convective_precipitation || [];
        const thunderTimes = data.data_3h?.time || [];
        const thunderProbs = thunderTimes.map((time: string, idx: number) => {
            if (time.startsWith(dateStr)) return thunderData[idx] || 0;
            return 0;
        }).filter((p: number) => p > 0);
        const thunderstormProb = thunderProbs.length > 0 ? Math.max(...thunderProbs) : 0;

        // UV Index
        const uvIndex = data.data_day.uvindex ? data.data_day.uvindex[dateIndexDay] : 0;

        const processedData = {
            // Daily aggregates
            temperatura: data.data_day.temperature_mean[dateIndexDay],
            temp_min: data.data_day.temperature_min[dateIndexDay],
            temp_max: data.data_day.temperature_max[dateIndexDay],
            vant_mean: data.data_day.windspeed_mean[dateIndexDay],
            vant_max: data.data_day.windspeed_max[dateIndexDay],
            cod_vreme: data.data_day.pictocode[dateIndexDay],

            // Precipitation details
            precip_max_hourly: precipMaxHourly,
            precip_total_8_20: precipTotalDaily,
            precip_type: precipType,

            // Additional factors
            thunderstorm_prob: thunderstormProb,
            uv_index: uvIndex
        };

        return NextResponse.json(processedData);
    } catch (error) {
        console.error('Error fetching Meteoblue data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch weather data' },
            { status: 500 }
        );
    }
}
