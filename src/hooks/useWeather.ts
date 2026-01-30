import { useQuery } from '@tanstack/react-query';
import { weatherService } from '../services/weatherService';

export function useWeather(mountainId: string | null, date: string | null, altitude: number | null) {
    return useQuery({
        queryKey: ['weather', mountainId, date, altitude],
        queryFn: () => {
            if (!mountainId || !date || altitude === null) return null;
            return weatherService.getForecast(mountainId, date, altitude);
        },
        enabled: !!mountainId && !!date && altitude !== null,
        staleTime: 1000 * 60 * 30, // 30 minutes
    });
}
