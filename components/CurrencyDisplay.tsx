import React from 'react';
import { Currency } from '../types';

export const CurrencyDisplay: React.FC<{ currency: Currency }> = ({ currency }) => {
  return (
    <div className="flex items-baseline flex-wrap gap-x-2">
      <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
        {currency.symbol}
      </span>
      <span className="font-medium text-slate-800 dark:text-slate-100">
        {currency.name}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700">
        {currency.code}
      </span>
    </div>
  );
};