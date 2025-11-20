
import React, { useEffect, useState } from 'react';
import { Newspaper, ExternalLink, Loader2, Globe } from 'lucide-react';
import { fetchCountryNews, NewsResult } from '../services/geminiService';

interface NewsSectionProps {
  countryName: string;
  language: string;
  labels: any;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ countryName, language, labels }) => {
  const [news, setNews] = useState<NewsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadNews = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await fetchCountryNews(countryName, language);
        if (isMounted) {
          setNews(data);
        }
      } catch (e) {
        console.error("Failed to fetch news:", e);
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (countryName) {
      loadNews();
    }

    return () => {
      isMounted = false;
    };
  }, [countryName, language]);

  return (
    <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <Newspaper className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          {labels.topNews}
        </h3>
        <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
          {labels.googleSearch}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-full animate-pulse" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-5/6 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
             <div className="h-12 bg-slate-200 dark:bg-slate-700/50 rounded-lg animate-pulse" />
             <div className="h-12 bg-slate-200 dark:bg-slate-700/50 rounded-lg animate-pulse" />
          </div>
        </div>
      ) : error ? (
        <div className="text-center p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
          <p className="text-sm text-slate-500 dark:text-slate-400">{labels.noNews}</p>
        </div>
      ) : news ? (
        <div className="space-y-6">
          {/* News Summary */}
          <div className="prose dark:prose-invert prose-sm max-w-none">
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 whitespace-pre-line">
              {news.content.split('* ').map((item, index) => {
                if (!item.trim()) return null;
                const cleanItem = item.trim();
                return (
                  <div key={index} className="flex gap-3">
                    <span className="text-blue-500 dark:text-blue-400 mt-1.5">•</span>
                    <span>{cleanItem}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sources */}
          {news.sources.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-700/50 pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                {labels.sources}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {news.sources.slice(0, 4).map((source, idx) => (
                  <a
                    key={idx}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800/50 transition-all group"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Globe className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                        {source.title}
                      </span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
