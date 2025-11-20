
export interface TravelAdvisoryData {
  score: number; // 0 (Safe) to 5 (Extreme)
  message: string;
  updated: string;
  isoAlpha2: string;
}

export const getTravelAdvisory = async (isoCode: string): Promise<TravelAdvisoryData | null> => {
  try {
    // Using travel-advisory.info API
    const response = await fetch(`https://www.travel-advisory.info/api?countrycode=${isoCode}`);
    
    if (!response.ok) return null;
    
    const json = await response.json();
    
    // The API returns data keyed by the ISO code
    // e.g. { data: { US: { ... } } }
    const countryData = json.data[isoCode.toUpperCase()];
    
    if (!countryData || !countryData.advisory) return null;
    
    return {
      score: countryData.advisory.score,
      message: countryData.advisory.message,
      updated: countryData.advisory.updated,
      isoAlpha2: countryData.iso_alpha2
    };
  } catch (error) {
    console.error("Failed to fetch travel advisory", error);
    return null;
  }
};