import React from 'react';
import { 
  Zap, 
  Sun, 
  DollarSign, 
  Leaf, 
  ShieldAlert, 
  PowerOff,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { CampusRoom, BuildingStats } from '../types';

interface OverviewMetricsProps {
  rooms: CampusRoom[];
  buildings: BuildingStats[];
  totalSavedKWh: number;
}

export const OverviewMetrics: React.FC<OverviewMetricsProps> = ({
  rooms,
  buildings,
  totalSavedKWh,
}) => {
  // Aggregate stats
  const totalActiveKW = rooms.reduce((acc, r) => acc + r.currentLoadKW, 0) + 72.4; // plus base facility
  const totalSolarKW = buildings.reduce((acc, b) => acc + b.solarKW, 0);
  const activeViolations = rooms.filter(r => r.anomalyStatus === 'UNSCHEDULED_CONSUMPTION').length;
  const disconnectedRelays = rooms.filter(r => r.relayStatus === 'DISCONNECTED').length;

  // Financial & Carbon calculations
  // Average commercial tariff ~ $0.16/kWh, grid carbon emission factor ~ 0.82 kg CO2 / kWh
  const costSavedDollars = (totalSavedKWh * 0.16).toFixed(2);
  const co2AvoidedKg = (totalSavedKWh * 0.82).toFixed(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Real-time Campus Power Draw */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Campus Power Draw</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white tracking-tight font-mono">{totalActiveKW.toFixed(1)}</span>
          <span className="text-sm font-semibold text-slate-400">kW</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
          <span className="flex items-center gap-1 text-emerald-400">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium">{totalSolarKW.toFixed(1)} kW Solar Offset</span>
          </span>
          <span className="font-mono text-slate-400">Grid: {(totalActiveKW - totalSolarKW).toFixed(1)} kW</span>
        </div>
      </div>

      {/* 2. Automated Waste Avoided */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avoided Energy Waste</span>
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <PowerOff className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white tracking-tight font-mono">{totalSavedKWh.toFixed(1)}</span>
          <span className="text-sm font-semibold text-slate-400">kWh</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
          <span className="flex items-center gap-1 text-sky-400 font-medium">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            ${costSavedDollars} Saved
          </span>
          <span className="text-slate-400 font-mono">Via Auto Cut-Off</span>
        </div>
      </div>

      {/* 3. Verified CO2 Offset */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Carbon Prevented</span>
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Leaf className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-teal-300 tracking-tight font-mono">{co2AvoidedKg}</span>
          <span className="text-sm font-semibold text-slate-400">kg CO₂</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
          <span className="text-slate-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            Blockchain Anchored
          </span>
          <span className="text-emerald-400 font-medium">ESG Audited</span>
        </div>
      </div>

      {/* 4. Active Smart Relay Status */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Circuit Protection</span>
          <div className={`p-2 rounded-xl border ${
            activeViolations > 0 
              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' 
              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
          }`}>
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white tracking-tight font-mono">{rooms.length}</span>
          <span className="text-sm font-semibold text-slate-400">Rooms Monitored</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
          <span className={`${activeViolations > 0 ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}>
            {activeViolations > 0 ? `${activeViolations} Active Violations` : 'All Rooms Compliant'}
          </span>
          <span className="text-sky-400 font-medium">{disconnectedRelays} Tripped Off</span>
        </div>
      </div>
    </div>
  );
};
