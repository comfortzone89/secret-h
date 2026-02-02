import { Policy, Vote } from "../game/GameTypes.js";

export type PlayerId = string;

export interface PlayerPerception {
  suspicion: number; // -100 (trusted) → +100 (suspected fascist)
  trust: number; // 0 → 100
  votingHistory: VoteRecord[];
  governmentHistory: GovernmentRecord[];
  claims: ClaimRecord[];
  alive: boolean;
}

export interface VoteRecord {
  round: number;
  vote: Vote;
  presidentId: PlayerId;
  chancellorId: PlayerId;
}

export interface GovernmentRecord {
  round: number;
  role: "PRESIDENT" | "CHANCELLOR";
  partnerId: PlayerId;
  policyEnacted?: Policy;
}

export interface ClaimRecord {
  round: number;
  claim: unknown; // keep loose for now
}

export interface BotGameState {
  round: number;
  liberalPolicies: number;
  fascistPolicies: number;
  electionTracker: number;
  failedElections: number;
}
