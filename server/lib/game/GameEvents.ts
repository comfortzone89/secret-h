import { Policy, Role, Vote } from "./GameTypes.js";

export interface RoundStartedEvent {
  type: "ROUND_STARTED";
  round: number;
}

export interface VoteCastEvent {
  type: "VOTE_CAST";
  playerId: string;
  vote: Vote;
  presidentId: string;
  chancellorId: string;
}

export interface GovernmentFormedEvent {
  type: "GOVERNMENT_FORMED";
  presidentId: string;
  chancellorId: string;
}

export interface PolicyEnactedEvent {
  type: "POLICY_ENACTED";
  policy: Policy;
  presidentId: string;
  chancellorId: string;
}

export interface PlayerExecutedEvent {
  type: "PLAYER_EXECUTED";
  executorId: string;
  targetId: string;
  revealedRole: Role;
}

export interface ClaimMadeEvent {
  type: "CLAIM_MADE";
  playerId: string;
  claim: {
    type: "POLICY_DRAW" | "DISCARD";
    data: unknown;
  };
}

export interface GameEndEvent {
  type: "GAME_END";
  winnerRole: Role;
}

// Union of all game events
export type GameEvent =
  | RoundStartedEvent
  | VoteCastEvent
  | GovernmentFormedEvent
  | PolicyEnactedEvent
  | PlayerExecutedEvent
  | ClaimMadeEvent
  | GameEndEvent;
