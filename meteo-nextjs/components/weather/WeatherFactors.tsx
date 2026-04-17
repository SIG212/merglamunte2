import React from 'react';
import { WeatherData } from '@/types/weather';
import { WeatherCard, SimpleCard } from '@/components/ui/WeatherCard';
import { getAvalansaStatus, getVizibilitateStatus } from '@/lib/weather-utils';

interface WeatherFactorsProps {
    data: WeatherData;
}

export function WeatherFactors({ data }: WeatherFactorsProps) {
    const avalansaStatus = getAvalansaStatus(data.avalansa_nivel);

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
            {/* Avalanșă */}
            <WeatherCard
                title="Risc avalanșă"
                value={data.avalansa_text}
                status={avalansaStatus}
                icon="⚠️"
            />

            {/* Strat zăpadă */}
            {data.strat_zapada !== undefined && (
                <SimpleCard
                    title="Strat zăpadă"
                    value={`${data.strat_zapada} cm`}
                    icon="❄️"
                    additionalInfo={data.temp_zapada ? `Temperatură: ${data.temp_zapada}°C` : 'Date ANM'}
                />
            )}

            {/* Vizibilitate */}
            {data.vizibilitate !== undefined && (
                <WeatherCard
                    title="Vizibilitate"
                    value={data.vizibilitate >= 1000 ? (data.vizibilitate / 1000).toFixed(1) : data.vizibilitate}
                    unit={data.vizibilitate >= 1000 ? 'km' : 'm'}
                    status={getVizibilitateStatus(data.vizibilitate)}
                    icon="👁️"
                />
            )}
        </div>
    );
}
