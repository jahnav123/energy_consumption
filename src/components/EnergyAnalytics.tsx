import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Sun, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { HOURLY_CONSUMPTION_DATA } from '../data/mockCampusData';
import { BuildingStats } from '../types';

interface EnergyAnalyticsProps {
  buildings: BuildingStats[];
}

export const EnergyAnalytics: React.FC<EnergyAnalyticsProps> = ({ buildings }) => {
  const maxKw = 110;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* 24-Hour Campus Telemetry Chart (2 cols) */}
      <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                24-Hour Campus Load & Solar Generation Profile
              </h3>
              <p className="text-xs text-slate-400">
                Hourly telemetry stream with automatic solar offset and avoided wastage.
              </p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                <span>Grid Load (kW)</span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                <span>Solar Offset</span>
              </span>
              <span className="flex items-center gap-1.5 text-sky-300">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400"></span>
                <span>Avoided Waste</span>
              </span>
            </div>
          </div>

          {/* SVG Custom Responsive Bar/Area Chart */}
          <div className="h-60 w-full mt-6 flex items-end gap-2 sm:gap-4 pt-6 pb-2 border-b border-slate-800">
            {HOURLY_CONSUMPTION_DATA.map((item, idx) => {
              const gridHeightPct = (item.grid / maxKw) * 100;
              const solarHeightPct = (item.solar / maxKw) * 100;
              const isPeakHour = item.hour === '11:00';

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 border border-slate-700 text-slate-200 text-[10px] p-2 rounded-xl shadow-xl z-20 pointer-events-none whitespace-nowrap">
                    <div className="font-bold text-white mb-0.5">{item.hour}</div>
                    <div className="text-emerald-400">Grid: {item.grid} kW</div>
                    <div className="text-amber-400">Solar: {item.solar} kW</div>
                    <div className="text-sky-400 font-bold">Cut-Off Saved: +{item.saved} kWh</div>
                  </div>

                  {/* Dual stacked visual bars */}
                  <div className="w-full max-w-[28px] flex flex-col justify-end items-center h-full">
                    {/* Solar Bar */}
                    {item.solar > 0 && (
                      <div
                        className="w-full bg-amber-400/90 rounded-t-sm transition-all"
                        style={{ height: `${solarHeightPct}%` }}
                      ></div>
                    )}
                    {/* Grid Bar */}
                    <div
                      className={`w-full transition-all ${
                        isPeakHour
                          ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 ring-2 ring-emerald-400/50 rounded-t-sm'
                          : 'bg-emerald-500/70 hover:bg-emerald-500'
                      }`}
                      style={{ height: `${gridHeightPct}%` }}
                    ></div>
                  </div>

                  {/* Hour label */}
                  <span className={`text-[10px] font-mono mt-2 ${isPeakHour ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                    {item.hour.substring(0, 2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Chart Footer Notes */}
        <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-amber-400 font-medium">
            <Sun className="w-3.5 h-3.5" />
            Peak Solar Window Active (38 kW Generation)
          </span>
          <span className="font-mono text-emerald-400 font-semibold">
            Today's Efficiency Ratio: 94.2%
          </span>
        </div>
      </div>

      {/* Building-by-Building Distribution (1 col) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              Building Telemetry
            </h3>
            <span className="text-xs text-slate-400 font-mono">4 Sectors</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Sub-metered zone distribution across primary campus facilities.
          </p>

          <div className="space-y-3.5">
            {buildings.map(b => {
              const maxBuildingKw = 45;
              const pct = Math.min(100, (b.currentKW / maxBuildingKw) * 100);

              return (
                <div key={b.id} className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-white">{b.name}</span>
                    <span className="font-mono font-bold text-emerald-400">{b.currentKW.toFixed(1)} kW</span>
                  </div>

                  {/* Power bar */}
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5 font-mono">
                    <span>{b.roomsMonitored} Rooms</span>
                    <span className="text-teal-400">{b.co2SavedKg.toFixed(0)} kg CO₂ Saved</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Consortium Sub-Meters:</span>
          <span className="text-emerald-400 font-mono font-bold">96 Smart Breakers Active</span>
        </div>
      </div>
    </div>
  );
};
