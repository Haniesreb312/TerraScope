import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  toggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, toggle }) => {
  return (
    <button
      onClick={toggle}
      className="p-2.5 rounded-full transition-all duration-300 shadow-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:bg-slate-100 dark:hover:bg-slate-700"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5 text-orange-500" />
      )}
    </button>
  );
};
