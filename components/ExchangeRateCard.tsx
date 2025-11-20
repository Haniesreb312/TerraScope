
import React, { useEffect, useState } from 'react';
import { ArrowRightLeft, TrendingUp, RefreshCw } from 'lucide-react';
import { getExchangeRates } from '../services/exchangeRateService';

interface ExchangeRateCardProps {
  currencyCode: string; // e.g., "USD", "JPY"
  currencyName: string;
  labels: any;
}

const MAJOR_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'AUD', 'CAD', 'CHF'];

export const ExchangeRateCard: React.FC<ExchangeRateCardProps> = ({ currencyCode, currencyName, labels }) => {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchRates = async () => {
      if (!currencyCode) return;
      
      setLoading(true);
      setError(false);
      
      const data = await getExchangeRates(currencyCode);
      
      if (isMounted) {
        if (data && data.rates) {
          setRates(data.rates);
        } else {
          setError(true);
        }
        setLoading(false);
      }
    };

    fetchRates();

    return () => {
      isMounted = false;
    };
  }, [currencyCode]);

  if (error) return null; // Hide component on error gracefully

  // Filter out the own currency from the list
  const displayCurrencies = MAJOR_CURRENCIES.filter(c => c !== currencyCode);

  return (
    <div className="mt-8 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-800 dark:text-slate-100">{labels.exchangeRates}</h4>
        </div>
        {loading ? (
          <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
        ) : (
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {labels.live}
          </span>
        )}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        1 {currencyCode} ({currencyName}) {labels.equals}:
      </p>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
          ))}
        </div>
      ) : rates ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {displayCurrencies.map((targetCode) => (
            <div 
              key={targetCode} 
              className="flex flex-col p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1">{targetCode}</span>
              <span className="text-lg font-mono font-semibold text-slate-800 dark:text-slate-100">
                {rates[targetCode]?.toFixed(rates[targetCode] < 0.01 ? 4 : 2)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-sm text-slate-500 italic">
          {labels.unavailable}
        </div>
      )}
      
      <div className="mt-4 text-[10px] text-slate-400 text-right">
        {labels.source}: open.er-api.com
      </div>
    </div>
  );
};
