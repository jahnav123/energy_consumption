import React from 'react';
import { 
  Trophy, 
  Medal, 
  Leaf, 
  Coins, 
  Gift, 
  Building, 
  CheckCircle2, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { DepartmentScore } from '../types';

interface LeaderboardProps {
  scores: DepartmentScore[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ scores }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 p-6 rounded-3xl border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
              <Trophy className="w-3.5 h-3.5" />
              Campus Sustainability League
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Hostel & Department Energy Leaderboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Every kilowatt-hour saved through automated circuit enforcement or student conservation is 
              tokenized into on-chain <strong>Green Tokens ($GREEN)</strong>. 
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Total Minted</span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">6,230 $GREEN</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">CO₂ Offset</span>
              <span className="text-xl font-extrabold text-teal-300 font-mono">1,022 kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table & Reward Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Column (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-5">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>Current Semester Standings</span>
            <span className="text-xs text-slate-400 font-normal">Updated Every Smart Contract Block</span>
          </h3>

          <div className="space-y-3">
            {scores.map(entry => {
              const isFirst = entry.rank === 1;
              const isSecond = entry.rank === 2;
              const isThird = entry.rank === 3;

              return (
                <div
                  key={entry.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    isFirst
                      ? 'bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border-amber-500/40 shadow-md'
                      : isSecond
                      ? 'bg-slate-900 border-slate-700/80'
                      : isThird
                      ? 'bg-slate-900 border-amber-900/30'
                      : 'bg-slate-950/60 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    {/* Rank icon / number */}
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs">
                      {isFirst ? (
                        <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
                          <Trophy className="w-4 h-4 fill-current" />
                        </div>
                      ) : isSecond ? (
                        <div className="w-8 h-8 rounded-xl bg-slate-300 text-slate-950 flex items-center justify-center">
                          <Medal className="w-4 h-4" />
                        </div>
                      ) : isThird ? (
                        <div className="w-8 h-8 rounded-xl bg-amber-700 text-amber-100 flex items-center justify-center">
                          <Medal className="w-4 h-4" />
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono text-sm">#{entry.rank}</span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-white tracking-tight">{entry.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300">
                          {entry.category}
                        </span>
                        <span>• Efficiency: <span className="text-emerald-400 font-semibold">{entry.efficiencyScore}%</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Savings & Green Tokens */}
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-emerald-400 font-mono font-bold text-sm">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>{entry.greenTokens.toLocaleString()} $GREEN</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {entry.savedKWh.toFixed(1)} kWh saved • {entry.co2PreventedKg.toFixed(1)} kg CO₂
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rewards Store Sidebar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-400" />
              Green Token Perks
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-semibold">Redeemable</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hostels and departments redeem verified on-chain tokens for tangible campus benefits.
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-white">Hostel Fest Energy Grant</span>
                <span className="text-xs font-mono font-bold text-emerald-400">1,500 $GREEN</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Direct $500 college sponsorship grant for hostel cultural festivities.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-white">Priority Lab Workstation Access</span>
                <span className="text-xs font-mono font-bold text-emerald-400">800 $GREEN</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Reserved 24/7 GPU cluster slots for departmental researchers.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-white">Campus Solar Café Vouchers</span>
                <span className="text-xs font-mono font-bold text-emerald-400">250 $GREEN</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Cafeteria credits distributed directly to compliant hostel residents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
