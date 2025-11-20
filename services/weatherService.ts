
export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  isDay: boolean;
}

export const getCurrentWeather = async (lat: number, lon: number): Promise<WeatherData | null> => {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m',
      wind_speed_unit: 'kmh'
    });

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const current = data.current;

    return {
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      weatherCode: current.weather_code,
      isDay: current.is_day === 1
    };
  } catch (error) {
    console.error("Failed to fetch weather data", error);
    return null;
  }
};
