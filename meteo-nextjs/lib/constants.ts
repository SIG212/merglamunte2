import { MasivData, MasivKey } from '@/types/weather';

export const MASIVE_DATA: Record<MasivKey, MasivData> = {
    bucegi: {
        name: 'Bucegi',
        prag: 1800,
        coords: {
            sub: { lat: 45.467, lon: 25.500 },
            peste: { lat: 45.400, lon: 25.457 }
        },
        avalansa_key: 'bucegi'
    },
    fagaras: {
        name: 'Făgăraș',
        prag: 1600,
        coords: {
            sub: { lat: 45.653, lon: 24.787 },
            peste: { lat: 45.596, lon: 24.635 }
        },
        avalansa_key: 'fagaras'
    },
    retezat: {
        name: 'Retezat',
        prag: 1600,
        coords: {
            sub: { lat: 45.372, lon: 23.064 },
            peste: { lat: 45.350, lon: 22.880 }
        },
        avalansa_key: 'retezat'
    },
    piatra_craiului: {
        name: 'Piatra Craiului',
        prag: 1400,
        coords: {
            sub: { lat: 45.506, lon: 25.265 },
            peste: { lat: 45.520, lon: 25.215 }
        },
        avalansa_key: 'piatra_craiului'
    },
    ceahlau: {
        name: 'Ceahlău',
        prag: 1800,
        coords: {
            sub: { lat: 47.058, lon: 25.955 },
            peste: { lat: 47.020, lon: 25.960 }
        },
        avalansa_key: null
    },
    apuseni: {
        name: 'Apuseni',
        prag: 1500,
        coords: {
            sub: { lat: 46.544, lon: 22.854 },
            peste: { lat: 46.682, lon: 22.711 }
        },
        avalansa_key: null
    }
};

export const PRAGURI = {
    windchill: {
        verde: -15,
        galben: -25,
        rosu: -35
    },
    vant: {
        verde: 30,
        galben: 50,
        rosu: 80
    },
    precipitatii: {
        verde: 2,
        galben: 5
    }
};

export const CUSTOM_MESSAGES = {
    windchill: {
        red: 'Pericol de degerături. Folosiți echipament de iarnă complet.',
        yellow: 'Frig intens. Echipament adecvat necesar.',
        green: 'Temperatură acceptabilă pentru drumeție.'
    },
    vant: {
        red: 'Vânt foarte puternic. Drumeția este periculoasă.',
        yellow: 'Vânt moderat. Atenție pe creste și zone expuse.',
        green: 'Condiții bune de vânt.'
    },
    precipitatii_max: {
        red: 'Precipitații foarte intense. Risc crescut.',
        yellow: 'Precipitații moderate. Echipament impermeabil necesar.',
        green: 'Precipitații slabe sau absente.'
    },
    precipitatii_total: {
        red: 'Acumulare mare de precipitații. Condiții dificile.',
        yellow: 'Acumulare moderată. Pregătiți echipament adecvat.',
        green: 'Acumulare redusă de precipitații.'
    },
    thunderstorm: {
        red: 'Risc ridicat de furtună. Evitați crestele.',
        yellow: 'Risc moderat de descărcări electrice.',
        green: 'Fără risc semnificativ de furtună.'
    },
    uv: {
        red: 'UV foarte ridicat. Protecție solară obligatorie.',
        yellow: 'UV moderat-ridicat. Folosiți cremă de protecție.',
        green: 'UV scăzut.'
    },
    vizibilitate: {
        red: 'Vizibilitate foarte redusă. Risc de dezorientare.',
        yellow: 'Vizibilitate redusă. Atenție la marcaje.',
        green: 'Vizibilitate bună.'
    },
    avalansa: {
        red: 'Risc mare de avalanșă. Evitați zonele expuse.',
        yellow: 'Risc moderat de avalanșă. Experiență necesară.',
        green: 'Risc scăzut de avalanșă.'
    }
};

export const WEATHER_ICONS: Record<number, string> = {
    1: '☀️',
    2: '🌤️',
    3: '⛅',
    4: '☁️',
    5: '🌧️',
    6: '🌧️',
    7: '❄️',
    8: '🌨️',
    9: '⛈️'
};
