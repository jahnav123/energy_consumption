import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Clock, 
  Building2, 
  Database, 
  Trophy, 
  SlidersHorizontal,
  Flame,
  RotateCw,
  Lock,
  Cpu
} from 'lucide-react';
import { SystemMode } from '../types';

interface HeaderProps {
  activeTab: 'rooms' | 'simulator' | 'blockchain' | 'leaderboard';
  setActiveTab: (tab: 'rooms' | 'simulator' | 'blockchain' | 'leaderboard') => void;
  systemMode: SystemMode;
  setSystemMode: (mode: SystemMode) => void;
  activeViolationsCount: number;
  totalKWhSaved: number;
  isChainValid: boolean;
  simulatedTime: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  systemMode,
  setSystemMode,
  activeViolationsCount,
  totalKWhSaved,
  isChainValid,
  simulatedTime,
}) => {
  const isZeroTrust = systemMode === 'zero_trust';

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top brand, mode selector, and live status bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3.5 gap-4 border-b border-slate-800/60">
          <div className="flex items-center space-x-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-lg transition-all text-slate-950 font-black ${
              isZeroTrust
                ? 'bg-gradient-to-tr from-purple-500 to-indigo-400 shadow-purple-500/20'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-emerald-500/20'
            }`}>
              {isZeroTrust ? <Lock className="h-5 w-5 stroke-[2.5]" /> : <Zap className="h-6 w-6 stroke-[2.5]" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  VoltLedger 
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${
                    isZeroTrust 
                      ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  }`}>
                    {isZeroTrust ? '🔄 Reversed: Zero-Trust Power Grid' : 'Standard Watchdog AI'}
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                {isZeroTrust 
                  ? 'Default-OFF Non-Essential Circuits • Just-In-Time Smart Contract Power Leases' 
                  : 'Timetable-Aware Energy Monitoring • Automated Circuit Cut-Off • Immutable Audit Ledger'}
              </p>
            </div>
          </div>

          {/* Quick telemetry indicators & Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-medium">
            {/* LOGIC REVERSAL TOGGLE SWITCH */}
            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => setSystemMode('watchdog')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  !isZeroTrust
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Traditional Logic: Default-ON, cut off when empty"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Watchdog Mode</span>
              </button>

              <button
                onClick={() => setSystemMode('zero_trust')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isZeroTrust
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-purple-400 hover:text-purple-300'
                }`}
                title="Reversed Logic Challenge: Default-OFF, unlock power just-in-time via blockchain"
              >
                <RotateCw className="w-3.5 h-3.5 text-purple-300" />
                <span className="flex items-center gap-1">
                  <span>Reversed Logic</span>
                  <span className="text-[10px] bg-purple-400/20 text-purple-200 px-1.5 py-0.2 rounded font-mono">Zero-Trust</span>
                </span>
              </button>
            </div>

            {/* Live simulated time */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Time:</span>
              <span className="font-mono text-sky-300 font-semibold">{simulatedTime}</span>
            </div>

            {/* Blockchain ledger health */}
            <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border ${
              isChainValid 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                : 'bg-rose-950/60 border-rose-500/60 text-rose-300 animate-pulse'
            }`}>
              <ShieldCheck className={`w-3.5 h-3.5 ${isChainValid ? 'text-emerald-400' : 'text-rose-400'}`} />
              <span className="font-semibold">{isChainValid ? 'Ledger OK' : 'TAMPER!'}</span>
            </div>

            {/* Total verified saved counter */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-300">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Saved:</span>
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
                ? isZeroTrust
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{isZeroTrust ? 'Zero-Trust Power Matrix' : 'Room Switch Matrix'}</span>
            {activeViolationsCount > 0 && !isZeroTrust && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
                {activeViolationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'simulator'
                ? isZeroTrust
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="flex items-center gap-1.5">
              <span>{isZeroTrust ? 'Power Lease Simulator' : 'Cut-Off Demo Simulator'}</span>
              <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-1.5 py-0.5 rounded font-mono">Judge Demo</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('blockchain')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'blockchain'
                ? isZeroTrust
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
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
                ? isZeroTrust
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
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
