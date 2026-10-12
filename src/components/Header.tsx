import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Clock, 
  Building2, 
  Database, 
  Trophy, 
  SlidersHorizontal,
  Flame
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'rooms' | 'simulator' | 'blockchain' | 'leaderboard';
  setActiveTab: (tab: 'rooms' | 'simulator' | 'blockchain' | 'leaderboard') => void;
  activeViolationsCount: number;
  totalKWhSaved: number;
  isChainValid: boolean;
  simulatedTime: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeViolationsCount,
  totalKWhSaved,
  isChainValid,
  simulatedTime,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top brand & live status bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3.5 gap-4 border-b border-slate-800/60">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black">
              <Zap className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  VoltLedger <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">Smart Campus AI + Web3</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Timetable-Aware Energy Monitoring • Automated Circuit Cut-Off • Immutable Audit Ledger
              </p>
            </div>
          </div>

          {/* Quick telemetry indicators */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-medium">
            {/* Live simulated time */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Campus Time:</span>
              <span className="font-mono text-sky-300 font-semibold">{simulatedTime}</span>
            </div>

            {/* Blockchain ledger health */}
            <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border ${
              isChainValid 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                : 'bg-rose-950/60 border-rose-500/60 text-rose-300 animate-pulse'
            }`}>
              <ShieldCheck className={`w-3.5 h-3.5 ${isChainValid ? 'text-emerald-400' : 'text-rose-400'}`} />
              <span>Ledger:</span>
              <span className="font-semibold">{isChainValid ? 'Verified Intact' : 'TAMPER DETECTED!'}</span>
            </div>

            {/* Active violations badge */}
            {activeViolationsCount > 0 ? (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 animate-pulse-fast">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Violations:</span>
                <span className="font-bold">{activeViolationsCount} Pending Cut-Off</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700/60 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <span>Zero Violations</span>
              </div>
            )}

            {/* Total verified saved counter */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-300">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Avoided Waste:</span>
              <span className="font-mono font-bold text-white">{totalKWhSaved.toFixed(1)} kWh</span>
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex space-x-1 sm:space-x-2 pt-2 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'rooms'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Room Switch Matrix</span>
            {activeViolationsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
                {activeViolationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'simulator'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="flex items-center gap-1.5">
              <span>Cut-Off Demo Simulator</span>
              <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-1.5 py-0.5 rounded font-mono">Judge Demo</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('blockchain')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'blockchain'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Blockchain Audit Explorer</span>
            {!isChainValid && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                ALERT
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Green Credits & Leaderboard</span>
          </button>
        </div>
      </div>
    </header>
  );
};
