import React, { useState } from 'react';
import { 
  Database, 
  ShieldCheck, 
  ShieldAlert, 
  Code, 
  Search, 
  RefreshCw, 
  AlertOctagon, 
  CheckCircle2, 
  FileCheck2, 
  ExternalLink,
  Lock,
  ChevronDown,
  ChevronRight,
  Flame,
  Zap
} from 'lucide-react';
import { BlockchainBlock } from '../types';
import { SOLIDITY_CONTRACT_CODE, VerificationResult } from '../services/blockchain';

interface BlockchainExplorerProps {
  blocks: BlockchainBlock[];
  verificationResult: VerificationResult;
  onTamperBlock: (blockNumber: number) => void;
  onRestoreBlock: (blockNumber: number) => void;
  onReverifyChain: () => void;
}

export const BlockchainExplorer: React.FC<BlockchainExplorerProps> = ({
  blocks,
  verificationResult,
  onTamperBlock,
  onRestoreBlock,
  onReverifyChain,
}) => {
  const [selectedTab, setSelectedTab] = useState<'blocks' | 'contract'>('blocks');
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredBlocks = blocks.filter(b => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.blockNumber.toString().includes(q) ||
      b.eventType.toLowerCase().includes(q) ||
      b.txHash.toLowerCase().includes(q) ||
      (b.roomId && b.roomId.toLowerCase().includes(q)) ||
      (b.buildingName && b.buildingName.toLowerCase().includes(q))
    );
  });

  const targetTamperBlock = blocks.find(b => b.blockNumber > 0) || blocks[0];

  return (
    <div className="space-y-6">
      {/* Top Banner: Ledger Status & Tamper Simulation Tool */}
      <div className={`p-6 rounded-3xl border transition-all ${
        verificationResult.isValid
          ? 'bg-slate-900/90 border-slate-800'
          : 'bg-gradient-to-r from-rose-950/60 via-slate-900 to-rose-950/60 border-rose-500/80 shadow-2xl shadow-rose-500/10'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className={`p-2 rounded-xl border ${
                verificationResult.isValid
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse'
              }`}>
                {verificationResult.isValid ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
              </span>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  Campus Energy Smart Contract Ledger
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    EVM PoA Testnet
                  </span>
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Contract: 0x98A...E47C • Total Blocks: {blocks.length} • Consensus: PoA Consortium
                </p>
              </div>
            </div>

            {/* Cryptographic Verification Status Banner */}
            <div className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${
              verificationResult.isValid
                ? 'bg-emerald-950/30 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-900/40 border border-rose-500/60 text-rose-200 animate-pulse'
            }`}>
              {verificationResult.isValid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-semibold text-sm">
                  {verificationResult.isValid ? 'Cryptographic Integrity Verified' : 'CRITICAL INTEGRITY BREACH DETECTED!'}
                </div>
                <div className="mt-0.5 leading-relaxed">
                  {verificationResult.message}
                </div>
              </div>
            </div>
          </div>

          {/* Tamper Test Action Box (Judge Demonstration) */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 lg:max-w-md w-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                Hackathon Judge Tamper Proof
              </span>
              <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">
                Live Test
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Test what happens when a rogue database administrator secretly alters an energy record in the centralized database.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {verificationResult.isValid ? (
                <button
                  onClick={() => onTamperBlock(targetTamperBlock.blockNumber)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Simulate Database Tampering</span>
                </button>
              ) : (
                <button
                  onClick={() => onRestoreBlock(verificationResult.corruptedBlockNumber ?? targetTamperBlock.blockNumber)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restore from Immutable Ledger</span>
                </button>
              )}

              <button
                onClick={onReverifyChain}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-all"
                title="Recalculate SHA-256 Chain"
              >
                Re-verify
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Switcher: Blocks vs Solidity Contract */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedTab('blocks')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              selectedTab === 'blocks'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Block Explorer ({filteredBlocks.length})</span>
          </button>
          <button
            onClick={() => setSelectedTab('contract')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              selectedTab === 'contract'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            <span>Solidity Smart Contract (`EnergyLedger.sol`)</span>
          </button>
        </div>

        {selectedTab === 'blocks' && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Tx, Block, or Room..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 w-52 sm:w-64"
            />
          </div>
        )}
      </div>

      {/* TAB 1: BLOCK EXPLORER */}
      {selectedTab === 'blocks' && (
        <div className="space-y-3">
          {filteredBlocks.map(block => {
            const isCorrupted = block.isTampered;
            const isExpanded = expandedBlock === block.blockNumber;

            return (
              <div
                key={block.blockNumber}
                className={`rounded-2xl border transition-all ${
                  isCorrupted
                    ? 'bg-rose-950/30 border-rose-500/70 shadow-lg shadow-rose-500/5'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Block Row Summary */}
                <div
                  onClick={() => setExpandedBlock(isExpanded ? null : block.blockNumber)}
                  className="p-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-sm text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                      #{block.blockNumber}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-white">{block.eventType}</span>
                        {block.buildingName && (
                          <span className="text-xs text-slate-400 font-sans">• {block.buildingName}</span>
                        )}
                        {isCorrupted && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold animate-pulse">
                            CORRUPTED DATA
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        {block.timestamp}
                      </div>
                    </div>
                  </div>

                  {/* Hashes & Tx info */}
                  <div className="flex items-center justify-between md:justify-end gap-4 text-xs font-mono">
                    <div className="text-right hidden sm:block">
                      <span className="text-slate-400 block text-[11px]">TxHash:</span>
                      <span className="text-slate-300 font-semibold">{block.txHash.substring(0, 14)}...</span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 block text-[11px]">SHA-256 Proof:</span>
                      <span className={`${isCorrupted ? 'text-rose-400 line-through' : 'text-emerald-400'} font-semibold`}>
                        {block.dataHash.substring(0, 12)}...
                      </span>
                    </div>

                    <button className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Block Inspector Details */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 bg-slate-950/80 border-t border-slate-800/80 rounded-b-2xl space-y-4 text-xs font-mono">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Full Transaction Hash:</span>
                          <span className="text-indigo-300 break-all select-all font-semibold">{block.txHash}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Block Data Hash:</span>
                          <span className={`${isCorrupted ? 'text-rose-400 line-through' : 'text-emerald-300'} break-all select-all font-semibold`}>
                            {block.dataHash}
                          </span>
                        </div>
                        {isCorrupted && (
                          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
                            <span className="font-bold block">Tampered Value Detected:</span>
                            Database record was modified off-chain! Cryptographic check fails against parent Merkle root.
                          </div>
                        )}
                        <div>
                          <span className="text-slate-400 block text-[11px]">Previous Block Hash:</span>
                          <span className="text-slate-400 break-all">{block.prevHash}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Signer Authority:</span>
                          <span className="text-slate-300">{block.signer}</span>
                        </div>
                      </div>

                      {/* JSON Payload */}
                      <div>
                        <span className="text-slate-400 block text-[11px] mb-1">Decoded Payload Data:</span>
                        <pre className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
                          {JSON.stringify(block.payload, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: SOLIDITY CONTRACT VIEWER */}
      {selectedTab === 'contract' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4 text-indigo-400" />
              <span className="font-mono text-xs font-bold text-white">contracts/CampusEnergyLedger.sol</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Solidity ^0.8.20 • OpenZeppelin Standard</span>
          </div>
          <pre className="p-5 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed bg-slate-950/60">
            {SOLIDITY_CONTRACT_CODE}
          </pre>
        </div>
      )}
    </div>
  );
};
