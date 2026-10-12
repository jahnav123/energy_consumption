import React, { useState, useEffect, useCallback } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  OverviewMetrics 
} from './components/OverviewMetrics';
import { 
  RoomMatrix 
} from './components/RoomMatrix';
import { 
  CutoffSimulator 
} from './components/CutoffSimulator';
import { 
  EnergyAnalytics 
} from './components/EnergyAnalytics';
import { 
  BlockchainExplorer 
} from './components/BlockchainExplorer';
import { 
  Leaderboard 
} from './components/Leaderboard';
import { 
  OverrideModal 
} from './components/OverrideModal';
import { 
  CampusRoom, 
  SwitchType, 
  BuildingStats, 
  BlockchainBlock, 
  DepartmentScore, 
  OverrideInfo 
} from './types';
import { 
  INITIAL_ROOMS, 
  INITIAL_BUILDINGS, 
  INITIAL_LEADERBOARD 
} from './data/mockCampusData';
import { 
  createGenesisBlock, 
  appendBlock, 
  verifyBlockchainIntegrity, 
  VerificationResult,
  calculateSHA256
} from './services/blockchain';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'simulator' | 'blockchain' | 'leaderboard'>('rooms');
  const [rooms, setRooms] = useState<CampusRoom[]>(INITIAL_ROOMS);
  const [buildings, setBuildings] = useState<BuildingStats[]>(INITIAL_BUILDINGS);
  const [scores, setScores] = useState<DepartmentScore[]>(INITIAL_LEADERBOARD);
  const [blocks, setBlocks] = useState<BlockchainBlock[]>([]);
  const [verificationResult, setVerificationResult] = useState<VerificationResult>({
    isValid: true,
    corruptedBlockNumber: null,
    expectedHash: null,
    actualHash: null,
    message: 'Initializing cryptographic ledger...'
  });

  const [totalSavedKWh, setTotalSavedKWh] = useState<number>(368.6);
  const [simulatedTime, setSimulatedTime] = useState<string>('11:15 AM');
  const [selectedRoomForOverride, setSelectedRoomForOverride] = useState<CampusRoom | null>(null);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState<boolean>(false);

  // Initialize blockchain with Genesis block and previous activity
  useEffect(() => {
    async function initChain() {
      const genesis = await createGenesisBlock();
      
      const block1 = await appendBlock(
        genesis,
        'RELAY_CUTOFF',
        {
          roomId: 'phy-lab-2',
          building: 'Science Block C',
          savedKWh: 8.4,
          reason: 'Unscheduled load after 09:30 AM practical',
          automated: true
        },
        { roomId: 'phy-lab-2', buildingName: 'Science Block C' }
      );

      const block2 = await appendBlock(
        block1,
        'BATCH_TELEMETRY_PROOF',
        {
          timestampSlot: '10:00:00 UTC',
          totalCampusDrawKW: 88.2,
          solarGenerationKW: 24.0,
          merkleRoot: '0xd7a8fbb239a0914e6b20894acde91238914ba4901f419b'
        },
        { buildingName: 'Campus Micro-Grid' }
      );

      const block3 = await appendBlock(
        block2,
        'OVERRIDE_AUTHORIZED',
        {
          roomId: 'mech-ws',
          building: 'Engineering Block A',
          authorizedBy: 'Prof. S. Henderson',
          durationMinutes: 90,
          reason: 'Formula Student Chassis Prototyping'
        },
        { roomId: 'mech-ws', buildingName: 'Engineering Block A', signer: '0x32A...ProfHenderson' }
      );

      const initialChain = [genesis, block1, block2, block3];
      setBlocks(initialChain);
      const verify = await verifyBlockchainIntegrity(initialChain);
      setVerificationResult(verify);
    }

    initChain();
  }, []);

  // Autonomous Countdown & Relay Trip Tick Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setRooms(prevRooms => {
        return prevRooms.map(room => {
          if (room.anomalyStatus === 'UNSCHEDULED_CONSUMPTION' && room.relayStatus === 'GRACE_PERIOD') {
            if (room.graceTimeRemainingSec > 1) {
              return {
                ...room,
                graceTimeRemainingSec: room.graceTimeRemainingSec - 1,
              };
            } else {
              // Grace period reached 0 -> Autonomous Cut-Off!
              const savedKwhIncrement = (room.currentLoadKW - room.baselineIdleKW) * 1.5;
              setTotalSavedKWh(prev => prev + savedKwhIncrement);

              // Append block asynchronously
              if (blocks.length > 0) {
                const latest = blocks[blocks.length - 1];
                appendBlock(
                  latest,
                  'RELAY_CUTOFF',
                  {
                    roomId: room.id,
                    roomName: room.name,
                    building: room.building,
                    savedKWh: parseFloat(savedKwhIncrement.toFixed(2)),
                    previousLoadKW: room.currentLoadKW,
                    trippedCircuits: ['HVAC', 'Lighting', 'Projector'],
                    automated: true
                  },
                  { roomId: room.id, buildingName: room.building }
                ).then(newBlock => {
                  setBlocks(prev => {
                    const updated = [...prev, newBlock];
                    verifyBlockchainIntegrity(updated).then(res => setVerificationResult(res));
                    return updated;
                  });
                });
              }

              return {
                ...room,
                relayStatus: 'DISCONNECTED',
                currentLoadKW: room.baselineIdleKW,
                graceTimeRemainingSec: 0,
                totalSavedKWh: room.totalSavedKWh + savedKwhIncrement,
                switches: {
                  ...room.switches,
                  hvac: false,
                  lights: false,
                  projector: false,
                },
              };
            }
          }
          return room;
        });
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [blocks]);

  // Handle Switch Toggles
  const handleToggleSwitch = useCallback((roomId: string, switchType: SwitchType) => {
    setRooms(prevRooms => {
      return prevRooms.map(room => {
        if (room.id !== roomId || room.relayStatus === 'DISCONNECTED') return room;

        const updatedSwitches = {
          ...room.switches,
          [switchType]: !room.switches[switchType],
        };

        // Recalculate power draw
        let calculatedKW = room.baselineIdleKW;
        if (updatedSwitches.hvac) calculatedKW += 3.2;
        if (updatedSwitches.lights) calculatedKW += 0.6;
        if (updatedSwitches.projector) calculatedKW += 0.8;
        if (updatedSwitches.workstations) calculatedKW += 1.8;

        // Determine if this is an anomaly
        const isScheduled = !!room.currentSchedule;
        const isOverridden = room.anomalyStatus === 'OVERRIDE_ACTIVE';
        const hasActiveDraw = calculatedKW > room.baselineIdleKW + 0.3;

        let anomalyStatus = room.anomalyStatus;
        let graceTimeRemainingSec = room.graceTimeRemainingSec;
        let relayStatus = room.relayStatus;

        if (!isScheduled && !isOverridden && hasActiveDraw) {
          anomalyStatus = 'UNSCHEDULED_CONSUMPTION';
          if (relayStatus !== 'GRACE_PERIOD') {
            graceTimeRemainingSec = 45;
            relayStatus = 'GRACE_PERIOD';
          }
        } else if (!hasActiveDraw && anomalyStatus === 'UNSCHEDULED_CONSUMPTION') {
          anomalyStatus = 'NORMAL';
          relayStatus = 'CONNECTED';
          graceTimeRemainingSec = 0;
        }

        return {
          ...room,
          switches: updatedSwitches,
          currentLoadKW: parseFloat(calculatedKW.toFixed(2)),
          anomalyStatus,
          graceTimeRemainingSec,
          relayStatus,
        };
      });
    });
  }, []);

  // Manual Relay Trip
  const handleTripRelay = useCallback(async (roomId: string) => {
    const targetRoom = rooms.find(r => r.id === roomId);
    if (!targetRoom) return;

    const saved = parseFloat(((targetRoom.currentLoadKW - targetRoom.baselineIdleKW) * 2).toFixed(2));
    setTotalSavedKWh(prev => prev + saved);

    setRooms(prev => prev.map(r => {
      if (r.id !== roomId) return r;
      return {
        ...r,
        relayStatus: 'DISCONNECTED',
        currentLoadKW: r.baselineIdleKW,
        graceTimeRemainingSec: 0,
        totalSavedKWh: r.totalSavedKWh + saved,
        switches: {
          ...r.switches,
          hvac: false,
          lights: false,
          projector: false,
        }
      };
    }));

    if (blocks.length > 0) {
      const latest = blocks[blocks.length - 1];
      const newBlock = await appendBlock(
        latest,
        'RELAY_CUTOFF',
        {
          roomId: targetRoom.id,
          roomName: targetRoom.name,
          building: targetRoom.building,
          savedKWh: saved,
          manualOperator: 'Facility Manager (Manual Trip)',
          reason: 'Manual energy shed enforcement'
        },
        { roomId: targetRoom.id, buildingName: targetRoom.building }
      );
      const updated = [...blocks, newBlock];
      setBlocks(updated);
      const verify = await verifyBlockchainIntegrity(updated);
      setVerificationResult(verify);
    }
  }, [rooms, blocks]);

  // Restore Relay
  const handleRestoreRelay = useCallback((roomId: string) => {
    setRooms(prev => prev.map(r => {
      if (r.id !== roomId) return r;
      return {
        ...r,
        relayStatus: 'CONNECTED',
        anomalyStatus: 'NORMAL',
        graceTimeRemainingSec: 0,
        currentLoadKW: r.baselineIdleKW,
      };
    }));
  }, []);

  // Handle Overtime Override
  const handleSubmitOverride = useCallback(async (roomId: string, override: OverrideInfo) => {
    setRooms(prev => prev.map(r => {
      if (r.id !== roomId) return r;
      return {
        ...r,
        anomalyStatus: 'OVERRIDE_ACTIVE',
        relayStatus: 'CONNECTED',
        graceTimeRemainingSec: 0,
        override,
      };
    }));

    if (blocks.length > 0) {
      const latest = blocks[blocks.length - 1];
      const newBlock = await appendBlock(
        latest,
        'OVERRIDE_AUTHORIZED',
        {
          roomId,
          authorizedBy: override.authorizedBy,
          role: override.role,
          durationMinutes: override.durationMinutes,
          reason: override.reason,
          expiresAt: override.expiresAt,
          signature: override.txHash,
        },
        { roomId, signer: `0x${Math.random().toString(16).substring(2, 6)}...${override.authorizedBy.replace(/\s+/g, '')}` }
      );
      const updated = [...blocks, newBlock];
      setBlocks(updated);
      const verify = await verifyBlockchainIntegrity(updated);
      setVerificationResult(verify);
    }
  }, [blocks]);

  // Tamper Block Simulation (Judge test)
  const handleTamperBlock = useCallback(async (blockNumber: number) => {
    const updated = blocks.map(b => {
      if (b.blockNumber === blockNumber) {
        return {
          ...b,
          isTampered: true,
          tamperedDataHash: '0xBAD000000000000000000000000000000000000000000000000000000000DEAD',
          payload: {
            ...b.payload,
            savedKWh: 0.1, // Rogue DB admin alters savings record!
            tampered: true,
            tamperedBy: 'Centralized SQL Admin (Unauthorized Edit)'
          }
        };
      }
      return b;
    });

    setBlocks(updated);
    const verify = await verifyBlockchainIntegrity(updated);
    setVerificationResult(verify);
  }, [blocks]);

  // Restore Block
  const handleRestoreBlock = useCallback(async (blockNumber: number) => {
    // Rebuild clean block
    const updated = blocks.map(b => {
      if (b.blockNumber === blockNumber) {
        const { isTampered, tamperedDataHash, ...rest } = b;
        return {
          ...rest,
          isTampered: false,
        };
      }
      return b;
    });

    setBlocks(updated);
    const verify = await verifyBlockchainIntegrity(updated);
    setVerificationResult(verify);
  }, [blocks]);

  // Recalculate Verification
  const handleReverifyChain = useCallback(async () => {
    const verify = await verifyBlockchainIntegrity(blocks);
    setVerificationResult(verify);
  }, [blocks]);

  // Simulator Cut-off action
  const handleSimulateCutoff = useCallback(async (scenario: {
    roomId: string;
    roomName: string;
    buildingName: string;
    savedKWh: number;
    initialKW: number;
    cutKW: number;
  }) => {
    // Update room
    setRooms(prev => prev.map(r => {
      if (r.id === scenario.roomId) {
        return {
          ...r,
          relayStatus: 'DISCONNECTED',
          currentLoadKW: scenario.cutKW,
          graceTimeRemainingSec: 0,
          totalSavedKWh: r.totalSavedKWh + scenario.savedKWh,
          switches: {
            ...r.switches,
            hvac: false,
            lights: false,
            projector: false,
          }
        };
      }
      return r;
    }));

    setTotalSavedKWh(prev => prev + scenario.savedKWh);

    const latest = blocks[blocks.length - 1];
    const newBlock = await appendBlock(
      latest,
      'RELAY_CUTOFF',
      {
        roomId: scenario.roomId,
        roomName: scenario.roomName,
        building: scenario.buildingName,
        savedKWh: scenario.savedKWh,
        initialKW: scenario.initialKW,
        cutKW: scenario.cutKW,
        automated: true,
        greenTokensMinted: Math.round(scenario.savedKWh * 5),
      },
      { roomId: scenario.roomId, buildingName: scenario.buildingName }
    );

    const updated = [...blocks, newBlock];
    setBlocks(updated);
    const verify = await verifyBlockchainIntegrity(updated);
    setVerificationResult(verify);

    return newBlock;
  }, [blocks]);

  const activeViolationsCount = rooms.filter(r => r.anomalyStatus === 'UNSCHEDULED_CONSUMPTION').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeViolationsCount={activeViolationsCount}
        totalKWhSaved={totalSavedKWh}
        isChainValid={verificationResult.isValid}
        simulatedTime={simulatedTime}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI Overview Metrics (Always visible) */}
        <OverviewMetrics
          rooms={rooms}
          buildings={buildings}
          totalSavedKWh={totalSavedKWh}
        />

        {/* Tab 1: Room Switch Matrix & Telemetry */}
        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <EnergyAnalytics buildings={buildings} />
            <RoomMatrix
              rooms={rooms}
              onToggleSwitch={handleToggleSwitch}
              onTripRelay={handleTripRelay}
              onRestoreRelay={handleRestoreRelay}
              onOpenOverrideModal={room => {
                setSelectedRoomForOverride(room);
                setIsOverrideModalOpen(true);
              }}
            />
          </div>
        )}

        {/* Tab 2: Judge Cut-Off Simulator */}
        {activeTab === 'simulator' && (
          <CutoffSimulator onSimulateCutoff={handleSimulateCutoff} />
        )}

        {/* Tab 3: Blockchain Audit Explorer */}
        {activeTab === 'blockchain' && (
          <BlockchainExplorer
            blocks={blocks}
            verificationResult={verificationResult}
            onTamperBlock={handleTamperBlock}
            onRestoreBlock={handleRestoreBlock}
            onReverifyChain={handleReverifyChain}
          />
        )}

        {/* Tab 4: Leaderboard & Green Credits */}
        {activeTab === 'leaderboard' && (
          <Leaderboard scores={scores} />
        )}
      </main>

      {/* Override Modal */}
      <OverrideModal
        room={selectedRoomForOverride}
        isOpen={isOverrideModalOpen}
        onClose={() => {
          setIsOverrideModalOpen(false);
          setSelectedRoomForOverride(null);
        }}
        onSubmitOverride={handleSubmitOverride}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>⚡ VoltLedger Campus Energy Monitor • Hackathon Prototype</span>
          <span className="font-mono text-slate-400">Proof of Authority EVM • Real SHA-256 Web Crypto Engine</span>
        </div>
      </footer>
    </div>
  );
};
