'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { WeatherData, MasivKey, AltitudineType } from '@/types/weather';
import { MASIVE_DATA } from '@/lib/constants';
import { generateNarrativeSummary } from '@/lib/weather-utils';
import { NarrativeSummary } from '@/components/weather/NarrativeSummary';
import { WeatherFactors } from '@/components/weather/WeatherFactors';

export default function MeteoPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const masiv = params.masiv as MasivKey;
    const date = params.date as string;
    const altitudine = (searchParams.get('alt') || 'peste') as AltitudineType;

    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchWeatherData() {
            setLoading(true);
            setError(null);

            try {
                const [meteoRes, avalansaRes] = await Promise.all([
                    fetch(`/api/meteo?masiv=${masiv}&date=${date}&altitudine=${altitudine}`),
                    fetch(`/api/avalansa?masiv=${masiv}`)
                ]);

                if (!meteoRes.ok || !avalansaRes.ok) {
                    throw new Error('Failed to fetch weather data');
                }

                const meteoData = await meteoRes.json();
                const avalansaData = await avalansaRes.json();

                const combinedData: WeatherData = {
                    ...meteoData,
                    avalansa_nivel: avalansaData.nivel,
                    avalansa_text: avalansaData.text,
                    strat_zapada: undefined,
                    temp_zapada: undefined,
                    vizibilitate: undefined
                };

                setWeatherData(combinedData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        }

        fetchWeatherData();
    }, [masiv, date, altitudine]);

    const masivData = MASIVE_DATA[masiv];
    const narrative = weatherData ? generateNarrativeSummary(weatherData) : null;

    if (loading) {
        return (
            <div className="min-h-screen p-4 md:p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white/60"></div>
                        <p className="mt-4 opacity-60">Se încarcă datele meteo...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !weatherData) {
        return (
            <div className="min-h-screen p-4 md:p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="weather-card rounded-3xl p-6 text-center">
                        <p className="text-red-400 mb-4">❌ {error || 'Nu s-au putut încărca datele'}</p>
                        <Link
                            href="/"
                            className="inline-block bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-medium py-2 px-6 rounded-2xl transition-all border border-white/30"
                        >
                            Înapoi la pagina principală
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/" className="text-sm opacity-60 hover:opacity-100 transition-opacity mb-2 inline-block">
                        ← Înapoi
                    </Link>
                    <h1 className="text-3xl font-light mb-1">
                        🏔️ {masivData.name} - {new Date(date).toLocaleDateString('ro-RO', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </h1>
                    <p className="text-sm opacity-60">
                        Altitudine: {altitudine === 'peste' ? `Peste ${masivData.prag}m (gol alpin)` : `Sub ${masivData.prag}m (în pădure)`}
                    </p>
                </div>

                {/* Narrative Summary */}
                {narrative && (
                    <div className="mb-6">
                        <div className="weather-card rounded-2xl md:rounded-3xl p-5 md:p-6">
                            <NarrativeSummary
                                sections={narrative.sections}
                                dangerousSections={narrative.dangerousSections}
                                safeSections={narrative.safeSections}
                                overallVerdict={narrative.overallVerdict}
                                verdictColor={narrative.verdictColor}
                            />
                        </div>
                    </div>
                )}

                {/* Current Factors */}
                <div className="mb-6">
                    <h2 className="text-xl font-medium mb-1 flex items-center gap-2">
                        <span>⚠️</span>
                        <span>Factori actuali care pot influența drumeția</span>
                    </h2>
                    <p className="text-sm opacity-60 mb-4">Sursa: ANM + Buletin Nivologic</p>

                    <WeatherFactors data={weatherData} />
                </div>
            </div>
        </div>
    );
}
