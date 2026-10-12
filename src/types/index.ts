export type SwitchType = 'hvac' | 'lights' | 'projector' | 'workstations';

export interface SwitchState {
  hvac: boolean;
  lights: boolean;
  projector: boolean;
  workstations: boolean;
}

export type RelayStatus = 'CONNECTED' | 'DISCONNECTED' | 'GRACE_PERIOD';

export type RoomAnomalyStatus = 'NORMAL' | 'UNSCHEDULED_CONSUMPTION' | 'OVERRIDE_ACTIVE';

export interface ScheduleSlot {
  id: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  startTime: string; // "09:00"
  endTime: string;   // "11:00"
  isBooked: boolean;
}

export interface OverrideInfo {
  authorizedBy: string;
  role: string;
  requestedAt: string;
  expiresAt: string;
  durationMinutes: number;
  reason: string;
  txHash: string;
}

export interface CampusRoom {
  id: string;
  name: string;
  building: string;
  floor: string;
  category: 'lecture_hall' | 'lab' | 'seminar' | 'library_zone' | 'hostel_block';
  switches: SwitchState;
  relayStatus: RelayStatus;
  anomalyStatus: RoomAnomalyStatus;
  currentSchedule: ScheduleSlot | null;
  currentLoadKW: number;
  expectedLoadKW: number;
  baselineIdleKW: number;
  graceTimeRemainingSec: number;
  totalSavedKWh: number;
  override?: OverrideInfo;
}

export interface BuildingStats {
  id: string;
  name: string;
  category: 'Academic' | 'Laboratory' | 'Residential' | 'Library & Admin';
  currentKW: number;
  baselineKW: number;
  solarKW: number;
  dailyTotalKWh: number;
  roomsMonitored: number;
  activeViolations: number;
  co2SavedKg: number;
}

export type BlockEventType =
  | 'GENESIS'
  | 'RELAY_CUTOFF'
  | 'OVERRIDE_AUTHORIZED'
  | 'BATCH_TELEMETRY_PROOF'
  | 'GREEN_CREDITS_MINTED';

export interface BlockchainBlock {
  blockNumber: number;
  timestamp: string;
  eventType: BlockEventType;
  roomId?: string;
  buildingName?: string;
  payload: Record<string, any>;
  dataHash: string;
  prevHash: string;
  txHash: string;
  signer: string;
  isTampered?: boolean;
  tamperedDataHash?: string;
}

export interface DepartmentScore {
  id: string;
  name: string;
  category: 'Hostel' | 'Academic Dept' | 'Research Unit';
  savedKWh: number;
  greenTokens: number;
  co2PreventedKg: number;
  efficiencyScore: number;
  rank: number;
}
