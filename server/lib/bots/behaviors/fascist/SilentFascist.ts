import { BotBehavior } from "../BotBehavior.js";
import { BotMemory } from "../../BotMemory.js";
import { BotActionContext, BotDecision } from "../../BotTypes.js";

export class SilentFascist implements BotBehavior {
  readonly name = "SilentFascist";

  decide(context: BotActionContext, memory: BotMemory): BotDecision {
    switch (context.type) {
      case "VOTE_GOVERNMENT":
        return this.voteGovernment(context, memory);

      case "NOMINATE_CHANCELLOR":
        return this.nominateChancellor(context, memory);

      case "DISCARD_POLICY":
        return this.discardPolicy(context);

      case "EXECUTE_PLAYER":
        return this.executePlayer(context, memory);

      case "CLAIM_POLICIES":
        return this.claimPolicies(context);

      default:
        throw new Error("Unhandled BotActionContext");
    }
  }

  // ------------------------
  // Voting
  // ------------------------

  private voteGovernment(
    context: Extract<BotActionContext, { type: "VOTE_GOVERNMENT" }>,
    memory: BotMemory,
  ): BotDecision {
    const { presidentId, chancellorId } = context;

    const president = memory.players.get(presidentId);
    const chancellor = memory.players.get(chancellorId);

    if (!president || !chancellor) {
      return { type: "VOTE", vote: "no" };
    }

    // Prefer governments with low suspicion fascists / Hitler
    const score =
      -president.suspicion -
      chancellor.suspicion +
      memory.gameState.fascistPolicies * 5;

    return { type: "VOTE", vote: score > 0 ? "yes" : "no" };
  }

  // ------------------------
  // Nomination
  // ------------------------

  private nominateChancellor(
    context: Extract<BotActionContext, { type: "NOMINATE_CHANCELLOR" }>,
    memory: BotMemory,
  ): BotDecision {
    let bestCandidate = context.eligiblePlayers[0];
    let bestScore = -Infinity;
    console.log("MEMORY", memory);
    console.log("BEST CANDIDATE BEFORE", bestCandidate);
    for (const id of context.eligiblePlayers) {
      const p = memory.players.get(id);
      if (!p) continue;

      // Prefer trusted / low-suspicion players
      let score = -p.suspicion + p.trust;

      // Late game aggression
      score += memory.gameState.fascistPolicies * 3;
      console.log("SCORE", score);
      if (score > bestScore) {
        bestScore = score;
        bestCandidate = id;
      }
    }

    console.log("BEST CANDIDATE AFTER", bestCandidate);
    return { type: "NOMINATE", playerId: bestCandidate };
  }

  // ------------------------
  // Policy Discard
  // ------------------------

  private discardPolicy(
    context: Extract<BotActionContext, { type: "DISCARD_POLICY" }>,
  ): BotDecision {
    // Fascist always keeps fascist policy if possible
    const liberalIndex = context.policies.indexOf("liberal");
    if (liberalIndex >= 0) {
      return { type: "DISCARD", policy: "liberal" };
    }

    return { type: "DISCARD", policy: context.policies[0] };
  }

  // ------------------------
  // Execution
  // ------------------------

  private executePlayer(
    context: Extract<BotActionContext, { type: "EXECUTE_PLAYER" }>,
    memory: BotMemory,
  ): BotDecision {
    // Kill highest suspicion non-fascist-looking player
    let target = context.eligiblePlayers[0];
    let highestSuspicion = -Infinity;

    for (const id of context.eligiblePlayers) {
      const p = memory.players.get(id);
      if (!p) continue;

      if (p.suspicion > highestSuspicion) {
        highestSuspicion = p.suspicion;
        target = id;
      }
    }

    return { type: "EXECUTE", playerId: target };
  }

  // ------------------------
  // Claims
  // ------------------------

  private claimPolicies(
    context: Extract<BotActionContext, { type: "CLAIM_POLICIES" }>,
  ): BotDecision {
    const lieChance = 0.4;

    if (Math.random() < lieChance) {
      // Lie conservatively: shift blame
      return {
        type: "CLAIM",
        claim: {
          type: "POLICY_DRAW",
          data: this.fakePolicyDraw(context.actualPolicies),
        },
      };
    }

    return {
      type: "CLAIM",
      claim: {
        type: "POLICY_DRAW",
        data: context.actualPolicies,
      },
    };
  }

  private fakePolicyDraw(actual: string[]) {
    // Minimal plausible lie
    if (actual.includes("fascist")) {
      return ["liberal", "liberal", "fascist"];
    }
    return actual;
  }
}
