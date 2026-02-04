import { BotMemory } from "../../BotMemory.js";
import { BotActionContext, BotDecision } from "../../BotTypes.js";

export function nominateChancellor(
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
    let score = -p.trust + p.trust;

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
