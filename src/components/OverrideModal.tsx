import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Clock, 
  Key, 
  QrCode, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { CampusRoom, OverrideInfo } from '../types';

interface OverrideModalProps {
  room: CampusRoom | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitOverride: (roomId: string, override: OverrideInfo) => void;
}

export const OverrideModal: React.FC<OverrideModalProps> = ({
  room,
  isOpen,
  onClose,
  onSubmitOverride,
}) => {
  if (!isOpen || !room) return null;

  const [authorizedBy, setAuthorizedBy] = useState('Prof. Elena Rostova');
  const [role, setRole] = useState('Faculty / Research Supervisor');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [reason, setReason] = useState('Overtime Robotic Calibration & Final Exam Prep');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const expiryDate = new Date(now.getTime() + durationMinutes * 60000);

    const formatTime = (d: Date) => {
      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;
    };

    const overrideInfo: OverrideInfo = {
      authorizedBy,
      role,
      requestedAt: formatTime(now),
      expiresAt: formatTime(expiryDate),
      durationMinutes,
      reason,
      txHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
    };

    onSubmitOverride(room.id, overrideInfo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Request Overtime Power Override
            </h3>
            <p className="text-xs text-slate-400">
              {room.name} ({room.building})
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 mb-5 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Overrides prevent automated circuit cut-offs. Every extension is cryptographically signed and logged onto the
            <strong> Campus Energy Blockchain Ledger</strong> for accountability.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Authorized Faculty / Requester Name
            </label>
            <input
              type="text"
              required
              value={authorizedBy}
              onChange={e => setAuthorizedBy(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Campus Role / Designation
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="Faculty / Research Supervisor">Faculty / Research Supervisor</option>
              <option value="Head of Department">Head of Department</option>
              <option value="Campus Facility Engineer">Campus Facility Engineer</option>
              <option value="Student Club President">Student Club President</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Extension Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[30, 60, 90].map(mins => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setDurationMinutes(mins)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    durationMinutes === mins
                      ? 'bg-sky-500/20 border-sky-500/50 text-sky-300 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  +{mins} Minutes
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Justification / Event Reason
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-sky-500/20 transition-all flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5" />
              Sign & Authorize on Ledger
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
