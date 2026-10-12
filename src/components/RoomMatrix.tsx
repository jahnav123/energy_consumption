import React, { useState } from 'react';
import { 
  AirVent, 
  Lightbulb, 
  Projector, 
  Monitor, 
  Power, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  QrCode,
  Flame,
  PowerOff
} from 'lucide-react';
import { CampusRoom, SwitchType } from '../types';

interface RoomMatrixProps {
  rooms: CampusRoom[];
  onToggleSwitch: (roomId: string, switchType: SwitchType) => void;
  onTripRelay: (roomId: string) => void;
  onRestoreRelay: (roomId: string) => void;
  onOpenOverrideModal: (room: CampusRoom) => void;
}

export const RoomMatrix: React.FC<RoomMatrixProps> = ({
  rooms,
  onToggleSwitch,
  onTripRelay,
  onRestoreRelay,
  onOpenOverrideModal,
}) => {
  const [filter, setFilter] = useState<'all' | 'violations' | 'lecture_hall' | 'lab' | 'hostel_block'>('all');

  const filteredRooms = rooms.filter(room => {
    if (filter === 'violations') return room.anomalyStatus === 'UNSCHEDULED_CONSUMPTION';
    if (filter === 'lecture_hall') return room.category === 'lecture_hall';
    if (filter === 'lab') return room.category === 'lab';
    if (filter === 'hostel_block') return room.category === 'hostel_block';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filters and Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Campus Room Matrix & Smart Relays
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              {filteredRooms.length} of {rooms.length} Units
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time synchronization between academic class schedules and circuit breakers.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            All Rooms
          </button>
          <button
            onClick={() => setFilter('violations')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              filter === 'violations'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-amber-400/80 hover:text-amber-300 hover:bg-slate-800'
            }`}
          >
            <Flame className="w-3 h-3 text-amber-400" />
            Violations Only
          </button>
          <button
            onClick={() => setFilter('lecture_hall')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === 'lecture_hall'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Lecture Halls
          </button>
          <button
            onClick={() => setFilter('lab')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === 'lab'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Labs
          </button>
          <button
            onClick={() => setFilter('hostel_block')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === 'hostel_block'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Hostels
          </button>
        </div>
      </div>

      {/* Grid of Room Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRooms.map(room => {
          const isViolation = room.anomalyStatus === 'UNSCHEDULED_CONSUMPTION';
          const isOverride = room.anomalyStatus === 'OVERRIDE_ACTIVE';
          const isDisconnected = room.relayStatus === 'DISCONNECTED';

          return (
            <div
              key={room.id}
              className={`rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                isViolation
                  ? 'bg-gradient-to-b from-amber-950/20 to-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/20'
                  : isOverride
                  ? 'bg-gradient-to-b from-sky-950/20 to-slate-900 border-sky-500/40'
                  : isDisconnected
                  ? 'bg-slate-900/60 border-rose-900/40 opacity-80'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-white text-base tracking-tight">{room.name}</h3>
                    <p className="text-xs text-slate-400">
                      {room.building} • {room.floor}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isDisconnected ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 border border-rose-500/30 text-rose-400">
                        <PowerOff className="w-3 h-3" />
                        Power Cut
                      </span>
                    ) : isViolation ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 border border-amber-500/40 text-amber-300 animate-pulse">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        Unscheduled Draw
                      </span>
                    ) : isOverride ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/15 border border-sky-500/30 text-sky-300">
                        <ShieldCheck className="w-3 h-3 text-sky-400" />
                        Override Active
                      </span>
                    ) : room.currentSchedule ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        Class in Session
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                        Empty / Standby
                      </span>
                    )}
                  </div>
                </div>

                {/* Timetable Schedule Info Banner */}
                <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Timetable Slot:
                    </span>
                    <span className="font-mono text-slate-300">
                      {room.currentSchedule ? `${room.currentSchedule.startTime} - ${room.currentSchedule.endTime}` : 'No Class Booked'}
                    </span>
                  </div>
                  {room.currentSchedule ? (
                    <div className="text-slate-300">
                      <span className="font-semibold text-emerald-300">{room.currentSchedule.courseCode}: </span>
                      {room.currentSchedule.courseName}
                      <span className="block text-[11px] text-slate-400 mt-0.5">Instructor: {room.currentSchedule.instructor}</span>
                    </div>
                  ) : isOverride && room.override ? (
                    <div className="text-sky-300 font-medium">
                      <span>Auth: {room.override.authorizedBy} ({room.override.role})</span>
                      <span className="block text-[11px] text-slate-400 mt-0.5">Reason: {room.override.reason} (Till {room.override.expiresAt})</span>
                    </div>
                  ) : (
                    <div className="text-slate-400 italic">
                      Scheduled Empty. Power should remain below baseline ({room.baselineIdleKW} kW).
                    </div>
                  )}
                </div>

                {/* Grace Period Countdown Banner (if violation) */}
                {isViolation && !isDisconnected && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-amber-300 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        Auto Cut-Off Grace Period:
                      </span>
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        {room.graceTimeRemainingSec}s
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-amber-400 h-1.5 transition-all duration-500"
                        style={{ width: `${Math.min(100, (room.graceTimeRemainingSec / 60) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-amber-200/80 mt-1.5">
                      Power drawing {room.currentLoadKW.toFixed(2)} kW without schedule. Relay will disconnect non-essential loads.
                    </p>
                  </div>
                )}

                {/* Disconnected Notification */}
                {isDisconnected && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <PowerOff className="w-4 h-4 text-rose-400" />
                      Circuit automatically isolated to stop waste.
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">+{room.totalSavedKWh.toFixed(1)} kWh saved</span>
                  </div>
                )}

                {/* Switch Controls (Interactive switches in room) */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
                    <span>Monitored Smart Switches:</span>
                    <span className="text-[11px] text-slate-400">Click to toggle</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* HVAC Switch */}
                    <button
                      onClick={() => onToggleSwitch(room.id, 'hvac')}
                      disabled={isDisconnected}
                      className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                        isDisconnected
                          ? 'bg-slate-900 border-slate-800 text-slate-400 cursor-not-allowed opacity-50'
                          : room.switches.hvac
                          ? 'bg-sky-500/15 border-sky-500/40 text-sky-300 shadow-sm'
                          : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <AirVent className="w-3.5 h-3.5" />
                        <span>HVAC / AC</span>
                      </span>
                      <span className={`h-2 w-2 rounded-full ${room.switches.hvac && !isDisconnected ? 'bg-sky-400 animate-pulse' : 'bg-slate-600'}`}></span>
                    </button>

                    {/* Lighting Switch */}
                    <button
                      onClick={() => onToggleSwitch(room.id, 'lights')}
                      disabled={isDisconnected}
                      className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                        isDisconnected
                          ? 'bg-slate-900 border-slate-800 text-slate-400 cursor-not-allowed opacity-50'
                          : room.switches.lights
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm'
                          : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Lighting</span>
                      </span>
                      <span className={`h-2 w-2 rounded-full ${room.switches.lights && !isDisconnected ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`}></span>
                    </button>

                    {/* Projector Switch */}
                    <button
                      onClick={() => onToggleSwitch(room.id, 'projector')}
                      disabled={isDisconnected}
                      className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                        isDisconnected
                          ? 'bg-slate-900 border-slate-800 text-slate-400 cursor-not-allowed opacity-50'
                          : room.switches.projector
                          ? 'bg-purple-500/15 border-purple-500/40 text-purple-300 shadow-sm'
                          : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Projector className="w-3.5 h-3.5" />
                        <span>Projector</span>
                      </span>
                      <span className={`h-2 w-2 rounded-full ${room.switches.projector && !isDisconnected ? 'bg-purple-400' : 'bg-slate-600'}`}></span>
                    </button>

                    {/* Workstations / PC Switch */}
                    <button
                      onClick={() => onToggleSwitch(room.id, 'workstations')}
                      disabled={isDisconnected}
                      className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                        isDisconnected
                          ? 'bg-slate-900 border-slate-800 text-slate-400 cursor-not-allowed opacity-50'
                          : room.switches.workstations
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm'
                          : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Workstations</span>
                      </span>
                      <span className={`h-2 w-2 rounded-full ${room.switches.workstations && !isDisconnected ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                    </button>
                  </div>
                </div>

                {/* Power draw summary */}
                <div className="mt-3 flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-400">Current Load Draw:</span>
                  <div className="flex items-baseline space-x-1">
                    <span className={`font-mono font-bold text-sm ${isViolation ? 'text-amber-400' : isDisconnected ? 'text-slate-400' : 'text-emerald-400'}`}>
                      {room.currentLoadKW.toFixed(2)}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">kW</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between gap-2">
                {isDisconnected ? (
                  <button
                    onClick={() => onRestoreRelay(room.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md transition-all"
                  >
                    <Power className="w-3.5 h-3.5" />
                    Restore Power Relay
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onTripRelay(room.id)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        isViolation
                          ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                    >
                      <PowerOff className="w-3.5 h-3.5" />
                      Trip Relay Now
                    </button>

                    <button
                      onClick={() => onOpenOverrideModal(room)}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-all"
                      title="Request Authorized Overtime Extension"
                    >
                      <QrCode className="w-3.5 h-3.5 text-sky-400" />
                      <span>Override</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
