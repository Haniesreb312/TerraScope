
export interface EconomicMetric {
  year: string;
  gdp: number;
  inflation: number;
}

export interface Landmark {
  name: string;
  description: string;
  type: string;
  emoji?: string;
  url?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Currency {
  name: string;
  code: string;
  symbol: string;
}

export interface EmergencyNumbers {
  police: string;
  ambulance: string;
  fire: string;
}

export interface SafetyAdvisory {
  score: number;
  message: string;
  regionsToAvoid: string[];
  healthRisks: string[];
  visaInfo: string;
}

export interface CountryProfile {
  name: string;
  officialName: string;
  capital: string;
  population: string;
  currency: Currency;
  languages: string[];
  region: string;
  description: string;
  funFacts: string[];
  economicHistory: EconomicMetric[];
  landmarks: Landmark[];
  climate: string;
  internetTLD: string;
  callingCode: string;
  timezones: string[];
  coordinates: Coordinates;
  capitalCoordinates: Coordinates;
  isoAlpha2: string;
  emergencyNumbers: EmergencyNumbers;
  safetyAdvisory: SafetyAdvisory;
}

export enum FetchStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}