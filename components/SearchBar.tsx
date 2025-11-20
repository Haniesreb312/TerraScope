
import React, { useState } from 'react';
import { Search, Globe2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  placeholder: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, placeholder }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative z-10">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-20 dark:opacity-30 group-hover:opacity-60 dark:group-hover:opacity-75 transition duration-1000"></div>
        <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-xl p-2 border border-slate-200 dark:border-slate-700 shadow-xl transition-colors duration-300">
          <div className="p-3 text-slate-500 dark:text-slate-400">
            <Globe2 className="w-6 h-6" />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none text-lg font-light px-2"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[3rem] shadow-md"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
