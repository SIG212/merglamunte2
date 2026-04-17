import { WeatherStatus, WeatherData, NarrativeSection } from '@/types/weather';
import { CUSTOM_MESSAGES } from './constants';

export function getWindchillStatus(windchill: number): WeatherStatus {
    if (windchill < -35) return { color: 'red', level: 'danger', message: CUSTOM_MESSAGES.windchill.red };
    if (windchill < -25) return { color: 'red', level: 'danger', message: CUSTOM_MESSAGES.windchill.red };
    if (windchill < -15) return { color: 'yellow', level: 'warning', message: CUSTOM_MESSAGES.windchill.yellow };
    return { color: 'green', level: 'safe', message: CUSTOM_MESSAGES.windchill.green };
}

export function getVantStatus(vant: number): WeatherStatus {
    if (vant > 80) return { color: 'red', level: 'danger', message: CUSTOM_MESSAGES.vant.red };
    if (vant > 50) return { color: 'red', level: 'danger', message: CUSTOM_MESSAGES.vant.red };
    if (vant > 30) return { color: 'yellow', level: 'warning', message: CUSTOM_MESSAGES.vant.yellow };
    return { color: 'green', level: 'safe', message: CUSTOM_MESSAGES.vant.green };
}

export function getPrecipMaxStatus(precipMax: number): WeatherStatus {
    if (precipMax > 5) return { color: 'red', level: 'danger', message: CUSTOM_MESSAGES.precipitatii_max.red };
    if (precipMax > 2) return { color: 'yellow', level: 'warning', message: CUSTOM_MESSAGES.precipitatii_max.yellow };
    return { color: 'green', level: 'safe', message: CUSTOM_MESSAGES.precipitatii_max.green };
}

export function getPrecipTotalStatus(precipTotal: number): WeatherStatus {
    if (precipTotal > 20) return { color: 'red', level: 'danger', message: CUSTOM_MESSAGES.precipitatii_total.red };
    if (precipTotal > 10) return { color: 'yellow', level: 'warning', message: CUSTOM_MESSAGES.precipitatii_total.yellow };
    return { color: 'green', level: 'safe', message: CUSTOM_MESSAGES.precipitatii_total.green };
}

export function getThunderstormStatus(prob: number): WeatherStatus {
    if (prob > 60) return { color: 'red', level: 'danger', message: CUSTOM_MESSAGES.thunderstorm.red };
    if (prob > 30) return { color: 'yellow', level: 'warning', message: CUSTOM_MESSAGES.thunderstorm.yellow };
    return { color: 'green', level: 'safe', message: CUSTOM_MESSAGES.thunderstorm.green };
}

export function getUVStatus(uv: number): WeatherStatus {
    if (uv > 7) return { color: 'red', level: 'danger', message: CUSTOM_MESSAGES.uv.red };
    if (uv > 5) return { color: 'yellow', level: 'warning', message: CUSTOM_MESSAGES.uv.yellow };
    return { color: 'green', level: 'safe', message: CUSTOM_MESSAGES.uv.green };
}

export function getVizibilitateStatus(viz: number): WeatherStatus {
    if (viz < 1000) return { color: 'red', level: 'danger', message: CUSTOM_MESSAGES.vizibilitate.red };
    if (viz < 3000) return { color: 'yellow', level: 'warning', message: CUSTOM_MESSAGES.vizibilitate.yellow };
    return { color: 'green', level: 'safe', message: CUSTOM_MESSAGES.vizibilitate.green };
}

export function getAvalansaStatus(nivel: number): WeatherStatus {
    if (nivel >= 4) return { color: 'red', level: 'danger', message: CUSTOM_MESSAGES.avalansa.red };
    if (nivel === 3) return { color: 'red', level: 'danger', message: CUSTOM_MESSAGES.avalansa.red };
    if (nivel === 2) return { color: 'yellow', level: 'warning', message: CUSTOM_MESSAGES.avalansa.yellow };
    return { color: 'green', level: 'safe', message: CUSTOM_MESSAGES.avalansa.green };
}

function getSeverity(value: number, type: string): 'danger' | 'warning' | 'safe' {
    if (type === 'precip') {
        if (value >= 5) return 'danger';
        if (value >= 2) return 'warning';
        return 'safe';
    }
    if (type === 'temp') {
        if (value < -10) return 'danger';
        if (value < 0) return 'warning';
        return 'safe';
    }
    if (type === 'wind') {
        if (value >= 60) return 'danger';
        if (value >= 40) return 'warning';
        return 'safe';
    }
    if (type === 'thunder') {
        if (value >= 60) return 'danger';
        if (value >= 30) return 'warning';
        return 'safe';
    }
    if (type === 'viz') {
        if (value < 1000) return 'danger';
        if (value < 3000) return 'warning';
        return 'safe';
    }
    if (type === 'snow') {
        if (value >= 60) return 'danger';
        if (value >= 30) return 'warning';
        return 'safe';
    }
    return 'safe';
}

export function generateNarrativeSummary(data: WeatherData): {
    sections: NarrativeSection[];
    dangerousSections: NarrativeSection[];
    safeSections: NarrativeSection[];
    overallVerdict: string;
    verdictColor: string;
} {
    const sections: NarrativeSection[] = [];

    // 1. PRECIPITAȚII
    let precipValue = '';
    let precipImpact = '';
    let precipSeverity = getSeverity(data.precip_max_hourly, 'precip');

    if (data.precip_max_hourly < 0.5) {
        precipValue = 'Absente';
        precipImpact = 'Traseu uscat';
        precipSeverity = 'safe';
    } else {
        let tipText = data.precip_type === 'Zăpadă' ? 'Ninsoare' :
            data.precip_type === 'Lapoviță' ? 'Lapoviță' : 'Ploi';

        let intensitate = '';
        if (data.precip_max_hourly < 1) intensitate = 'slabe';
        else if (data.precip_max_hourly < 3) intensitate = 'moderate';
        else if (data.precip_max_hourly < 5) intensitate = 'abundente';
        else intensitate = 'foarte abundente';

        let ora = data.precip_max_hourly > 1 ? 'după ora 12' : 'după ora 15';

        precipValue = `${tipText} ${intensitate} (${data.precip_max_hourly.toFixed(1)}mm/h) ${ora}`;

        if (data.precip_type === 'Zăpadă') {
            if (data.precip_max_hourly < 2) precipImpact = 'Fac poteca ușor alunecoasă';
            else if (data.precip_max_hourly < 4) precipImpact = 'Reduc vizibilitatea și fac poteca dificilă';
            else precipImpact = 'Condiții dificile, necesită echipament complet de iarnă';
        } else {
            if (data.precip_max_hourly < 2) precipImpact = 'Fac poteca ușor alunecoasă';
            else if (data.precip_max_hourly < 4) precipImpact = 'Necesită echipament impermeabil complet';
            else precipImpact = 'Reduc semnificativ vizibilitatea și confortul';
        }
    }

    sections.push({ label: 'PRECIPITAȚII', value: precipValue, impact: precipImpact, severity: precipSeverity });

    // 2. TEMPERATURĂ
    let tempDescriptor = '';
    let tempImpact = '';
    let tempSeverity = getSeverity(data.temperatura, 'temp');

    if (data.temperatura < -10) {
        tempDescriptor = 'Foarte scăzută';
        tempImpact = 'Risc de degerături, necesită echipament de iarnă complet';
    } else if (data.temperatura < 0) {
        tempDescriptor = 'Scăzută';
        tempImpact = 'Necesită haine călduroase și straturi multiple';
    } else if (data.temperatura < 10) {
        tempDescriptor = 'Răcoroasă';
        tempImpact = 'Necesită haine călduroase';
    } else if (data.temperatura < 20) {
        tempDescriptor = 'Plăcută';
        tempImpact = 'Îmbrăcăminte standard de drumeție';
    } else {
        tempDescriptor = 'Calduroasă';
        tempImpact = 'Necesită protecție solară și hidratare frecventă';
    }

    sections.push({
        label: 'TEMPERATURA',
        value: `${tempDescriptor} (${Math.round(data.temperatura)}°C)`,
        impact: tempImpact,
        severity: tempSeverity
    });

    // 3. VÂNT
    let vantIntensity = '';
    let rafale = Math.round(data.vant_max * 1.3);
    let rafaleText = '';
    let vantImpact = '';
    let vantSeverity = getSeverity(data.vant_max, 'wind');

    if (data.vant_max < 20) {
        vantIntensity = 'Slab';
        rafaleText = 'ușoare';
        vantImpact = 'Nu afectează semnificativ drumeția';
    } else if (data.vant_max < 40) {
        vantIntensity = 'Moderat';
        rafaleText = rafale < 50 ? 'moderate' : 'puternice';
        vantImpact = 'Cresc senzația de frig';
    } else if (data.vant_max < 60) {
        vantIntensity = 'Puternic';
        rafaleText = 'puternice';
        vantImpact = 'Cresc semnificativ senzația de frig și îngreunează mersul pe creastă';
    } else {
        vantIntensity = 'Foarte puternic';
        rafaleText = 'foarte puternice';
        vantImpact = 'Fac drumeția periculoasă în zone expuse, risc de pierdere echilibru';
    }

    sections.push({
        label: 'VÂNT',
        value: `${vantIntensity} (${Math.round(data.vant_max)} km/h), rafale ${rafaleText} (${rafale} km/h)`,
        impact: vantImpact,
        severity: vantSeverity
    });

    // 4. FURTUNI
    const thunderProb = data.thunderstorm_prob || 0;
    let furtunaNivel = '';
    let furtunaImpact = '';
    let furtunaSeverity = getSeverity(thunderProb, 'thunder');

    if (thunderProb < 30) {
        furtunaNivel = 'Risc scăzut';
        furtunaImpact = 'Nu afectează traseul în mod semnificativ';
    } else if (thunderProb < 60) {
        furtunaNivel = 'Risc moderat';
        furtunaImpact = 'Evitați crestele și zonele expuse în timpul precipitațiilor';
    } else {
        furtunaNivel = 'Risc ridicat';
        furtunaImpact = 'Pericol serios, evitați zonele expuse';
    }

    sections.push({
        label: 'FURTUNI',
        value: `${furtunaNivel} (${Math.round(thunderProb)}%)`,
        impact: furtunaImpact,
        severity: furtunaSeverity
    });

    // 5. VIZIBILITATE / NORI
    let vizNivel = '';
    let vizImpact = '';
    let vizSeverity: 'danger' | 'warning' | 'safe' = 'safe';

    if (data.vizibilitate !== undefined) {
        vizSeverity = getSeverity(data.vizibilitate, 'viz');
        if (data.vizibilitate < 1000) {
            vizNivel = 'Redusă din cauza ceții';
            vizImpact = 'Risc de dezorientare, folosiți GPS și urmăriți atent marcajele';
        } else if (data.vizibilitate < 3000) {
            vizNivel = 'Variabilă, cu nori joși';
            vizImpact = 'Atenție sporită la marcaje';
        } else {
            vizNivel = 'Bună';
            vizImpact = 'Vizual pe traseu clar';
        }
    } else {
        if (data.precip_max_hourly > 3) {
            vizNivel = 'Redusă din cauza precipitațiilor';
            vizImpact = 'Atenție sporită la orientare';
            vizSeverity = 'danger';
        } else if (data.precip_max_hourly > 1) {
            vizNivel = 'Variabilă, cu înnorări trecătoare';
            vizImpact = 'Vizual pe traseu în mare parte clar';
            vizSeverity = 'warning';
        } else {
            vizNivel = 'Bună, cu înnorări trecătoare';
            vizImpact = 'Vizual pe traseu în mare parte clar';
            vizSeverity = 'safe';
        }
    }

    sections.push({
        label: 'VIZIBILITATE / NORI',
        value: vizNivel,
        impact: vizImpact,
        severity: vizSeverity
    });

    // 6. ZĂPADĂ PE TRASEU
    if (data.strat_zapada !== undefined && data.strat_zapada > 0) {
        let zapadaNivel = '';
        let zapadaImpact = '';
        let zapadaSeverity = getSeverity(data.strat_zapada, 'snow');

        if (data.strat_zapada < 10) {
            zapadaNivel = 'Petice izolate pe zonele umbrite';
            zapadaImpact = 'Pot face poteca alunecoasă, necesită atenție la pași';
        } else if (data.strat_zapada < 30) {
            zapadaNivel = `Strat continuu (${data.strat_zapada} cm)`;
            zapadaImpact = 'Necesită bocanci impermeabili și atenție constantă';
        } else if (data.strat_zapada < 60) {
            zapadaNivel = `Strat consistent (${data.strat_zapada} cm)`;
            zapadaImpact = 'Încetinește semnificativ înaintarea, necesită echipament de iarnă';
        } else {
            zapadaNivel = `Strat gros (${data.strat_zapada} cm)`;
            zapadaImpact = 'Condiții foarte dificile, necesită crampoane și experiență';
        }

        sections.push({
            label: 'ZĂPADĂ PE TRASEU',
            value: zapadaNivel,
            impact: zapadaImpact,
            severity: zapadaSeverity
        });
    } else {
        sections.push({
            label: 'ZĂPADĂ PE TRASEU',
            value: 'Absentă',
            impact: 'Potecă curată',
            severity: 'safe'
        });
    }

    // Separate by severity
    const dangerousSections = sections.filter(s => s.severity === 'danger' || s.severity === 'warning');
    const safeSections = sections.filter(s => s.severity === 'safe');

    // Determine overall verdict
    const hasDanger = sections.some(s => s.severity === 'danger');
    const hasWarning = sections.some(s => s.severity === 'warning');

    let overallVerdict = '';
    let verdictColor = '';

    if (hasDanger) {
        overallVerdict = 'Condiții periculoase';
        verdictColor = 'severity-danger';
    } else if (hasWarning) {
        overallVerdict = 'Condițiile pot fi dificile';
        verdictColor = 'severity-warning';
    } else {
        overallVerdict = 'Condiții bune';
        verdictColor = 'severity-safe';
    }

    return {
        sections,
        dangerousSections,
        safeSections,
        overallVerdict,
        verdictColor
    };
}
