
import React from 'react';
import { Shield, ShieldAlert, Ambulance, Flame, Siren, Info, Map, Activity, FileCheck } from 'lucide-react';
import { EmergencyNumbers, SafetyAdvisory } from '../types';

interface SafetyCardProps {
  countryName: string;
  emergencyNumbers: EmergencyNumbers;
  advisory: SafetyAdvisory;
  labels: any;
}

export const SafetyCard: React.FC<SafetyCardProps> = ({ countryName, emergencyNumbers, advisory, labels }) => {
  // Helper to determine color and label based on score (0-5)
  const getRiskLevel = (score: number) => {
    if (score < 2.5) return { label: 'Low Risk', color: 'text-emerald-500', bg: 'bg-emerald-500', border: 'border-emerald-500' };
    if (score < 3.5) return { label: 'Medium Risk', color: 'text-amber-500', bg: 'bg-amber-500', border: 'border-amber-500' };
    if (score < 4.5) return { label: 'High Risk', color: 'text-orange-500', bg: 'bg-orange-500', border: 'border-orange-500' };
    return { label: 'Extreme Warning', color: 'text-red-600', bg: 'bg-red-600', border: 'border-red-600' };
  };

  const risk = getRiskLevel(advisory.score);
  const scorePercent = (advisory.score / 5) * 100;

  return (
    <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
        <Shield className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
        {labels.safetyAdvisory}
      </h3>

      {/* Risk Score Section */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className={`text-sm font-bold uppercase tracking-wider ${risk.color}`}>
            {risk.label}
          </span>
          <span className="text-xs text-slate-400 font-mono">{labels.riskScore}: {advisory.score.toFixed(1)}/5.0</span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
          <div 
            className={`h-full ${risk.bg} transition-all duration-1000 ease-out relative`}
            style={{ width: `${scorePercent}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
          </div>
        </div>
        
        <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-400" />
          <p>{advisory.message}</p>
        </div>
      </div>

      {/* Detailed Advisory Grid (Regions & Health) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Regions to Avoid */}
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
            <Map className="w-4 h-4" /> {labels.regionsToAvoid}
          </h4>
          {advisory.regionsToAvoid && advisory.regionsToAvoid.length > 0 ? (
            <ul className="space-y-2">
              {advisory.regionsToAvoid.map((region, idx) => (
                <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>{region}</span>
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-sm text-slate-500 italic">None listed</p>
          )}
        </div>

        {/* Health Risks */}
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" /> {labels.healthRisks}
          </h4>
           {advisory.healthRisks && advisory.healthRisks.length > 0 ? (
            <ul className="space-y-2">
              {advisory.healthRisks.map((risk, idx) => (
                <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-sm text-slate-500 italic">None listed</p>
          )}
        </div>
      </div>

      {/* Visa Info */}
      {advisory.visaInfo && (
        <div className="mb-8 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
            <FileCheck className="w-4 h-4" /> {labels.visaInfo}
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {advisory.visaInfo}
          </p>
        </div>
      )}

      {/* Emergency Numbers Grid */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
          <Siren className="w-4 h-4" /> {labels.emergencyContacts}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex flex-col items-center text-center group hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <ShieldAlert className="w-5 h-5 text-blue-500 dark:text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400">{labels.police}</span>
            <span className="text-lg font-mono font-bold text-slate-700 dark:text-slate-200">{emergencyNumbers.police}</span>
          </div>
          
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex flex-col items-center text-center group hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <Ambulance className="w-5 h-5 text-red-500 dark:text-red-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 group-hover:text-red-500 dark:group-hover:text-red-400">{labels.medical}</span>
            <span className="text-lg font-mono font-bold text-slate-700 dark:text-slate-200">{emergencyNumbers.ambulance}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex flex-col items-center text-center group hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
            <Flame className="w-5 h-5 text-orange-500 dark:text-orange-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 group-hover:text-orange-500 dark:group-hover:text-orange-400">{labels.fire}</span>
            <span className="text-lg font-mono font-bold text-slate-700 dark:text-slate-200">{emergencyNumbers.fire}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-[10px] text-slate-400 text-center border-t border-slate-200 dark:border-slate-700/50 pt-4">
        {labels.source}: AI Risk Assessment & General Knowledge Base
      </div>
    </div>
  );
};
