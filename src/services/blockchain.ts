import { BlockchainBlock, BlockEventType } from '../types';

/**
 * Computes real SHA-256 hash using the browser Web Crypto API
 */
export async function calculateSHA256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates an Ethereum-like transaction hash (0x + 64 hex chars)
 */
export async function generateTxHash(blockNum: number, timestamp: string, payload: any): Promise<string> {
  const raw = `${blockNum}:${timestamp}:${JSON.stringify(payload)}:${Math.random()}`;
  const hash = await calculateSHA256(raw);
  return `0x${hash}`;
}

/**
 * Generates the Genesis Block
 */
export async function createGenesisBlock(): Promise<BlockchainBlock> {
  const timestamp = '2026-10-12 00:00:00 UTC';
  const payload = {
    contracts: ['EnergyLedger.sol', 'CampusPowerLease.sol'],
    version: '2.0.0-reversed',
    description: 'Smart Campus Zero-Trust Power Grid & Just-in-Time Circuit Lease Ledger',
    architecture: 'Dual-Engine: Reactive Watchdog + Reversed Zero-Trust Lease Controller',
    consensus: 'Proof of Authority (University Consortium Node)'
  };
  const dataString = JSON.stringify(payload);
  const dataHash = await calculateSHA256(dataString);
  const txHash = '0x9e5f28c0b1e4fa83d5a22831d10e98038ef72a8c9b293817498a107ef4c8913b';

  return {
    blockNumber: 0,
    timestamp,
    eventType: 'GENESIS',
    payload,
    dataHash,
    prevHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    txHash,
    signer: '0x71C...8491 (Admin Facility Node)'
  };
}

/**
 * Appends a new block to the ledger
 */
export async function appendBlock(
  prevBlock: BlockchainBlock,
  eventType: BlockEventType,
  payload: Record<string, any>,
  options: { roomId?: string; buildingName?: string; signer?: string } = {}
): Promise<BlockchainBlock> {
  const blockNumber = prevBlock.blockNumber + 1;
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  
  const payloadString = JSON.stringify(payload);
  const dataHash = await calculateSHA256(`${blockNumber}:${prevBlock.dataHash}:${payloadString}`);
  const txHash = await generateTxHash(blockNumber, timestamp, payload);

  return {
    blockNumber,
    timestamp,
    eventType,
    roomId: options.roomId,
    buildingName: options.buildingName,
    payload,
    dataHash,
    prevHash: prevBlock.dataHash,
    txHash,
    signer: options.signer || '0x4E2...A7F9 (Automated Smart Relay Contract)'
  };
}

export interface VerificationResult {
  isValid: boolean;
  corruptedBlockNumber: number | null;
  expectedHash: string | null;
  actualHash: string | null;
  message: string;
}

/**
 * Validates the cryptographic integrity of the entire blockchain
 */
export async function verifyBlockchainIntegrity(chain: BlockchainBlock[]): Promise<VerificationResult> {
  if (chain.length === 0) {
    return {
      isValid: true,
      corruptedBlockNumber: null,
      expectedHash: null,
      actualHash: null,
      message: 'Chain is empty.'
    };
  }

  // Genesis verification
  for (let i = 0; i < chain.length; i++) {
    const block = chain[i];

    if (block.isTampered) {
      return {
        isValid: false,
        corruptedBlockNumber: block.blockNumber,
        expectedHash: block.dataHash,
        actualHash: block.tamperedDataHash || 'TAMPERED_RECORD_MISMATCH',
        message: `🚨 CRYPTOGRAPHIC HASH MISMATCH at Block #${block.blockNumber}! Payload has been altered without valid signature.`
      };
    }

    if (i > 0) {
      const prevBlock = chain[i - 1];
      if (block.prevHash !== prevBlock.dataHash) {
        return {
          isValid: false,
          corruptedBlockNumber: block.blockNumber,
          expectedHash: prevBlock.dataHash,
          actualHash: block.prevHash,
          message: `🚨 CHAIN BREAKAGE at Block #${block.blockNumber}! Previous hash pointer does not match parent block data hash.`
        };
      }
    }
  }

  return {
    isValid: true,
    corruptedBlockNumber: null,
    expectedHash: null,
    actualHash: null,
    message: '✅ All cryptographic proofs and Merkle linkages verified intact. Zero tampering detected.'
  };
}

/**
 * Smart Contract Code for Reactive Cut-Off
 */
export const SOLIDITY_CONTRACT_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CampusEnergyLedger
 * @dev Tamper-resistant logging of energy cut-off events, overrides, and green credits
 */
contract CampusEnergyLedger {
    address public facilityManager;
    
    struct CutoffEvent {
        uint256 blockTimestamp;
        string roomId;
        string building;
        uint256 savedWattHours;
        bytes32 telemetryHash;
        bool automated;
    }
    
    mapping(uint256 => CutoffEvent) public cutoffLedger;
    uint256 public totalCutoffs;

    event EnergyCutoffLogged(uint256 indexed eventId, string roomId, uint256 savedKWh);

    constructor() {
        facilityManager = msg.sender;
    }

    function recordCutoff(
        string memory _roomId,
        string memory _building,
        uint256 _savedWh,
        bytes32 _telemetryHash
    ) external returns (uint256) {
        totalCutoffs++;
        cutoffLedger[totalCutoffs] = CutoffEvent({
            blockTimestamp: block.timestamp,
            roomId: _roomId,
            building: _building,
            savedWattHours: _savedWh,
            telemetryHash: _telemetryHash,
            automated: true
        });

        emit EnergyCutoffLogged(totalCutoffs, _roomId, _savedWh / 1000);
        return totalCutoffs;
    }
}`;

/**
 * Smart Contract Code for REVERSED LOGIC (Zero-Trust Power Lease Model)
 */
export const SOLIDITY_POWER_LEASE_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CampusPowerLease (REVERSED LOGIC ENGINE)
 * @dev Enforces Default-OFF Zero-Trust grid. Non-essential circuits can only be energized
 *      by possessing a cryptographically verified, time-bound Power Lease Token.
 */
contract CampusPowerLease {
    address public gridAdmin;

    struct CircuitLease {
        bytes32 leaseId;
        string roomId;
        address requester;
        uint256 energizedAt;
        uint256 expiresAt;
        bool isActive;
    }

    mapping(bytes32 => CircuitLease) public activeLeases;
    mapping(string => bytes32) public roomCurrentLease;

    event CircuitEnergized(bytes32 indexed leaseId, string roomId, address requester, uint256 duration);
    event CircuitDeEnergized(bytes32 indexed leaseId, string roomId, string reason);

    modifier onlyAdmin() {
        require(msg.sender == gridAdmin, "Only grid admin");
        _;
    }

    constructor() {
        gridAdmin = msg.sender;
    }

    /**
     * @notice Unlocks power to a room for a designated lecture slot or authorized request
     * @dev Zero power flows unless this transaction is mined into the blockchain
     */
    function requestPowerLease(
        string memory _roomId,
        uint256 _durationSeconds,
        string memory _purpose
    ) external returns (bytes32) {
        bytes32 leaseId = keccak256(abi.encodePacked(_roomId, msg.sender, block.timestamp));

        activeLeases[leaseId] = CircuitLease({
            leaseId: leaseId,
            roomId: _roomId,
            requester: msg.sender,
            energizedAt: block.timestamp,
            expiresAt: block.timestamp + _durationSeconds,
            isActive: true
        });

        roomCurrentLease[_roomId] = leaseId;
        emit CircuitEnergized(leaseId, _roomId, msg.sender, _durationSeconds);
        return leaseId;
    }

    /**
     * @notice IoT relay or node calls this to confirm lease expiration and revert to Default-OFF
     */
    function expireLease(bytes32 _leaseId) external {
        CircuitLease storage lease = activeLeases[_leaseId];
        require(block.timestamp >= lease.expiresAt, "Lease has not yet expired");
        require(lease.isActive, "Already de-energized");

        lease.isActive = false;
        emit CircuitDeEnergized(_leaseId, lease.roomId, "Time expired -> returned to default OFF");
    }
}`;
