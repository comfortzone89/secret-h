import { BotBehavior } from "../BotBehavior.js";
import { BotMemory } from "../../BotMemory.js";
import { BotActionContext, BotDecision } from "../../BotTypes.js";

export class CautiousLiberal implements BotBehavior {
  readonly name = "CautiousLiberal";

  decide(context: BotActionContext, memory: BotMemory): BotDecision {
    switch (context.type) {
      case "VOTE_GOVERNMENT": {
        const president = memory.players.get(context.presidentId);
        const chancellor = memory.players.get(context.chancellorId);
        if (!president || !chancellor) return { type: "VOTE", vote: "NEIN" };

        // Vote yes only if both have low suspicion
        if (president.suspicion < 40 && chancellor.suspicion < 40) {
          return { type: "VOTE", vote: "JA" };
        } else {
          return { type: "VOTE", vote: "NEIN" };
        }
      }

      case "NOMINATE_CHANCELLOR": {
        // Pick the eligible player with lowest suspicion
        let best = context.eligiblePlayers[0];
        let minSuspicion = memory.players.get(best)?.suspicion ?? 100;

        for (const playerId of context.eligiblePlayers) {
          const s = memory.players.get(playerId)?.suspicion ?? 100;
          if (s < minSuspicion) {
            best = playerId;
            minSuspicion = s;
          }
        }

        return { type: "NOMINATE", playerId: best };
      }

      case "DISCARD_POLICY": {
        // Liberal: discard FASCIST if possible
        const fascistIndex = context.policies.indexOf("FASCIST");
        if (fascistIndex >= 0) {
          return { type: "DISCARD", policy: "FASCIST" };
        } else {
          return { type: "DISCARD", policy: context.policies[0] };
        }
      }

      case "EXECUTE_PLAYER": {
        // Conservative: do not execute anyone
        return { type: "EXECUTE", playerId: context.eligiblePlayers[0] };
      }

      case "CLAIM_POLICIES": {
        // Always truthful for liberal
        return {
          type: "CLAIM",
          claim: { type: "POLICY_DRAW", data: context.actualPolicies },
        };
      }
    }
  }
}
