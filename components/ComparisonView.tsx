
import React from 'react';
import { CountryProfile } from '../types';
import { X, Trash2, MapPin, Users, Coins, Globe, Wind, TrendingUp, ShieldCheck } from 'lucide-react';
import { CountryFlag } from './CountryFlag';
import { MetricsChart } from './MetricsChart';
import { CurrencyDisplay } from './CurrencyDisplay';

interface ComparisonViewProps {
  countries: CountryProfile[];
  onClose: () => void;
  onRemove: (iso: string) => void;
  isDark: boolean;
  labels: any;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ countries, onClose, onRemove, isDark, labels }) => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{labels.compare}</h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <div className="flex min-w-full divide-x divide-slate-200 dark:divide-slate-700/50">
            {countries.map((country) => (
              <div key={country.isoAlpha2} className="flex-1 min-w-[320px] flex flex-col">
                {/* Header */}
                <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 relative border-b border-slate-200 dark:border-slate-700/50">
                  <button 
                    onClick={() => onRemove(country.isoAlpha2)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors"
                    title="Remove from comparison"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <CountryFlag 
                      isoCode={country.isoAlpha2} 
                      name={country.name} 
                      className="w-24 h-16 shadow-lg rounded-lg"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{country.name}</h3>
                      <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">{country.region}</p>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex-1 divide-y divide-slate-200 dark:divide-slate-700/50 bg-white/50 dark:bg-slate-900/20">
                  {/* Capital */}
                  <div className="p-6 space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm uppercase font-bold tracking-wider">
                      <MapPin className="w-4 h-4" /> {labels.capital}
                    </div>
                    <p className="text-lg text-slate-800 dark:text-slate-200 font-medium">{country.capital}</p>
                  </div>

                  {/* Population */}
                  <div className="p-6 space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm uppercase font-bold tracking-wider">
                      <Users className="w-4 h-4" /> {labels.population}
                    </div>
                    <p className="text-lg text-slate-800 dark:text-slate-200 font-medium">{country.population}</p>
                  </div>

                  {/* Currency */}
                  <div className="p-6 space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm uppercase font-bold tracking-wider">
                      <Coins className="w-4 h-4" /> {labels.currency}
                    </div>
                    <CurrencyDisplay currency={country.currency} />
                  </div>

                  {/* Languages */}
                  <div className="p-6 space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm uppercase font-bold tracking-wider">
                      <ShieldCheck className="w-4 h-4" /> {labels.officialLanguages}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {country.languages.slice(0, 3).map((lang, i) => (
                        <span key={i} className="text-sm px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600/30">
                          {lang}
                        </span>
                      ))}
                      {country.languages.length > 3 && (
                        <span className="text-sm px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600/30">
                          +{country.languages.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Internet TLD */}
                  <div className="p-6 space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm uppercase font-bold tracking-wider">
                      <Globe className="w-4 h-4" /> {labels.internetTLD}
                    </div>
                    <p className="text-lg text-slate-800 dark:text-slate-200 font-medium">{country.internetTLD}</p>
                  </div>

                  {/* Climate */}
                  <div className="p-6 space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm uppercase font-bold tracking-wider">
                      <Wind className="w-4 h-4" /> {labels.climate}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">{country.climate}</p>
                  </div>

                   {/* Economics */}
                   <div className="p-6 space-y-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm uppercase font-bold tracking-wider">
                      <TrendingUp className="w-4 h-4" /> {labels.economicTrends}
                    </div>
                    <div className="h-32">
                      <MetricsChart data={country.economicHistory} isDark={isDark} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 rounded bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/30">
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">{labels.latestGDP}</span>
                        <span className="text-cyan-600 dark:text-cyan-400 font-bold text-lg">{country.economicHistory[country.economicHistory.length - 1]?.gdp}%</span>
                      </div>
                      <div className="p-2 rounded bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/30">
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">{labels.inflation}</span>
                        <span className="text-red-500 dark:text-red-400 font-bold text-lg">{country.economicHistory[country.economicHistory.length - 1]?.inflation}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
