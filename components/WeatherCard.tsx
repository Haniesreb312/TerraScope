
import React, { useEffect, useState } from 'react';
import { 
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind, CloudFog, CloudDrizzle, 
  Loader2, Droplets, Compass, Thermometer, MoveRight 
} from 'lucide-react';
import { getCurrentWeather, WeatherData } from '../services/weatherService';
import { Coordinates } from '../types';

interface WeatherCardProps {
  coordinates: Coordinates;
  city: string;
  labels: any;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ coordinates, city, labels }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  useEffect(() => {
    let isMounted = true;

    const fetchWeather = async () => {
      if (!coordinates) return;
      
      setLoading(true);
      // Small delay to prevent flickering on quick re-renders
      const data = await getCurrentWeather(coordinates.latitude, coordinates.longitude);
      
      if (isMounted) {
        if (data) {
          setWeather(data);
        } else {
          setError(true);
        }
        setLoading(false);
      }
    };

    fetchWeather();

    return () => {
      isMounted = false;
    };
  }, [coordinates]);

  if (error) return null;

  const convertTemp = (temp: number) => {
    if (unit === 'C') return Math.round(temp);
    return Math.round((temp * 9/5) + 32);
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  // Helper to map WMO codes to icons and labels
  const getWeatherIcon = (code: number, isDay: boolean) => {
    const iconClass = "w-10 h-10 text-white drop-shadow-md";
    
    // Clear sky
    if (code === 0) return <Sun className={`${iconClass} ${isDay ? 'text-yellow-300' : 'text-blue-200'}`} />;
    
    // Mainly clear, partly cloudy, and overcast
    if (code === 1 || code === 2 || code === 3) return <Cloud className={`${iconClass} text-slate-200`} />;
    
    // Fog
    if (code === 45 || code === 48) return <CloudFog className={`${iconClass} text-slate-300`} />;
    
    // Drizzle
    if (code >= 51 && code <= 57) return <CloudDrizzle className={`${iconClass} text-blue-300`} />;
    
    // Rain
    if (code >= 61 && code <= 67) return <CloudRain className={`${iconClass} text-blue-400`} />;
    if (code >= 80 && code <= 82) return <CloudRain className={`${iconClass} text-blue-500`} />;
    
    // Snow
    if (code >= 71 && code <= 77) return <CloudSnow className={`${iconClass} text-white`} />;
    if (code === 85 || code === 86) return <CloudSnow className={`${iconClass} text-white`} />;
    
    // Thunderstorm
    if (code >= 95) return <CloudLightning className={`${iconClass} text-purple-400`} />;
    
    return <Sun className={iconClass} />;
  };

  const getWeatherLabel = (code: number) => {
    // Ideally these would also be translated, but WMO codes are numerous. 
    // For now keeping English descriptions but using translated UI labels around them.
    switch(code) {
      case 0: return "Clear Sky";
      case 1: return "Mainly Clear";
      case 2: return "Partly Cloudy";
      case 3: return "Overcast";
      case 45: case 48: return "Foggy";
      case 51: case 53: case 55: return "Drizzle";
      case 56: case 57: return "Freezing Drizzle";
      case 61: case 63: case 65: return "Rain";
      case 66: case 67: return "Freezing Rain";
      case 71: case 73: case 75: return "Snow";
      case 77: return "Snow Grains";
      case 80: case 81: case 82: return "Rain Showers";
      case 85: case 86: return "Snow Showers";
      case 95: return "Thunderstorm";
      case 96: case 99: return "Thunderstorm & Hail";
      default: return "Unknown";
    }
  };

  return (
    <div 
      onClick={() => setUnit(u => u === 'C' ? 'F' : 'C')}
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-700 text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer h-full min-h-[140px]"
    >
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-black/5 blur-xl"></div>

      {/* Main Content - Visible by default, fades/moves slightly on hover */}
      <div className="relative z-10 p-4 flex flex-col justify-between h-full transition-all duration-300 group-hover:translate-y-[-5px] group-hover:opacity-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">{labels.weatherIn} {city}</p>
            {loading ? (
              <div className="h-8 w-16 bg-white/20 rounded animate-pulse mt-1"></div>
            ) : weather ? (
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{convertTemp(weather.temperature)}°</span>
                <span className="text-xl opacity-90">{unit}</span>
              </div>
            ) : (
              <span className="text-sm">{labels.unavailable}</span>
            )}
          </div>
          
          <div className="flex flex-col items-end">
            {loading ? (
              <Loader2 className="w-8 h-8 animate-spin opacity-50" />
            ) : weather ? (
              <>
                {getWeatherIcon(weather.weatherCode, weather.isDay)}
              </>
            ) : null}
          </div>
        </div>

        {!loading && weather && (
          <div className="mt-2">
            <p className="font-medium text-lg leading-none">{getWeatherLabel(weather.weatherCode)}</p>
            <div className="flex items-center gap-2 text-xs font-medium opacity-80 mt-1">
              <Wind className="w-3 h-3" />
              <span>{weather.windSpeed} km/h</span>
            </div>
          </div>
        )}
      </div>

      {/* Hover Overlay - Detailed Info */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md p-4 flex flex-col justify-center gap-3 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 z-20">
        {!loading && weather && (
          <>
            <div className="flex items-center justify-between border-b border-white/20 pb-2">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-200" />
                <span className="text-sm font-medium">{labels.humidity}</span>
              </div>
              <span className="font-bold">{weather.humidity}%</span>
            </div>
            
            <div className="flex items-center justify-between border-b border-white/20 pb-2">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-yellow-200" />
                <span className="text-sm font-medium">{labels.feelsLike}</span>
              </div>
              <span className="font-bold">{convertTemp(weather.feelsLike)}°{unit}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-200" />
                <span className="text-sm font-medium">{labels.wind}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold">{getWindDirection(weather.windDirection)}</span>
                <div className="bg-white/20 rounded-full p-0.5">
                  <MoveRight 
                    className="w-3 h-3 transform transition-transform duration-700" 
                    style={{ rotate: `${weather.windDirection + 90}deg` }} 
                  />
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-2 right-3 text-[10px] opacity-60 italic">
              {labels.clickToChange}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
