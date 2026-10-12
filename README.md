# ⚡ VoltLedger: Campus Energy Monitor & Blockchain Conservation Platform

An autonomous campus energy monitoring and automated power curtailment system built with **React**, **TypeScript**, **Tailwind CSS**, and **Web3 Blockchain Cryptography**.

Features both the **Standard Watchdog Model** and the **Reversed Logic (Zero-Trust Power Grid)** architecture.

---

## 📖 Key Documentation
- 📄 [Problem Statement](problem_statement.md): Breakdown of campus energy waste, trust deficit, and stakeholder requirements.
- 💡 [Solution Architecture](solution.md): Timetable-aware circuit monitoring, automated cut-offs, smart overrides, and blockchain ledger mechanics.
- 🔄 [Reverse the Logic Challenge](reversed_logic.md): Complete documentation of the 180° architectural reversal from *Default-ON Watchdog* to *Default-OFF Zero-Trust Grid*.

---

## 🚀 Live Demo & Quickstart

### 1. Install & Run
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit the app at: **`http://localhost:5173`**

### 2. Build for Production
```bash
npm run build
```

---

## ✨ Core Features & Hackathon Highlights

1. **🔄 Reverse the Logic Toggle (Hackathon Challenge Highlight):**
   - Toggle seamlessly between **Standard Watchdog Mode** (*Default-ON $\rightarrow$ Cut on Anomaly*) and **Zero-Trust Mode** (*Default-OFF $\rightarrow$ Power by Smart Contract Lease*).
   - In Zero-Trust Mode, non-essential circuits are physically isolated (0.00 kW draw), eliminating 100% of vampire & after-hours waste before it starts.

2. **Timetable-Aware Room Switch Matrix:**
   - Ingests academic class schedules and cross-references active power draw.
   - Detects unscheduled energy waste (e.g. AC and projectors left running after class).
   - Real-time interactive switch toggles (HVAC, Lighting, Projector, Workstations).

3. **Autonomous Circuit Cut-Off Engine:**
   - Initiates an audio/visual grace period countdown.
   - Trips non-essential circuits automatically when grace period expires.
   - Keeps essential loads protected (servers, safety sensors, lab refrigeration).

4. **Blockchain Audit Ledger & Tamper Proof (Judge Favorite):**
   - Dual Smart Contracts: `EnergyLedger.sol` (Cut-Offs & Credits) and `CampusPowerLease.sol` (Zero-Trust Leases).
   - Employs **SHA-256 Web Crypto hashing**.
   - Interactive **"Simulate Database Tampering"** button that proves why decentralized ledgers are essential over centralized SQL databases.
   - In-app Block Explorer to inspect block numbers, payloads, transaction hashes, and signers.

5. **Gamified Hostel & Department Leaderboard:**
   - Converts verified energy savings into `$GREEN` tokens.
   - Hostel competitions and redeemable campus rewards.