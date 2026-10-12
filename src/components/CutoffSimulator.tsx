import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Database, 
  Cpu, 
  PowerOff, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { BlockchainBlock } from '../types';

interface CutoffSimulatorProps {
  onSimulateCutoff: (scenario: {
    roomId: string;
    roomName: string;
    buildingName: string;
    savedKWh: number;
    initialKW: number;
    cutKW: number;
  }) => Promise<BlockchainBlock>;
}

export const CutoffSimulator: React.FC<CutoffSimulatorProps> = ({ onSimulateCutoff }) => {
  const [selectedScenario, setSelectedScenario] = useState<'lecture_hall' | 'hostel_lounge' | 'computer_lab'>('lecture_hall');
  const [simStep, setSimStep] = useState<number>(0); // 0: Idle, 1: Schedule ended, 2: Anomaly detected, 3: Grace countdown, 4: Relay cut, 5: Block created
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);
  const [generatedBlock, setGeneratedBlock] = useState<BlockchainBlock | null>(null);

  const scenarios = {
    lecture_hall: {
      roomId: 'lh-101',
      roomName: 'Lecture Hall 101',
      buildingName: 'Engineering Block A',
      initialKW: 4.85,
      cutKW: 0.15,
      savedKWh: 4.70 * 2, // 2 hours till next slot
      description: 'CS201 finishes at 11:00 AM. 120 students exit, but dual split AC units and 4K laser projector are left running.',
    },
    hostel_lounge: {
      roomId: 'hostel-c-cr',
      roomName: 'Hostel C Common Lounge',
      buildingName: 'Diamond Jubilee Residence',
      initialKW: 3.40,
      cutKW: 0.20,
      savedKWh: 3.20 * 4, // 4 hours idle afternoon
      description: 'Hostel common room empty during afternoon classes. AC and TV running on empty sofa seating.',
    },
    computer_lab: {
      roomId: 'lab-302',
      roomName: 'Computing Lab 3',
      buildingName: 'Computing Sciences Wing',
      initialKW: 6.20,
      cutKW: 0.40,
      savedKWh: 5.80 * 3, // 3 hours night load
      description: 'Practical lab wraps up at 5:00 PM. 35 desktop monitors and central AC left running overnight.',
    },
  };

  const activeScenario = scenarios[selectedScenario];

  const handleStartSimulation = async () => {
    setIsRunning(true);
    setSimStep(1);
    setGeneratedBlock(null);
    setCountdown(5);

    // Step 1: Timetable slot expires (1.5s)
    await new Promise(r => setTimeout(r, 1400));
    setSimStep(2);

    // Step 2: Telemetry engine detects high unscheduled draw (1.5s)
    await new Promise(r => setTimeout(r, 1500));
    setSimStep(3);

    // Step 3: Fast grace period countdown (3s)
    for (let i = 4; i >= 0; i--) {
      await new Promise(r => setTimeout(r, 800));
      setCountdown(i);
    }

    // Step 4: Relay actuation trips non-essential circuit (1.2s)
    setSimStep(4);
    await new Promise(r => setTimeout(r, 1200));

    // Step 5: Blockchain cryptographic verification & block creation
    setSimStep(5);
    const block = await onSimulateCutoff(activeScenario);
    setGeneratedBlock(block);
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSimStep(0);
    setCountdown(5);
    setGeneratedBlock(null);
  };

  return (
    <div className="space-y-6">
      {/* Introduction banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-3xl border border-indigo-500/30 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Hackathon Live Evaluation Simulator
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Automated Circuit Cut-Off & Cryptographic Proof Pipeline
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Experience how the system autonomously correlates academic class timetables with IoT smart switches, 
            trips non-essential power breakers during empty slots, and seals the verified saved energy onto the blockchain ledger.
          </p>
        </div>

        {/* Scenario Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {(Object.keys(scenarios) as Array<keyof typeof scenarios>).map(key => {
            const sc = scenarios[key];
            const isSelected = selectedScenario === key;

            return (
              <button
                key={key}
                disabled={isRunning}
                onClick={() => {
                  setSelectedScenario(key);
                  handleReset();
                }}
                className={`text-left p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-slate-800/90 border-indigo-500/60 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-400'
                } ${isRunning ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`}>
                    {sc.roomName}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {sc.initialKW} kW Load
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 mb-2">{sc.description}</p>
                <div className="text-[11px] text-emerald-400 font-mono font-medium">
                  Est. Savings: {sc.savedKWh.toFixed(1)} kWh (~${(sc.savedKWh * 0.16).toFixed(2)})
                </div>
              </button>
            );
          })}
        </div>

        {/* Simulation Controls */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-slate-800">
          <button
            onClick={handleStartSimulation}
            disabled={isRunning || simStep === 5}
            className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all ${
              isRunning || simStep === 5
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-emerald-500/20 active:scale-95'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isRunning ? 'Executing Automated Flow...' : 'Run Live Cut-Off Simulation'}</span>
          </button>

          <button
            onClick={handleReset}
            disabled={isRunning}
            className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold flex items-center gap-2 border border-slate-700 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo</span>
          </button>

          <span className="text-xs text-slate-400 ml-auto hidden sm:inline">
            Status: <span className="font-mono text-indigo-300">{isRunning ? 'Simulation In Progress' : simStep === 5 ? 'Completed' : 'Ready'}</span>
          </span>
        </div>
      </div>

      {/* Interactive Step-by-Step Pipeline */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          Autonomous Execution Pipeline (5 Stages)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {/* Stage 1 */}
          <div className={`p-4 rounded-2xl border transition-all ${
            simStep >= 1 ? 'bg-slate-800/90 border-emerald-500/40 text-white' : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-emerald-400">01. TIMETABLE</span>
              {simStep > 1 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : simStep === 1 ? (
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              ) : null}
            </div>
            <div className="font-semibold text-xs text-white">Schedule Expires</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Class session finishes. Room status updates to UNSCHEDULED.
            </p>
          </div>

          {/* Stage 2 */}
          <div className={`p-4 rounded-2xl border transition-all ${
            simStep >= 2 ? 'bg-slate-800/90 border-amber-500/40 text-white' : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-amber-400">02. ANOMALY</span>
              {simStep > 2 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : simStep === 2 ? (
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
              ) : null}
            </div>
            <div className="font-semibold text-xs text-white">Power Draw Check</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Smart meter detects {activeScenario.initialKW} kW active draw despite room being empty.
            </p>
          </div>

          {/* Stage 3 */}
          <div className={`p-4 rounded-2xl border transition-all ${
            simStep >= 3 ? 'bg-slate-800/90 border-amber-500/50 text-white' : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-amber-300">03. GRACE PERIOD</span>
              {simStep > 3 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : simStep === 3 ? (
                <span className="font-mono text-xs font-bold text-amber-400">{countdown}s</span>
              ) : null}
            </div>
            <div className="font-semibold text-xs text-white">Safety Warning</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Visual alert pushed. 5s countdown initiated for faculty override.
            </p>
          </div>

          {/* Stage 4 */}
          <div className={`p-4 rounded-2xl border transition-all ${
            simStep >= 4 ? 'bg-slate-800/90 border-rose-500/40 text-white' : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-rose-400">04. ACTUATION</span>
              {simStep > 4 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : simStep === 4 ? (
                <span className="h-2 w-2 rounded-full bg-rose-400 animate-ping"></span>
              ) : null}
            </div>
            <div className="font-semibold text-xs text-white">Relay Cut-Off</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Smart relay trips non-essential circuits. Draw drops to {activeScenario.cutKW} kW.
            </p>
          </div>

          {/* Stage 5 */}
          <div className={`p-4 rounded-2xl border transition-all ${
            simStep >= 5 ? 'bg-slate-800/90 border-indigo-500/50 text-white' : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-indigo-400">05. BLOCKCHAIN</span>
              {simStep === 5 ? (
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
              ) : null}
            </div>
            <div className="font-semibold text-xs text-white">Immutable Ledger</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Calculates saved kWh, hashes record, and commits proof on-chain.
            </p>
          </div>
        </div>

        {/* Live Transaction Receipt & Proof when simulation finishes */}
        {generatedBlock && (
          <div className="mt-6 p-5 rounded-2xl bg-slate-950/90 border border-emerald-500/40 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm text-white">
                  Blockchain Transaction Confirmed (Block #{generatedBlock.blockNumber})
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg">
                Consensus: Proof of Authority
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs font-mono">
              <div className="space-y-2">
                <div>
                  <span className="text-slate-400 block text-[11px]">Transaction Hash (TxHash):</span>
                  <span className="text-indigo-300 break-all select-all font-semibold">{generatedBlock.txHash}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Cryptographic SHA-256 Proof:</span>
                  <span className="text-emerald-300 break-all select-all font-semibold">{generatedBlock.dataHash}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Smart Contract Signer:</span>
                  <span className="text-slate-300">{generatedBlock.signer}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1.5 font-sans">
                <div className="text-xs font-bold text-white mb-2 flex items-center justify-between">
                  <span>Verified Conservation Metrics:</span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    +{(activeScenario.savedKWh * 5).toFixed(0)} Green Tokens Minted
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Room Target:</span>
                  <span className="font-semibold text-white">{activeScenario.roomName}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Power Drop:</span>
                  <span className="font-mono text-rose-400">{activeScenario.initialKW} kW ➔ {activeScenario.cutKW} kW</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Avoided Wastage:</span>
                  <span className="font-mono text-emerald-400 font-bold">{activeScenario.savedKWh.toFixed(1)} kWh</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Carbon Emissions Prevented:</span>
                  <span className="font-mono text-teal-300">{(activeScenario.savedKWh * 0.82).toFixed(1)} kg CO₂</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
