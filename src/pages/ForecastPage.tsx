import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MOUNTAINS } from '../data/mountains';
import { useWeather } from '../hooks/useWeather';

export default function ForecastPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [showWeatherFactors, setShowWeatherFactors] = useState(false);
    const [showEquipment, setShowEquipment] = useState(false);
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const toggleItem = (item: string) => {
        setCheckedItems(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    const handleShare = async () => {
        const categories = [
            { id: 'rain', title: 'Pentru Ploaie', show: (weather?.maxPrecipHour || 0) > 0.1, items: ['Poncho/pelerina', 'Hardshell', 'Suprapantaloni', 'Bocanci impermeabili', 'Sapca/palarie', 'Șosete de schimb', 'Folie de supraviețuire', 'Frontala', 'Baterie externă'] },
            { id: 'winter', title: 'Pentru Zăpadă', show: (season === 'Iarnă' || (weather?.snowDepth || 0) > 0), items: ['Parazapezi', 'Pantaloni lungi', 'Bocanci impermeabili', 'Polar', 'Gherute', 'Șosete de iarna', 'Hardshell', 'Manusi (textile+imp.)', 'Caciula', 'Ochelari de soare'] },
            { id: 'winter_tech', title: 'Pentru zăpadă +1800m si traseu tehnic', show: ((season === 'Iarnă' || (weather?.snowDepth || 0) > 0) && altitude >= 1800), items: ['Colțari', 'Piolet', 'Cască de alpinism', 'Kit Avalanșă', 'Bocanci de iarna', 'Ochelari de schi', 'Ham si coarda'] },
            { id: 'normal', title: 'Drumeție Normală', show: true, items: ['Bocanci de munte', 'Polar', 'Softshell', 'Pantaloni lungi', 'Tricou/bluza', 'Sosete', 'Trusa prim ajutor', 'Ochelari de soare', 'Frontala', 'Baterie externă', 'Mancare', 'Pijamale', 'Trusa igiena', 'Haine schimb'] }
        ];

        let text = `🎒 Lista Echipament - ${mountain?.name || 'Munte'} (${altitude}m)\n📅 Data: ${date}\n\n`;

        categories.forEach(cat => {
            if (cat.show) {
                text += `\n📌 ${cat.title}:\n`;
                cat.items.forEach(item => {
                    const isChecked = checkedItems[item];
                    text += `${isChecked ? '✅' : '⬜'} ${item}\n`;
                });
            }
        });

        text += `\nGenerat cu Merglamunte.ro`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Lista Echipament Munte',
                    text: text,
                });
            } else {
                await navigator.clipboard.writeText(text);
                alert('Lista a fost copiată în clipboard!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const mountainId = searchParams.get('mountain');
    const date = searchParams.get('date');
    const altitudeParam = searchParams.get('altitude');
    const altitude = altitudeParam ? parseInt(altitudeParam) : 0;

    const mountain = MOUNTAINS.find(m => m.id === mountainId);

    const { data: weather, isLoading, isError } = useWeather(mountainId, date, altitude);

    // Season Detection
    const season = useMemo(() => {
        if (!date) return 'Vară';
        const month = new Date(date).getMonth() + 1;
        return (month >= 11 || month <= 4) ? 'Iarnă' : 'Vară';
    }, [date]);


    if (!mountain) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="mb-4 text-slate-400">Muntele nu a fost găsit.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-emerald-500 rounded-full text-slate-950 font-bold hover:bg-emerald-400 transition-colors"
                    >
                        Înapoi la început
                    </button>
                </div>
            </div>
        );
    }

    const primaryFactors = [
        {
            id: 'windchill',
            label: "Windchill (08-20)",
            icon: "device_thermostat",
            value: `${weather?.windChill}°C`,
            remark: getWindchillRemark(weather?.windChill || 0),
            level: getWindchillLevel(weather?.windChill || 0)
        },
        {
            id: 'wind',
            label: "Vânt (08-20)",
            icon: "air",
            value: `${weather?.windSpeed} km/h`,
            remark: getWindRemark(weather?.windSpeed || 0),
            level: getWindLevel(weather?.windSpeed || 0)
        },
        {
            id: 'precip',
            label: "Precipitații (max/h 08-20)",
            icon: "water_drop",
            value: `${weather?.maxPrecipHour} mm/h`,
            remark: getPrecipitationRemark(weather?.maxPrecipHour || 0),
            level: getPrecipitationLevel(weather?.maxPrecipHour || 0)
        },
        {
            id: 'total-precip',
            label: "Precipitații Totale (08-20)",
            icon: "rainy",
            value: `${weather?.precipitation} mm`,
            remark: getTotalPrecipRemark(weather?.precipitation || 0),
            level: getTotalPrecipLevel(weather?.precipitation || 0)
        },
        {
            id: 'visibility',
            label: "Vizibilitate (08-20)",
            icon: "visibility",
            value: weather?.visibility ? (weather.visibility < 1000 ? `${weather.visibility} m` : `${Math.round(weather.visibility / 1000)} km`) : 'N/A',
            remark: getVisibilitySnapshotRemark(weather?.visibilitySnapshots),
            level: getVisibilityLevel(weather?.visibility || 24000)
        },
        {
            id: 'uv',
            label: "Index UV",
            icon: "sunny",
            value: `${weather?.uvIndex}`,
            remark: getUVRemark(weather?.uvIndex || 0),
            level: getUVLevel(weather?.uvIndex || 0)
        },
        {
            id: 'humidity',
            label: "Umiditate (08-20)",
            icon: "humidity_mid",
            value: `${weather?.humidity}%`,
            remark: getHumidityRemark(weather?.humidity || 50),
            level: getHumidityLevel(weather?.humidity || 50)
        },
        {
            id: 'snow-depth',
            label: "Zăpadă (Prognoză)",
            icon: "ac_unit",
            value: `${weather?.snowDepth} cm`,
            remark: getSnowDepthRemark(weather?.snowDepth || 0),
            level: getSnowDepthLevel(weather?.snowDepth || 0)
        },
        {
            id: 'anm-snow-depth',
            label: "Strat Zăpadă ANM",
            icon: "ac_unit",
            value: weather?.anmSnowDepth !== undefined ? `${weather.anmSnowDepth} cm` : 'N/A',
            remark: weather?.anmSnowDepth !== undefined
                ? `Măsurat la ${weather.anmStationName} (${weather.anmUpdatedAt || 'N/A'})`
                : 'Măsurătoare indisponibilă pentru această dată.',
            level: getSnowDepthLevel(weather?.anmSnowDepth || 0)
        },


        {
            id: 'precip-prob',
            label: "Probabilitate Precip.",
            icon: "umbrella",
            value: `${weather?.precipProb}%`,
            remark: getPrecipProbRemark(weather?.precipProb || 0),
            level: getPrecipProbLevel(weather?.precipProb || 0)
        },
        {
            id: 'gusts',
            label: "Rafale Vânt (08-20)",
            icon: "cyclone",
            value: `${weather?.windGusts} km/h`,
            remark: getGustsRemark(weather?.windGusts || 0),
            level: getGustsLevel(weather?.windGusts || 0)
        },
        {
            id: 'weather-code',
            label: "Condiție",
            icon: "cloud",
            value: getWeatherDescription(weather?.weatherCode || 0),
            remark: getWeatherRemark(weather?.weatherCode || 0),
            level: getWeatherLevel(weather?.weatherCode || 0)
        }
    ];

    // Dedicated Avalanche Risk calculation
    const avalancheInfo = useMemo(() => {
        // Fallback for difficult mountains when data is missing
        if (!weather?.avalancheRisk || weather.avalancheRisk.level === 0) {
            const isDifficultMountain = mountainId === 'piatra_craiului' || (mountain?.difficultyWinterAbove || 0) >= 4;

            if (isDifficultMountain) {
                return {
                    level: 5, // Visual hack for RED level
                    uiLevel: 'red',
                    value: 'Risc Avalanșă Necunoscut',
                    remark: 'Apelați Salvamont pentru informații. Teren alpin periculos.',
                    text: 'Necunoscut',
                    isUnknownHighRisk: true // Flag for specific UI handling
                };
            }
            return null;
        }

        const risk = weather.avalancheRisk;
        const level: 'red' | 'yellow' | 'green' =
            risk.level >= 4 ? 'red' :
                risk.level >= 2 ? 'yellow' :
                    'green';

        return {
            ...risk,
            uiLevel: level,
            value: `Nivel ${risk.level} (${risk.text})`,
            remark: getAvalancheRemark(level, risk.text)
        };
    }, [weather?.avalancheRisk, mountainId, mountain]);

    const urgentFactors = primaryFactors.filter(f => f.level === 'red' || f.level === 'yellow');

    // 🛡️ OVERALL STATUS LOGIC
    let overallStatus: 'red' | 'yellow' | 'green' = 'green';
    let statusText = "Condiții Bune";

    const hasRedFactor = urgentFactors.some(f => f.level === 'red');
    const hasYellowFactor = urgentFactors.some(f => f.level === 'yellow');
    const avalancheLevel = avalancheInfo ? avalancheInfo.level : 0;
    const isUnknownHighRisk = avalancheInfo?.isUnknownHighRisk;

    if (isUnknownHighRisk) {
        overallStatus = 'red';
        statusText = "Condiții Periculoase";
    } else if (avalancheLevel >= 4 || hasRedFactor) {
        overallStatus = 'red';
        statusText = "Condiții Periculoase";
    } else if (avalancheLevel === 3 || hasYellowFactor) {
        overallStatus = 'yellow';
        statusText = "Condiții Dificile";
    }

    // 📝 CONCISE SUMMARY STRING
    const conditionNames: Record<string, string> = {
        'windchill': 'Frig',
        'wind': 'Vânt',
        'visibility': 'Ceață',
        'precip': 'Precipitații',
        'snow-depth': 'Zăpadă',
        'ice': 'Gheață',
        'uv': 'Soare Puternic',
        'humidity': 'Umiditate',
        'precip-prob': 'Precipitații',
        'gusts': 'Rafale',
        'weather-code': 'Vreme Rea'
    };

    const conditionString = urgentFactors.length > 0
        ? urgentFactors.map(f => {
            if (f.id === 'weather-code') return f.value; // Use actual description (e.g. "Ceață", "Furtună")
            return conditionNames[f.id] || f.label;
        }).filter((v, i, a) => a.indexOf(v) === i).join(' + ')
        : (isUnknownHighRisk ? "Verificați riscul de avalanșă!" : "Fără fenomene periculoase");

    // ❄️ AVALANCHE COLOR LOGIC
    const getAvalancheColorClass = (level: number, isUnknown?: boolean) => {
        if (isUnknown) return 'text-red-500 animate-pulse';
        if (level >= 4) return 'text-red-500';
        if (level === 3) return 'text-amber-500';
        return 'text-alpine-emerald';
    };

    const prognozaIds = ['windchill', 'wind', 'precip', 'total-precip', 'visibility', 'uv', 'humidity', 'precip-prob', 'gusts', 'snow-depth'];
    const prognozaFactors = primaryFactors.filter(f => prognozaIds.includes(f.id));
    const todayFactors = primaryFactors.filter(f => f.id === 'anm-snow-depth');


    return (

        <div className="min-h-screen relative font-sans text-alpine-slate bg-white overflow-x-hidden">

            <mlm-header></mlm-header>

            <div className="max-w-md md:max-w-xl mx-auto mb-6 px-4">
                <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex items-start space-x-3 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
                    <span className="material-symbols-outlined text-amber-500 text-base mt-0.5 shrink-0">info</span>
                    <p className="text-xs text-amber-800 leading-relaxed font-medium">
                        Această funcționalitate este încă în testare și poate avea erori. Te rugăm să o folosești ca pe un instrument orientativ, dar <strong>verifică condițiile și mai amănunțit</strong> înainte să pleci la drum.
                    </p>
                </div>
            </div>

            <main className="relative z-10 max-w-md mx-auto p-4 pb-12">
                <header className="text-center mt-2 mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 hover:text-alpine-emerald transition-colors"
                    >
                        Înapoi
                    </button>
                    <h1 className="text-4xl font-black leading-tight text-alpine-slate mb-2 uppercase">{mountain.name}</h1>
                    <div className="flex items-center justify-center space-x-2 text-zinc-500 text-sm font-medium">
                        <span>{date}</span>
                        <span className="opacity-50">|</span>
                        <span>{altitude} m</span>
                    </div>

                    {weather && (
                        <div className="flex items-center justify-center gap-4 mt-4 text-xs font-bold text-alpine-slate bg-zinc-50 px-5 py-2 rounded-2xl border border-zinc-200">
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-alpine-orange text-sm">wb_sunny</span>
                                <span>{weather.sunrise}</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-zinc-300"></div>
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-sky-600 text-sm">bedtime</span>
                                <span>{weather.sunset}</span>
                            </div>
                        </div>
                    )}
                </header>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-2 border-zinc-200 border-t-alpine-emerald rounded-full animate-spin mb-4"></div>
                        <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest italic tracking-[0.2em]">Analizăm munții...</p>
                    </div>
                ) : isError ? (
                    <div className="bg-red-50 border border-red-200 rounded-bento p-8 text-center text-red-950">
                        <p className="font-bold mb-4 font-black">Eroare la preluarea datelor.</p>
                        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-red-100 hover:bg-red-200 rounded-2xl text-xs font-bold uppercase tracking-widest transition-colors font-sans border border-red-200">Reîncearcă</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* ⚠️ SUMMARY / DIFFICULT CONDITIONS */}
                        <section>
                            <div className="bg-white border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-bento p-8 relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl">
                                <span className="material-symbols-outlined absolute -bottom-6 -right-6 text-8xl opacity-[0.03] -rotate-12 pointer-events-none">
                                    {overallStatus === 'green' ? 'check_circle' : 'warning'}
                                </span>
                                <div className="flex items-center space-x-3 mb-6 relative z-10">
                                    <span className={`material-symbols-outlined text-3xl ${overallStatus === 'red' ? 'text-red-500' :
                                        overallStatus === 'yellow' ? 'text-amber-500' : 'text-alpine-emerald'
                                        }`}>
                                        {overallStatus === 'green' ? 'check_circle' : 'warning'}
                                    </span>
                                    <h2 className={`uppercase text-2xl font-black tracking-tight ${overallStatus === 'red' ? 'text-red-500' :
                                        overallStatus === 'yellow' ? 'text-amber-500' : 'text-alpine-emerald'
                                        }`}>
                                        {statusText}
                                    </h2>
                                </div>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center space-x-3 text-zinc-600">
                                        <span className="material-symbols-outlined text-lg text-zinc-300">calendar_month</span>
                                        <span className="text-sm font-medium">Sezon: <span className="font-bold text-alpine-slate">{season}</span></span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-zinc-600">
                                        <span className="material-symbols-outlined text-lg text-zinc-300">landscape</span>
                                        <span className="text-sm font-medium">Altitudine: <span className="font-bold text-alpine-slate">{altitude} m</span></span>
                                    </div>
                                    {urgentFactors.length > 0 && (
                                        <div className="flex items-center space-x-3 text-zinc-600">
                                            <span className="material-symbols-outlined text-lg text-red-300">list_alt</span>
                                            <span className="text-sm font-medium text-red-500">{conditionString}</span>
                                        </div>
                                    )}
                                    {avalancheInfo && (avalancheInfo.level > 0 || avalancheInfo.isUnknownHighRisk) && (
                                        <div className={`flex items-center space-x-3 pt-4 border-t border-zinc-100 ${getAvalancheColorClass(avalancheInfo.level, avalancheInfo.isUnknownHighRisk)}`}>
                                            <span className="material-symbols-outlined text-lg">dangerous</span>
                                            <span className="text-sm font-bold tracking-tight">Risc Avalanșă: {avalancheInfo.value}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* 🌡️ WEATHER FACTORS */}
                        <section>
                            <div className="bg-white border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-bento overflow-hidden mb-6">
                                <button
                                    onClick={() => setShowWeatherFactors(!showWeatherFactors)}
                                    className="w-full flex items-center justify-between p-6 text-alpine-slate text-left group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="material-symbols-outlined text-zinc-400 group-hover:text-alpine-emerald transition-colors">thermostat</span>
                                        <span className="font-black uppercase text-xs tracking-[0.2em] text-alpine-slate">Factori Meteo</span>
                                    </div>
                                    <span className="material-symbols-outlined text-zinc-400">
                                        {showWeatherFactors ? 'expand_less' : 'expand_more'}
                                    </span>
                                </button>

                                {showWeatherFactors && (
                                    <div className="px-5 pb-6 animate-in slide-in-from-top-2 fade-in duration-300 space-y-6">
                                        {/* SECTION 1: PROGNOZA */}
                                        <div>
                                            <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-3 px-1">Prognoza</h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                {prognozaFactors.map(f => (
                                                    <div key={f.id} className={`bg-zinc-50/50 p-5 rounded-3xl flex flex-col justify-between h-40 border border-zinc-100 shadow-sm transition-all hover:bg-white hover:-translate-y-1 hover:shadow-md relative overflow-hidden group ${f.level === 'red' ? 'ring-1 ring-red-200 bg-red-50/50' : f.level === 'yellow' ? 'ring-1 ring-amber-200 bg-amber-50/50' : ''}`}>
                                                        <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-6xl opacity-[0.03] -rotate-12 pointer-events-none group-hover:opacity-[0.06] transition-opacity">{f.icon}</span>
                                                        <div className="flex items-center space-x-2 relative z-10">
                                                            <span className={`material-symbols-outlined text-sm ${f.level === 'red' ? 'text-red-500' : f.level === 'yellow' ? 'text-amber-500' : 'text-alpine-emerald'}`}>{f.icon}</span>
                                                            <span className={`text-[9px] font-black uppercase tracking-widest ${f.level === 'red' ? 'text-red-600' : f.level === 'yellow' ? 'text-amber-600' : 'text-alpine-emerald'}`}>{f.label.split(' (')[0]}</span>
                                                        </div>
                                                        <div className={`text-2xl font-black tracking-tight mt-1 relative z-10 ${f.level === 'red' ? 'text-red-600' : f.level === 'yellow' ? 'text-amber-600' : 'text-alpine-slate'}`}>{f.value}</div>
                                                        <div className="text-[10px] text-zinc-500 leading-snug font-medium mt-auto relative z-10">{f.remark}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* SECTION 2: FACTORI DE ASTAZI */}
                                        <div>
                                            <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-3 px-1">Factori din prezent care pot impacta drumetia ta viitoare</h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                {avalancheInfo && (
                                                    <div className={`bg-zinc-50/50 p-5 rounded-3xl flex flex-col justify-between h-40 border border-zinc-100 shadow-sm transition-all hover:bg-white hover:-translate-y-1 hover:shadow-md relative overflow-hidden group ${avalancheInfo.uiLevel === 'red' ? 'ring-1 ring-red-200 bg-red-50/50' : avalancheInfo.uiLevel === 'yellow' ? 'ring-1 ring-amber-200 bg-amber-50/50' : ''}`}>
                                                        <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-6xl opacity-[0.03] -rotate-12 pointer-events-none group-hover:opacity-[0.06] transition-opacity">report</span>
                                                        <div className="flex items-center space-x-2 relative z-10">
                                                            <span className={`material-symbols-outlined text-sm ${avalancheInfo.uiLevel === 'red' ? 'text-red-500' : 'text-amber-500'}`}>report</span>
                                                            <span className={`text-[9px] font-black uppercase tracking-widest ${avalancheInfo.uiLevel === 'red' ? 'text-red-600' : 'text-amber-600'}`}>Avalansa</span>
                                                        </div>
                                                        <div className={`text-3xl font-black tracking-tighter mt-1 relative z-10 ${avalancheInfo.uiLevel === 'red' ? 'text-red-600' : 'text-amber-600'}`}>{avalancheInfo.level}/5</div>
                                                        <div className="text-[10px] text-zinc-500 leading-snug font-medium mt-auto relative z-10">
                                                            <div>{avalancheInfo.text}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                {todayFactors.map(f => (
                                                    <div key={f.id} className={`bg-zinc-50/50 p-5 rounded-3xl flex flex-col justify-between h-40 border border-zinc-100 shadow-sm transition-all hover:bg-white hover:-translate-y-1 hover:shadow-md relative overflow-hidden group ${f.level === 'red' ? 'ring-1 ring-red-200 bg-red-50/50' : f.level === 'yellow' ? 'ring-1 ring-amber-200 bg-amber-50/50' : ''}`}>
                                                        <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-6xl opacity-[0.03] -rotate-12 pointer-events-none group-hover:opacity-[0.06] transition-opacity">{f.icon}</span>
                                                        <div className="flex items-center space-x-2 relative z-10">
                                                            <span className={`material-symbols-outlined text-sm ${f.level === 'red' ? 'text-red-500' : f.level === 'yellow' ? 'text-amber-500' : 'text-alpine-emerald'}`}>{f.icon}</span>
                                                            <span className={`text-[9px] font-black uppercase tracking-widest ${f.level === 'red' ? 'text-red-600' : f.level === 'yellow' ? 'text-amber-600' : 'text-alpine-emerald'}`}>{f.label.split(' (')[0]}</span>
                                                        </div>
                                                        <div className={`text-2xl font-black tracking-tight mt-1 relative z-10 ${f.level === 'red' ? 'text-red-600' : f.level === 'yellow' ? 'text-amber-600' : 'text-alpine-slate'}`}>{f.value}</div>
                                                        <div className="text-[10px] text-zinc-500 leading-snug font-medium mt-auto relative z-10">{f.remark}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* 🎒 EQUIPMENT */}
                        <section>
                            <div className="bg-white border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-bento overflow-hidden mb-6">
                                <button
                                    onClick={() => setShowEquipment(!showEquipment)}
                                    className="w-full flex items-center justify-between p-6 text-alpine-slate text-left group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="material-symbols-outlined text-zinc-400 group-hover:text-alpine-emerald transition-colors">backpack</span>
                                        <span className="font-black uppercase text-xs tracking-[0.2em]">Listă Echipament</span>
                                    </div>
                                    <span className="material-symbols-outlined text-zinc-400">
                                        {showEquipment ? 'expand_less' : 'expand_more'}
                                    </span>
                                </button>

                                {showEquipment && (
                                    <div className="p-6 pt-0 text-alpine-slate space-y-6 animate-in slide-in-from-top-2 fade-in duration-300">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                            <p className="text-sm text-zinc-500 leading-relaxed max-w-md">
                                                Într-o drumeție e nevoie să îți iei echipamentul de <strong className="text-alpine-slate font-bold">Drumeție Normală</strong>, la care se pot adăuga cele tehnice, în funcție de vreme: pentru zăpadă, ploaie, frig.
                                            </p>
                                            <button
                                                onClick={handleShare}
                                                className="shrink-0 flex items-center space-x-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors text-alpine-slate w-fit"
                                            >
                                                <span className="material-symbols-outlined text-sm">ios_share</span>
                                                <span>Share Listă</span>
                                            </button>
                                        </div>

                                        {/* RAIN GEAR */}
                                        {(weather?.maxPrecipHour || 0) > 0.1 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-sky-600">
                                                    <span className="material-symbols-outlined text-lg">rainy</span>
                                                    <h3 className="text-xs font-black uppercase tracking-widest">Pentru Ploaie</h3>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['Poncho/pelerina', 'Hardshell', 'Suprapantaloni', 'Bocanci impermeabili', 'Sapca/palarie', 'Șosete de schimb', 'Folie de supraviețuire', 'Frontala', 'Baterie externă'].map(item => (
                                                        <label key={item} className="flex items-start gap-2 text-sm text-zinc-600 cursor-pointer group">
                                                            <div className="relative flex items-center pt-0.5">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={!!checkedItems[item]}
                                                                    onChange={() => toggleItem(item)}
                                                                    className="peer appearance-none w-4 h-4 border border-zinc-300 rounded bg-zinc-50 checked:bg-sky-500 checked:border-sky-500 transition-colors"
                                                                />
                                                                <span className="material-symbols-outlined text-[10px] text-white absolute left-0.5 opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                                                            </div>
                                                            <span className="group-hover:text-alpine-slate transition-colors select-none">{item}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* WINTER GEAR */}
                                        {(season === 'Iarnă' || (weather?.snowDepth || 0) > 0) && (
                                            <div className="space-y-3 pt-4 border-t border-zinc-100">
                                                <div className="flex items-center gap-2 text-sky-500">
                                                    <span className="material-symbols-outlined text-lg">ac_unit</span>
                                                    <h3 className="text-xs font-black uppercase tracking-widest">Pentru Zăpadă</h3>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['Parazapezi', 'Pantaloni lungi', 'Bocanci impermeabili', 'Polar', 'Gherute', 'Șosete de iarna', 'Hardshell', 'Manusi (textile+imp.)', 'Caciula', 'Ochelari de soare'].map(item => (
                                                        <label key={item} className="flex items-start gap-2 text-sm text-zinc-600 cursor-pointer group">
                                                            <div className="relative flex items-center pt-0.5">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={!!checkedItems[item]}
                                                                    onChange={() => toggleItem(item)}
                                                                    className="peer appearance-none w-4 h-4 border border-zinc-300 rounded bg-zinc-50 checked:bg-sky-400 checked:border-sky-400 transition-colors"
                                                                />
                                                                <span className="material-symbols-outlined text-[10px] text-white absolute left-0.5 opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                                                            </div>
                                                            <span className="group-hover:text-alpine-slate transition-colors select-none">{item}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* WINTER TECHNICAL GEAR (+1800m) */}
                                        {((season === 'Iarnă' || (weather?.snowDepth || 0) > 0) && altitude >= 1800) && (
                                            <div className="space-y-3 pt-4 border-t border-zinc-100">
                                                <div className="flex items-center gap-2 text-indigo-500">
                                                    <span className="material-symbols-outlined text-lg">severe_cold</span>
                                                    <h3 className="text-xs font-black uppercase tracking-widest">Pentru zăpadă +1800m si traseu tehnic</h3>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['Colțari', 'Piolet', 'Cască de alpinism', 'Kit Avalanșă', 'Bocanci de iarna', 'Ochelari de schi', 'Ham si coarda'].map(item => (
                                                        <label key={item} className="flex items-start gap-2 text-sm text-zinc-600 cursor-pointer group">
                                                            <div className="relative flex items-center pt-0.5">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={!!checkedItems[item]}
                                                                    onChange={() => toggleItem(item)}
                                                                    className="peer appearance-none w-4 h-4 border border-zinc-300 rounded bg-zinc-50 checked:bg-indigo-500 checked:border-indigo-500 transition-colors"
                                                                />
                                                                <span className="material-symbols-outlined text-[10px] text-white absolute left-0.5 opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                                                            </div>
                                                            <span className="group-hover:text-alpine-slate transition-colors select-none">{item}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* NORMAL GEAR (ALWAYS SHOWN) */}
                                        <div className="space-y-3 pt-4 border-t border-zinc-100">
                                            <div className="flex items-center gap-2 text-alpine-emerald">
                                                <span className="material-symbols-outlined text-lg">hiking</span>
                                                <h3 className="text-xs font-black uppercase tracking-widest">Drumeție Normală</h3>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['Bocanci de munte', 'Polar', 'Softshell', 'Pantaloni lungi', 'Tricou/bluza', 'Sosete', 'Trusa prim ajutor', 'Ochelari de soare', 'Frontala', 'Baterie externă', 'Mancare', 'Pijamale', 'Trusa igiena', 'Haine schimb'].map(item => (
                                                    <label key={item} className="flex items-start gap-2 text-sm text-zinc-600 cursor-pointer group">
                                                        <div className="relative flex items-center pt-0.5">
                                                            <input
                                                                type="checkbox"
                                                                checked={!!checkedItems[item]}
                                                                onChange={() => toggleItem(item)}
                                                                className="peer appearance-none w-4 h-4 border border-zinc-300 rounded bg-zinc-50 checked:bg-alpine-emerald checked:border-alpine-emerald transition-colors"
                                                            />
                                                            <span className="material-symbols-outlined text-[10px] text-white absolute left-0.5 opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                                                        </div>
                                                        <span className="group-hover:text-alpine-slate transition-colors select-none">{item}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* 🔗 LINKS (PLACEHOLDER) */}
                        <section>
                            <button className="w-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-bento flex items-center justify-between p-6 text-alpine-slate group text-left transition-colors">
                                <div className="flex items-center space-x-3">
                                    <span className="material-symbols-outlined text-zinc-400 group-hover:text-alpine-emerald transition-colors">link</span>
                                    <span className="font-black uppercase text-xs tracking-[0.2em]">Linkuri Utile</span>
                                </div>
                                <span className="material-symbols-outlined text-zinc-400">expand_more</span>
                            </button>
                        </section>

                        {/* 🐛 BUG REPORT */}
                        <section className="mt-6 mb-6">
                            <button 
                                onClick={() => {
                                    if ((window as any).Tally) {
                                        (window as any).Tally.openPopup('WOpRxe', { layout: 'modal' });
                                    }
                                }}
                                className="w-full bg-white hover:bg-rose-50 border border-rose-100 rounded-bento flex items-center justify-between p-6 text-rose-900 group text-left transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="material-symbols-outlined text-rose-400 group-hover:text-rose-500 transition-colors">bug_report</span>
                                    <span className="font-black uppercase text-xs tracking-[0.2em] mt-0.5">Ai găsit un bug? Spune-ne</span>
                                </div>
                                <span className="material-symbols-outlined text-rose-300 group-hover:text-rose-400">arrow_forward_ios</span>
                            </button>
                        </section>
                    </div>
                )}
            </main>
            <mlm-footer></mlm-footer>
        </div>
    );
}

// 🌡️ THRESHOLDS LOGIC


function getWindchillLevel(temp: number): 'red' | 'yellow' | 'green' {
    if (temp <= -25) return 'red';
    if (temp <= -15) return 'yellow';
    return 'green';
}

function getWindchillRemark(temp: number) {
    if (temp <= -25) return "Risc critic de degerături în minute. Evitați expunerea.";
    if (temp <= -15) return "Necesită echipament tehnic de iarnă și protecție facială.";
    return "Condiții termice resimțite acceptabile.";
}

function getWindLevel(speed: number): 'red' | 'yellow' | 'green' {
    if (speed > 50) return 'red';
    if (speed >= 30) return 'yellow';
    return 'green';
}

function getWindRemark(speed: number) {
    if (speed > 50) return "Face drumeția extrem de periculoasă pe creste.";
    if (speed >= 30) return "Vânt puternic, necesită echilibru și windstopper.";
    return "Vânt slab, nu afectează mobilitatea.";
}

function getPrecipitationLevel(mm: number): 'red' | 'yellow' | 'green' {
    if (mm > 5) return 'red';
    if (mm >= 2) return 'yellow';
    return 'green';
}

function getPrecipitationRemark(mm: number) {
    if (mm > 5) return "Vizibilitate nulă, risc major de rătăcire.";
    if (mm >= 2) return "Ploaie/Ninsoare moderată, necesită haine impermeabile.";
    return "Fără precipitații semnificative.";
}

function getVisibilityLevel(meters: number): 'red' | 'yellow' | 'green' {
    if (meters < 1000) return 'red';
    if (meters < 5000) return 'yellow';
    return 'green';
}

function getVisibilitySnapshotRemark(snapshots: any) {
    if (!snapshots) return "Vizibilitate bună.";

    const format = (v: number) => v < 1000 ? `${v}m` : `${Math.round(v / 1000)}km`;

    return `Evoluție: ${format(snapshots.h08)} la 08:00, ${format(snapshots.h12)} la 12:00, ${format(snapshots.h16)} la 16:00.`;
}

function getTotalPrecipLevel(mm: number): 'red' | 'yellow' | 'green' {
    if (mm > 15) return 'red';
    if (mm > 5) return 'yellow';
    return 'green';
}

function getTotalPrecipRemark(mm: number) {
    if (mm > 15) return "Cantități mari de apă. Risc de viituri/noroi.";
    if (mm > 5) return "Precipitații moderate acumulate.";
    return "Precipitații nesemnificative.";
}

function getUVLevel(index: number): 'red' | 'yellow' | 'green' {
    if (index >= 8) return 'red';
    if (index >= 4) return 'yellow';
    return 'green';
}

function getUVRemark(index: number) {
    if (index >= 8) return "Risc extrem de arsuri. Protecție solară maximă obligatorie.";
    if (index >= 4) return "Indice UV moderat, se recomandă cremă de protecție.";
    return "Indice UV scăzut.";
}


function getAvalancheRemark(level: string, realText?: string) {
    if (realText === 'Necunoscut') return "Informația nu este disponibilă pentru acest masiv/altitudine.";
    if (level === 'red') return `Pericol ${realText || 'major'} pe toate pantele. Doar pentru experți.`;
    if (level === 'yellow') return `Nivel ${realText || 'moderat'}. Atenție la pantele cu acumulări.`;
    return "Zăpadă stabilă, risc minim.";
}

function getWeatherDescription(code: number): string {
    const codes: Record<number, string> = {
        0: 'Senin', 1: 'Majoritar Senin', 2: 'Parțial Noros', 3: 'Noros',
        45: 'Ceață', 48: 'Ceață depusă',
        51: 'Burniță Ușoară', 61: 'Ploaie Ușoară', 71: 'Ninsoare Ușoară',
        95: 'Furtună'
    };
    return codes[code] || 'Variabil';
}

function getHumidityLevel(h: number): 'red' | 'yellow' | 'green' {
    if (h > 90) return 'yellow';
    return 'green';
}

function getHumidityRemark(h: number) {
    if (h > 90) return "Umiditate extremă, risc ridicat de condens și ceață.";
    return "Umiditate în parametri normali.";
}

function getSnowDepthLevel(cm: number): 'red' | 'yellow' | 'green' {
    if (cm > 100) return 'yellow';
    return 'green';
}

function getSnowDepthRemark(cm: number) {
    if (cm > 100) return "Strat de zăpadă consistent, necesită rachete sau schiuri.";
    if (cm > 20) return "Strat subțire, dar prezent. Atenție la zonele cu gheață.";
    return "Strat de zăpadă minim.";
}

function getPrecipProbLevel(p: number): 'red' | 'yellow' | 'green' {
    if (p > 70) return 'red';
    if (p > 40) return 'yellow';
    return 'green';
}

function getPrecipProbRemark(p: number) {
    if (p > 70) return "Precipitații aproape sigure. Pregătiți echipamentul impermeabil.";
    if (p > 40) return "Șanse moderate de precipitații. Fiți vigilenți.";
    return "Risc scăzut de precipitații.";
}

function getGustsLevel(speed: number): 'red' | 'yellow' | 'green' {
    if (speed > 70) return 'red';
    if (speed > 50) return 'yellow';
    return 'green';
}

function getGustsRemark(speed: number) {
    if (speed > 70) return "Rafale periculoase. Risc de dezechilibrare major.";
    if (speed > 50) return "Rafale puternice. Atenție în zonele expuse.";
    return "Rafale moderate, fără pericol deosebit.";
}

function getWeatherLevel(code: number): 'red' | 'yellow' | 'green' {
    if ([95, 48].includes(code)) return 'red';
    if ([45, 71, 61, 3].includes(code)) return 'yellow';
    return 'green';
}

function getWeatherRemark(code: number) {
    if (code === 95) return "Furtună iminentă. NU plecați la drum.";
    if (code === 48 || code === 45) return "Ceață densă, vizibilitate redusă la câțiva metri.";
    if ([71, 61].includes(code)) return "Precipitații active. Vizibilitate și confort reduse.";
    return "Condiții meteo generale bune.";
}
