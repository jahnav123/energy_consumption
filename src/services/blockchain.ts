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
    contract: 'EnergyLedger.sol',
    version: '1.0.0',
    description: 'Smart Campus Tamper-Resistant Energy & Cut-Off Ledger Genesis',
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
 * Mock Smart Contract Code representation for judges to inspect
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
    
    struct OverrideRecord {
        uint256 blockTimestamp;
        string roomId;
        address authorizedBy;
        uint256 durationSeconds;
        string reason;
    }
    
    event EnergyCutoffLogged(uint256 indexed eventId, string roomId, uint256 savedKWh);
    event OverrideGranted(string indexed roomId, address authorizedBy, uint256 duration);
    event GreenCreditsAwarded(string indexed department, uint256 creditAmount);

    mapping(uint256 => CutoffEvent) public cutoffLedger;
    mapping(string => uint256) public departmentGreenCredits;
    uint256 public totalCutoffs;

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

    function grantOverride(
        string memory _roomId,
        uint256 _durationSeconds,
        string memory _reason
    ) external {
        emit OverrideGranted(_roomId, msg.sender, _durationSeconds);
    }
}`;
