
import React, { useState, useEffect } from 'react';
import { 
  MapPin, Users, Coins, Globe, Phone, Info, Plane, Compass, MessageCircle,
  Camera, Mountain, Building2, Palmtree, Landmark as LandmarkIcon,
  Plus, Scale, Trash2, X, Check, Languages, Clock, CloudSun, ExternalLink
} from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { MetricsChart } from './components/MetricsChart';
import { MapComponent } from './components/MapComponent';
import { CountryFlag } from './components/CountryFlag';
import { ComparisonView } from './components/ComparisonView';
import { CurrencyDisplay } from './components/CurrencyDisplay';
import { ShareButton } from './components/ShareButton';
import { ThemeToggle } from './components/ThemeToggle';
import { ExchangeRateCard } from './components/ExchangeRateCard';
import { WeatherCard } from './components/WeatherCard';
import { SafetyCard } from './components/SafetyCard';
import { NewsSection } from './components/NewsSection';
import { fetchCountryProfile, translateContent } from './services/geminiService';
import { CountryProfile, FetchStatus } from './types';
import { translations } from './translations';

const PLACEHOLDER_IMAGE = "https://picsum.photos/1200/400";

const App: React.FC = () => {
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.IDLE);
  const [data, setData] = useState<CountryProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Language State for the Application
  const [appLanguage, setAppLanguage] = useState('English');
  const t = translations[appLanguage] || translations['English'];

  // Theme State
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // Content Translation State (specific to country description toggling)
  const [translatedContent, setTranslatedContent] = useState<{description: string, funFacts: string[]} | null>(null);
  const [translationStatus, setTranslationStatus] = useState<FetchStatus>(FetchStatus.IDLE);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English'); // For the specific country language dropdown

  // Comparison State
  const [comparisonList, setComparisonList] = useState<CountryProfile[]>([]);
  const [isCompareMode, setIsCompareMode] = useState(false);

  const handleSearch = async (query: string, updateHistory = true) => {
    setStatus(FetchStatus.LOADING);
    setError(null);
    // If we are in compare mode, switch back to single view for the search
    if (isCompareMode) setIsCompareMode(false);
    
    // Reset translation state
    setTranslatedContent(null);
    setSelectedLanguage(appLanguage); // Reset local translation to app language
    setTranslationStatus(FetchStatus.IDLE);
    
    try {
      const result = await fetchCountryProfile(query, appLanguage);
      setData(result);
      setStatus(FetchStatus.SUCCESS);
      
      // Update URL for deep linking capability
      if (updateHistory) {
        try {
          const url = new URL(window.location.href);
          url.searchParams.set('country', result.name);
          window.history.pushState({ path: url.toString() }, '', url.toString());
        } catch (historyErr) {
          // Ignore history errors in sandbox environments
          console.warn("Could not update browser history:", historyErr);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch country data. Please try again.");
      setStatus(FetchStatus.ERROR);
    }
  };

  // Handle Deep Linking on Mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const countryParam = params.get('country');
    if (countryParam) {
      handleSearch(countryParam, false); // Don't push state since we are already there
    }
  }, []); // Run once on mount

  // Re-fetch when app language changes if we already have data
  // This is optional but good for UX. For now, we will only apply language change to next search
  // or just rely on the user to re-search if they change language mid-session.
  // Actually, let's keep it simple: changing app language just changes UI labels immediately.
  // The content language remains until next search.

  const handleContentTranslation = async (lang: string) => {
    if (!data) return;
    setSelectedLanguage(lang);
    
    // If filtering back to original language (assuming data was fetched in appLanguage)
    if (lang === appLanguage) {
      setTranslatedContent(null);
      return;
    }
    
    setTranslationStatus(FetchStatus.LOADING);
    try {
      const result = await translateContent(data.description, data.funFacts, lang);
      setTranslatedContent(result);
      setTranslationStatus(FetchStatus.SUCCESS);
    } catch (e) {
      console.error(e);
      setTranslationStatus(FetchStatus.ERROR);
    }
  };

  const addToComparison = () => {
    if (!data) return;
    if (comparisonList.length >= 3) return;
    if (comparisonList.some(c => c.isoAlpha2 === data.isoAlpha2)) return;

    setComparisonList([...comparisonList, data]);
  };

  const removeFromComparison = (iso: string) => {
    const newList = comparisonList.filter(c => c.isoAlpha2 !== iso);
    setComparisonList(newList);
    if (newList.length === 0) {
      setIsCompareMode(false);
    }
  };

  const toggleCompareMode = () => {
    if (comparisonList.length > 0) {
      setIsCompareMode(!isCompareMode);
    }
  };

  const getLandmarkIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('nature') || t.includes('mountain') || t.includes('river') || t.includes('park')) 
      return <Mountain className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />;
    if (t.includes('history') || t.includes('ancient') || t.includes('temple') || t.includes('museum')) 
      return <LandmarkIcon className="w-6 h-6 text-amber-500 dark:text-amber-400" />;
    if (t.includes('urban') || t.includes('city') || t.includes('modern') || t.includes('tower')) 
      return <Building2 className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />;
    if (t.includes('beach') || t.includes('coast') || t.includes('sea') || t.includes('island')) 
      return <Palmtree className="w-6 h-6 text-blue-500 dark:text-blue-400" />;
    return <Camera className="w-6 h-6 text-purple-500 dark:text-purple-400" />;
  };

  const isCurrentInComparison = data && comparisonList.some(c => c.isoAlpha2 === data.isoAlpha2);
  const isComparisonFull = comparisonList.length >= 3;

  // Derived display data
  const displayDescription = translatedContent ? translatedContent.description : data?.description;
  const displayFunFacts = translatedContent ? translatedContent.funFacts : data?.funFacts;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 selection:bg-cyan-500/30 pb-32 transition-colors duration-500">
      {/* Background Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-50 dark:opacity-100 transition-opacity duration-500">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-8">
        {/* Header & Theme Toggle */}
        <div className="flex flex-col items-center justify-center relative mb-4">
          <div className="absolute right-0 top-0 md:top-2 flex items-center gap-3">
            {/* App Language Selector */}
            <div className="relative group">
              <select 
                value={appLanguage}
                onChange={(e) => setAppLanguage(e.target.value)}
                className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2 pl-3 pr-8 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-medium cursor-pointer"
              >
                {Object.keys(translations).map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <Globe className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
            
            <ThemeToggle isDark={isDark} toggle={toggleTheme} />
          </div>
          <div className="text-center space-y-4 mt-12 md:mt-0">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight cursor-pointer text-slate-900 dark:text-white" onClick={() => {
              setIsCompareMode(false);
              setData(null);
              setStatus(FetchStatus.IDLE);
              try {
                  const url = new URL(window.location.href);
                  url.searchParams.delete('country');
                  window.history.pushState({}, '', url.toString());
              } catch (e) {
                  console.warn("History update failed:", e);
              }
            }}>
              Terra<span className="gradient-text">Scope</span>
            </h1>
            {!isCompareMode && (
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Explore the world with AI-powered insights. 
                Get comprehensive data, economic trends, and travel guides instantly.
              </p>
            )}
          </div>
        </div>

        {/* Search - Hide when in compare mode */}
        {!isCompareMode && (
          <SearchBar 
            onSearch={(q) => handleSearch(q)} 
            isLoading={status === FetchStatus.LOADING} 
            placeholder={t.searchPlaceholder}
          />
        )}

        {/* Error State */}
        {status === FetchStatus.ERROR && !isCompareMode && (
          <div className="mx-auto max-w-2xl w-full p-4 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-700 dark:text-red-200 text-center">
            {error}
          </div>
        )}

        {/* Comparison View */}
        {isCompareMode ? (
          <ComparisonView 
            countries={comparisonList} 
            onClose={() => setIsCompareMode(false)}
            onRemove={removeFromComparison}
            isDark={isDark}
            labels={t}
          />
        ) : (
          /* Single Country View */
          status === FetchStatus.SUCCESS && data && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              
              {/* Hero Card */}
              <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl">
                <div className="h-48 md:h-64 w-full bg-slate-800 relative">
                  <img 
                    src={PLACEHOLDER_IMAGE} 
                    alt="Country Landscape" 
                    className="w-full h-full object-cover opacity-70 dark:opacity-60 mix-blend-overlay" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent p-8 flex flex-col justify-end">
                    <div className="flex items-end justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider border border-cyan-500/20 shadow-sm">
                            {data.region}
                          </span>
                          
                          {/* Share Button */}
                          <ShareButton countryName={data.name} />
                          
                          {/* Add to Compare Button */}
                          <button
                            onClick={addToComparison}
                            disabled={isCurrentInComparison || isComparisonFull}
                            className={`
                              flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border transition-all shadow-sm
                              ${isCurrentInComparison 
                                ? 'bg-emerald-500/20 text-emerald-300 dark:text-emerald-400 border-emerald-500/20 cursor-default' 
                                : isComparisonFull 
                                  ? 'bg-slate-700 text-slate-400 border-slate-600 cursor-not-allowed'
                                  : 'bg-blue-500/20 text-blue-300 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/30 cursor-pointer'
                              }
                            `}
                          >
                            {isCurrentInComparison ? (
                              <>
                                <Check className="w-3 h-3" /> {t.added}
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3" /> {isComparisonFull ? t.listFull : t.addToCompare}
                              </>
                            )}
                          </button>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">{data.name}</h2>
                        <p className="text-slate-200 dark:text-slate-300 text-lg max-w-3xl drop-shadow">{data.officialName}</p>
                      </div>
                      
                      {/* Flag Display */}
                      <div className="flex-shrink-0 mb-1">
                         <CountryFlag 
                           isoCode={data.isoAlpha2} 
                           name={data.name} 
                           className="w-20 md:w-32 aspect-[3/2] border-2 border-white/30 shadow-[0_0_20px_rgba(0,0,0,0.3)] transform md:-rotate-3 hover:rotate-0 transition-transform duration-300"
                         />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-slate-200 dark:border-white/5">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t.capital}</p>
                      <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{data.capital}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t.population}</p>
                      <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{data.population}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Coins className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t.currency}</p>
                      <CurrencyDisplay currency={data.currency} />
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t.languages}</p>
                      <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 truncate">{data.languages.slice(0, 2).join(', ')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Map, Details & Economics */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Map Panel */}
                  <div className="glass-panel p-8 rounded-3xl">
                     <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                      <Compass className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />
                      {t.location}
                    </h3>
                    <MapComponent 
                      key={data.name} // Force remount on change
                      coordinates={data.coordinates}
                      capitalCoordinates={data.capitalCoordinates}
                      countryName={data.name}
                      capitalName={data.capital}
                      isDark={isDark}
                      labels={t}
                    />
                  </div>

                  <div className="glass-panel p-8 rounded-3xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <h3 className="text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                        <Info className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />
                        {t.overview}
                      </h3>
                      
                      {/* Language Selector for Content Translation */}
                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                        <Languages className="w-4 h-4 text-slate-500 dark:text-slate-400 ml-2" />
                        <select 
                          value={selectedLanguage}
                          onChange={(e) => handleContentTranslation(e.target.value)}
                          disabled={translationStatus === FetchStatus.LOADING}
                          className="bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer py-1 pr-2 pl-1"
                        >
                          <option value={appLanguage} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                            {appLanguage}
                          </option>
                          {data.languages.map(lang => (
                            // Don't duplicate if the language is the same as app language
                            lang !== appLanguage && (
                              <option key={lang} value={lang} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                                {lang}
                              </option>
                            )
                          ))}
                        </select>
                        {translationStatus === FetchStatus.LOADING && (
                          <div className="w-3 h-3 mr-2 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                        )}
                      </div>
                    </div>

                    <div className="relative min-h-[100px]">
                      {translationStatus === FetchStatus.LOADING ? (
                         <div className="space-y-3 animate-pulse">
                           <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-full"></div>
                           <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-5/6"></div>
                           <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-4/6"></div>
                         </div>
                      ) : (
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-6 transition-opacity duration-300">
                          {displayDescription}
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                          <Globe className="w-4 h-4" />
                          <span className="text-xs uppercase font-bold">{t.internetTLD}</span>
                        </div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">{data.internetTLD}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                          <Phone className="w-4 h-4" />
                          <span className="text-xs uppercase font-bold">{t.callingCode}</span>
                        </div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">{data.callingCode}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs uppercase font-bold">{t.timezone}</span>
                        </div>
                        <p className="font-medium text-slate-800 dark:text-slate-200 text-sm truncate">
                          {data.timezones && data.timezones.length > 0 ? data.timezones[0] : 'N/A'}
                          {data.timezones && data.timezones.length > 1 && <span className="text-xs text-slate-500 ml-1">+{data.timezones.length - 1}</span>}
                        </p>
                      </div>

                      <div className="col-span-2 md:col-span-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-3">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-xs uppercase font-bold">{t.languages}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {data.languages.slice(0, 4).map((lang, i) => (
                            <span key={i} className="px-2 py-1 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50 rounded text-xs text-slate-700 dark:text-slate-200">
                              {lang}
                            </span>
                          ))}
                          {data.languages.length > 4 && (
                            <span className="px-2 py-1 text-xs text-slate-500">+ {data.languages.length - 4} more</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Safety & Travel Advisory (Moved to Main Column) */}
                  <SafetyCard 
                    countryName={data.name} 
                    emergencyNumbers={data.emergencyNumbers}
                    advisory={data.safetyAdvisory}
                    labels={t}
                  />

                  <div className="glass-panel p-8 rounded-3xl">
                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                      <Coins className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                      {t.economicIndicators}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{t.economicTrends} (Last 5 Years)</p>
                    <MetricsChart data={data.economicHistory} isDark={isDark} />
                    
                    {/* Exchange Rates Section */}
                    <ExchangeRateCard 
                      currencyCode={data.currency.code} 
                      currencyName={data.currency.name} 
                      labels={t}
                    />
                  </div>
                </div>

                {/* Right Column: Weather, News, Trivia & Travel */}
                <div className="space-y-8">
                  {/* Weather Card */}
                  <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
                     <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                      <CloudSun className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                      {t.currentWeather}
                    </h3>
                    <div className="h-48">
                       <WeatherCard 
                         coordinates={data.capitalCoordinates} 
                         city={data.capital}
                         labels={t} 
                       />
                    </div>
                  </div>

                   {/* News Section */}
                   <NewsSection 
                     countryName={data.name} 
                     language={appLanguage}
                     labels={t}
                   />

                  <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-pink-500">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t.didYouKnow}</h3>
                      {translationStatus === FetchStatus.LOADING && (
                         <div className="w-4 h-4 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
                      )}
                    </div>
                    <ul className="space-y-4">
                      {displayFunFacts && displayFunFacts.map((fact, i) => (
                        <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-300">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </span>
                          <span className={`text-sm leading-relaxed ${translationStatus === FetchStatus.LOADING ? 'opacity-50' : ''}`}>
                            {fact}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="glass-panel p-8 rounded-3xl">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                      <Plane className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                      {t.topLandmarks}
                    </h3>
                    <div className="space-y-6">
                      {data.landmarks.map((landmark, i) => (
                        <a 
                          key={i} 
                          href={landmark.url || `https://www.google.com/search?q=${encodeURIComponent(landmark.name + ' ' + data.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex gap-4 p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-slate-200 dark:hover:border-white/5 cursor-pointer items-start"
                        >
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 text-slate-800 dark:text-slate-200 relative">
                            {landmark.emoji ? (
                              <span className="text-2xl" role="img" aria-label={landmark.name}>{landmark.emoji}</span>
                            ) : (
                              getLandmarkIcon(landmark.type)
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-start mb-1 gap-2">
                              <h4 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate pr-4">
                                {landmark.name}
                              </h4>
                              <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                            </div>
                            <p className="text-xs text-cyan-600 dark:text-cyan-400/80 mb-1 uppercase tracking-wider font-bold text-[10px]">
                              {landmark.type}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                              {landmark.description}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )
        )}
      </div>

      {/* Floating Comparison Tray */}
      {comparisonList.length > 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in slide-in-from-bottom-10 duration-500">
          <div className="glass-panel rounded-2xl p-3 flex items-center justify-between shadow-2xl border border-cyan-500/20 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {comparisonList.map((c) => (
                  <div key={c.isoAlpha2} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 overflow-hidden relative bg-slate-200 dark:bg-slate-700 group">
                    <CountryFlag isoCode={c.isoAlpha2} name={c.name} className="w-full h-full" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeFromComparison(c.isoAlpha2); }}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400 font-medium ml-2">
                {comparisonList.length} / 3
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setComparisonList([])}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-white transition-colors"
                title={t.clearList}
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={toggleCompareMode}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-lg
                  ${isCompareMode 
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:brightness-110'
                  }
                `}
              >
                {isCompareMode ? (
                  <> {t.back} <X className="w-4 h-4" /></>
                ) : (
                  <> {t.compare} <Scale className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;