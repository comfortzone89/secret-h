// server/lib/bots/behaviors/BotBehavior.ts
import { BotMemory } from "../BotMemory.js";
import { BotActionContext, BotDecision } from "../BotTypes.js";

export interface BotBehavior {
  readonly name: string;

  /**
   * Decide what to do given the context and the current memory.
   */
  decide(context: BotActionContext, memory: BotMemory): BotDecision;
}
