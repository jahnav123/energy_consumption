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
  QrCode,
  Flame,
  PowerOff,
  Lock,
  Unlock,
  KeyRound,
  RotateCw,
  Sparkles
} from 'lucide-react';
import { CampusRoom, SwitchType, SystemMode } from '../types';

interface RoomMatrixProps {
  rooms: CampusRoom[];
  systemMode: SystemMode;
  onToggleSwitch: (roomId: string, switchType: SwitchType) => void;
  onTripRelay: (roomId: string) => void;
  onRestoreRelay: (roomId: string) => void;
  onOpenOverrideModal: (room: CampusRoom) => void;
  onRequestPowerLease?: (roomId: string) => void;
}

export const RoomMatrix: React.FC<RoomMatrixProps> = ({
  rooms,
  systemMode,
  onToggleSwitch,
  onTripRelay,
  onRestoreRelay,
  onOpenOverrideModal,
  onRequestPowerLease,
}) => {
  const [filter, setFilter] = useState<'all' | 'violations' | 'lecture_hall' | 'lab' | 'hostel_block'>('all');
  const isZeroTrust = systemMode === 'zero_trust';

  const filteredRooms = rooms.filter(room => {
    if (filter === 'violations') return room.anomalyStatus === 'UNSCHEDULED_CONSUMPTION';
    if (filter === 'lecture_hall') return room.category === 'lecture_hall';
    if (filter === 'lab') return room.category === 'lab';
    if (filter === 'hostel_block') return room.category === 'hostel_block';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Zero-Trust Reversed Logic Educational Banner */}
      {isZeroTrust && (
        <div className="bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-slate-900 border border-purple-500/40 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
              <RotateCw className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-sm">
                  Reversed Logic Active: Zero-Trust Power Grid
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-mono">
                  Default-OFF
                </span>
              </div>
              <p className="text-xs text-purple-200/80 mt-1 leading-relaxed">
                Circuits are <strong>de-energized by default</strong>. Zero electricity is wasted while empty. 
                Power is strictly unlocked <em>Just-in-Time</em> via verified blockchain smart contract leases (`CampusPowerLease.sol`).
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[11px] text-purple-300/80 block uppercase tracking-wider font-semibold">Idle Waste</span>
            <span className="text-lg font-extrabold text-emerald-400 font-mono">0.00 kW (100% Eliminated)</span>
          </div>
        </div>
      )}

      {/* Filters and Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {isZeroTrust ? 'Zero-Trust Campus Room Grid' : 'Campus Room Matrix & Smart Relays'}
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              {filteredRooms.length} of {rooms.length} Units
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            {isZeroTrust
              ? 'Click "Unlock via Smart Contract Lease" on any de-energized room to authorize temporary power.'
              : 'Real-time synchronization between academic class schedules and circuit breakers.'}
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
          {!isZeroTrust && (
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
          )}
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
          const hasSchedule = !!room.currentSchedule;
          const hasOverride = room.anomalyStatus === 'OVERRIDE_ACTIVE';
          const hasLease = !!room.activeLease;
          const isViolation = !isZeroTrust && room.anomalyStatus === 'UNSCHEDULED_CONSUMPTION';
          const isDisconnected = !isZeroTrust && room.relayStatus === 'DISCONNECTED';
          
          // In zero-trust mode: room is de-energized if unscheduled and no override/lease
          const isZeroTrustLocked = isZeroTrust && !hasSchedule && !hasOverride && !hasLease;
          const isZeroTrustEnergized = isZeroTrust && (hasSchedule || hasOverride || hasLease);

          return (
            <div
              key={room.id}
              className={`rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                isZeroTrustLocked
                  ? 'bg-slate-950/70 border-slate-800/80 opacity-90'
                  : isZeroTrustEnergized
                  ? 'bg-gradient-to-b from-purple-950/20 to-slate-900 border-purple-500/40 shadow-lg shadow-purple-500/5'
                  : isViolation
                  ? 'bg-gradient-to-b from-amber-950/20 to-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/20'
                  : hasOverride
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
                    {isZeroTrust ? (
                      isZeroTrustLocked ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800/90 border border-slate-700 text-slate-400">
                          <Lock className="w-3 h-3 text-purple-400" />
                          Default-OFF Locked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 border border-purple-500/40 text-purple-300">
                          <Unlock className="w-3 h-3 text-purple-400" />
                          Lease Active
                        </span>
                      )
                    ) : (
                      isDisconnected ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 border border-rose-500/30 text-rose-400">
                          <PowerOff className="w-3 h-3" />
                          Power Cut
                        </span>
                      ) : isViolation ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 border border-amber-500/40 text-amber-300 animate-pulse">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          Unscheduled Draw
                        </span>
                      ) : hasOverride ? (
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
                      )
                    )}
                  </div>
                </div>

                {/* Timetable Schedule or Power Lease Info Banner */}
                <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  {isZeroTrust && isZeroTrustLocked ? (
                    <div className="text-slate-400 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-400 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-300">Zero-Trust Protected: </span>
                        <span>No active lecture booking. Circuit safely isolated.</span>
                      </div>
                    </div>
                  ) : isZeroTrust && room.activeLease ? (
                    <div className="text-purple-300 font-medium">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          Smart Contract Power Lease:
                        </span>
                        <span className="font-mono text-purple-400 font-bold">{room.activeLease.remainingMinutes} mins left</span>
                      </div>
                      <span className="block text-[11px] text-slate-400 font-mono">
                        LeaseID: {room.activeLease.leaseId} (Auth: {room.activeLease.grantedTo})
                      </span>
                    </div>
                  ) : room.currentSchedule ? (
                    <div>
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Timetable Slot:
                        </span>
                        <span className="font-mono text-slate-300">
                          {room.currentSchedule.startTime} - {room.currentSchedule.endTime}
                        </span>
                      </div>
                      <div className="text-slate-300">
                        <span className="font-semibold text-emerald-300">{room.currentSchedule.courseCode}: </span>
                        {room.currentSchedule.courseName}
                        <span className="block text-[11px] text-slate-400 mt-0.5">Instructor: {room.currentSchedule.instructor}</span>
                      </div>
                    </div>
                  ) : hasOverride && room.override ? (
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

                {/* Grace Period Countdown Banner (if violation in Watchdog mode) */}
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
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-amber-400 h-1.5 transition-all duration-500"
                        style={{ width: `${Math.min(100, (room.graceTimeRemainingSec / 60) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Disconnected Notification */}
                {isDisconnected && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <PowerOff className="w-4 h-4 text-rose-400" />
                      Circuit isolated to stop waste.
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">+{room.totalSavedKWh.toFixed(1)} kWh</span>
                  </div>
                )}

                {/* Switch Controls */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
                    <span>{isZeroTrust && isZeroTrustLocked ? 'Switches (De-Energized):' : 'Monitored Smart Switches:'}</span>
                    <span className="text-[11px] text-slate-400">
                      {isZeroTrust && isZeroTrustLocked ? '🔒 Circuit locked' : 'Click to toggle'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* HVAC Switch */}
                    <button
                      onClick={() => onToggleSwitch(room.id, 'hvac')}
                      disabled={isDisconnected || (isZeroTrust && isZeroTrustLocked)}
                      className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                        isDisconnected || (isZeroTrust && isZeroTrustLocked)
                          ? 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                          : room.switches.hvac
                          ? 'bg-sky-500/15 border-sky-500/40 text-sky-300 shadow-sm'
                          : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <AirVent className="w-3.5 h-3.5" />
                        <span>HVAC / AC</span>
                      </span>
                      <span className={`h-2 w-2 rounded-full ${room.switches.hvac && !isDisconnected && !(isZeroTrust && isZeroTrustLocked) ? 'bg-sky-400 animate-pulse' : 'bg-slate-600'}`}></span>
                    </button>

                    {/* Lighting Switch */}
                    <button
                      onClick={() => onToggleSwitch(room.id, 'lights')}
                      disabled={isDisconnected || (isZeroTrust && isZeroTrustLocked)}
                      className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                        isDisconnected || (isZeroTrust && isZeroTrustLocked)
                          ? 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                          : room.switches.lights
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm'
                          : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Lighting</span>
                      </span>
                      <span className={`h-2 w-2 rounded-full ${room.switches.lights && !isDisconnected && !(isZeroTrust && isZeroTrustLocked) ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`}></span>
                    </button>

                    {/* Projector Switch */}
                    <button
                      onClick={() => onToggleSwitch(room.id, 'projector')}
                      disabled={isDisconnected || (isZeroTrust && isZeroTrustLocked)}
                      className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                        isDisconnected || (isZeroTrust && isZeroTrustLocked)
                          ? 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                          : room.switches.projector
                          ? 'bg-purple-500/15 border-purple-500/40 text-purple-300 shadow-sm'
                          : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Projector className="w-3.5 h-3.5" />
                        <span>Projector</span>
                      </span>
                      <span className={`h-2 w-2 rounded-full ${room.switches.projector && !isDisconnected && !(isZeroTrust && isZeroTrustLocked) ? 'bg-purple-400' : 'bg-slate-600'}`}></span>
                    </button>

                    {/* Workstations Switch */}
                    <button
                      onClick={() => onToggleSwitch(room.id, 'workstations')}
                      disabled={isDisconnected || (isZeroTrust && isZeroTrustLocked)}
                      className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                        isDisconnected || (isZeroTrust && isZeroTrustLocked)
                          ? 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                          : room.switches.workstations
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm'
                          : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Workstations</span>
                      </span>
                      <span className={`h-2 w-2 rounded-full ${room.switches.workstations && !isDisconnected && !(isZeroTrust && isZeroTrustLocked) ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                    </button>
                  </div>
                </div>

                {/* Power draw summary */}
                <div className="mt-3 flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-400">Current Load Draw:</span>
                  <div className="flex items-baseline space-x-1">
                    <span className={`font-mono font-bold text-sm ${
                      isZeroTrustLocked
                        ? 'text-slate-500'
                        : isViolation
                        ? 'text-amber-400'
                        : isDisconnected
                        ? 'text-slate-400'
                        : 'text-emerald-400'
                    }`}>
                      {isZeroTrustLocked ? '0.00' : room.currentLoadKW.toFixed(2)}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">kW</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between gap-2">
                {isZeroTrust ? (
                  isZeroTrustLocked ? (
                    <button
                      onClick={() => onRequestPowerLease && onRequestPowerLease(room.id)}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20 transition-all active:scale-95"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Unlock via Smart Contract Lease</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onTripRelay(room.id)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
                    >
                      <Lock className="w-3.5 h-3.5 text-purple-400" />
                      <span>Revoke Lease & De-Energize</span>
                    </button>
                  )
                ) : (
                  isDisconnected ? (
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
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
