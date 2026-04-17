export interface MasivData {
  name: string;
  prag: number;
  coords: {
    sub: { lat: number; lon: number };
    peste: { lat: number; lon: number };
  };
  avalansa_key: string | null;
}

export interface WeatherData {
  temperatura: number;
  temp_min: number;
  temp_max: number;
  windchill?: number;
  vant_mean: number;
  vant_max: number;
  precip_max_hourly: number;
  precip_total_8_20: number;
  precip_type: string;
  thunderstorm_prob: number;
  uv_index: number;
  cod_vreme: number;
  avalansa_nivel: number;
  avalansa_text: string;
  strat_zapada?: number;
  temp_zapada?: number;
  vizibilitate?: number;
}

export interface WeatherStatus {
  color: 'red' | 'yellow' | 'green';
  level: 'danger' | 'warning' | 'safe';
  message: string;
}

export interface NarrativeSection {
  label: string;
  value: string;
  impact: string;
  severity: 'danger' | 'warning' | 'safe';
}

export type AltitudineType = 'sub' | 'peste';
export type MasivKey = 'bucegi' | 'fagaras' | 'retezat' | 'piatra_craiului' | 'ceahlau' | 'apuseni';
