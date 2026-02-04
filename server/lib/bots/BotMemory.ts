import { PlayerId, PlayerPerception, BotGameState } from "./BotMemoryTypes.js";
import { GameEvent } from "../game/GameEvents.js";
import { Policy, Role, Vote } from "../game/GameTypes.js";

export class BotMemory {
  readonly selfId: PlayerId;
  readonly players: Map<PlayerId, PlayerPerception>;
  readonly gameState: BotGameState;

  constructor(
    selfId: PlayerId,
    playerIds: PlayerId[],
    knownPlayers: PlayerId[],
  ) {
    this.selfId = selfId;
    this.players = new Map();

    for (const id of playerIds) {
      if (id === selfId) continue; // 👈 critical invariant

      this.players.set(id, {
        suspicion: knownPlayers.includes(id) ? -50 : 0,
        trust: knownPlayers.includes(id) ? 80 : 50,
        votingHistory: [],
        governmentHistory: [],
        claims: [],
        alive: true,
      });
    }

    this.gameState = {
      round: 1,
      liberalPolicies: 0,
      fascistPolicies: 0,
      electionTracker: 0,
      failedElections: 0,
    };
  }

  applyEvent(event: GameEvent) {
    switch (event.type) {
      case "ROUND_STARTED":
        this.gameState.round = event.round;
        break;

      case "VOTE_CAST":
        this.onVote(event);
        break;

      case "GOVERNMENT_FORMED":
        this.onGovernmentFormed(event);
        break;

      case "POLICY_ENACTED":
        this.onPolicyEnacted(event);
        break;

      case "PLAYER_EXECUTED":
        this.onPlayerExecuted(event);
        break;

      case "CLAIM_MADE":
        this.onClaimMade(event);
        break;
    }
  }

  private onVote(event: {
    playerId: PlayerId;
    vote: Vote;
    presidentId: PlayerId;
    chancellorId: PlayerId;
  }) {
    const perception = this.players.get(event.playerId);
    if (!perception) return;

    perception.votingHistory.push({
      round: this.gameState.round,
      vote: event.vote,
      presidentId: event.presidentId,
      chancellorId: event.chancellorId,
    });

    // Example heuristic
    if (event.vote === "yes") {
      perception.suspicion += 2;
    }
  }

  private onPolicyEnacted(event: {
    policy: Policy;
    presidentId: PlayerId;
    chancellorId: PlayerId;
  }) {
    if (event.policy === "liberal") {
      this.gameState.liberalPolicies++;
      this.adjustSuspicion(event.presidentId, -10);
      this.adjustSuspicion(event.chancellorId, -10);
    } else {
      this.gameState.fascistPolicies++;
      this.adjustSuspicion(event.presidentId, +15);
      this.adjustSuspicion(event.chancellorId, +15);
    }
  }

  private adjustSuspicion(playerId: PlayerId, delta: number) {
    const p = this.players.get(playerId);
    if (!p) return;
    p.suspicion = Math.max(-100, Math.min(100, p.suspicion + delta));
  }

  private onGovernmentFormed(event: {
    presidentId: PlayerId;
    chancellorId: PlayerId;
  }) {
    const { presidentId, chancellorId } = event;

    const president = this.players.get(presidentId);
    const chancellor = this.players.get(chancellorId);

    if (!president || !chancellor) return;

    president.governmentHistory.push({
      round: this.gameState.round,
      role: "PRESIDENT",
      partnerId: chancellorId,
    });

    chancellor.governmentHistory.push({
      round: this.gameState.round,
      role: "CHANCELLOR",
      partnerId: presidentId,
    });

    // Forming governments is slightly suspicious in Secret Hitler
    this.adjustSuspicion(presidentId, +3);
    this.adjustSuspicion(chancellorId, +3);

    // Implicit alliance signal
    this.adjustTrustLink(presidentId, chancellorId, +5);
  }

  private onPlayerExecuted(event: {
    executorId: PlayerId;
    targetId: PlayerId;
    revealedRole: Role;
  }) {
    const { executorId, targetId, revealedRole } = event;

    const target = this.players.get(targetId);
    if (!target) return;

    target.alive = false;

    // Everyone now knows the truth about the target
    if (revealedRole === "liberal") {
      this.players.forEach((p) => {
        if (p.alive) p.trust -= 5;
      });
      this.adjustSuspicion(executorId, +30);
    }

    if (revealedRole === "fascist") {
      this.adjustSuspicion(executorId, -40);
    }

    if (revealedRole === "hitler") {
      // Game ends, but still record it
      this.adjustSuspicion(executorId, -100);
    }
  }

  private onClaimMade(event: {
    playerId: PlayerId;
    claim: {
      type: "POLICY_DRAW" | "DISCARD";
      data: unknown;
    };
  }) {
    const perception = this.players.get(event.playerId);
    if (!perception) return;

    perception.claims.push({
      round: this.gameState.round,
      claim: event.claim,
    });
  }

  private adjustTrustLink(a: PlayerId, b: PlayerId, delta: number) {
    const pa = this.players.get(a);
    const pb = this.players.get(b);
    if (!pa || !pb) return;

    pa.trust = Math.max(0, Math.min(100, pa.trust + delta));
    pb.trust = Math.max(0, Math.min(100, pb.trust + delta));
  }
}
