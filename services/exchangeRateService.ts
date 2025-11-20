
export interface ExchangeRateResponse {
  result: string;
  base_code: string;
  rates: Record<string, number>;
  time_last_update_utc: string;
}

export const getExchangeRates = async (baseCode: string): Promise<ExchangeRateResponse | null> => {
  try {
    // Using open.er-api.com for free, no-key exchange rates
    const response = await fetch(`https://open.er-api.com/v6/latest/${baseCode}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.result === "success") {
      return data;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch exchange rates", error);
    return null;
  }
};
