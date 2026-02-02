import { BotMemory } from "./BotMemory.js";
import { BotBehavior } from "./behaviors/BotBehavior.js";
import { BotActionContext, BotDecision } from "./BotTypes.js";
import { GameEvent } from "../game/GameEvents.js";
import { Role } from "../game/GameTypes.js";

export class BotController {
  readonly role: Role;
  readonly behavior: BotBehavior;
  readonly memory: BotMemory;

  constructor(params: {
    role: Role;
    behavior: BotBehavior;
    playerIds: string[];
    knownPlayers?: string[];
  }) {
    this.role = params.role;
    this.behavior = params.behavior;
    this.memory = new BotMemory(params.playerIds, params.knownPlayers ?? []);
  }

  decide(context: BotActionContext): BotDecision {
    return this.behavior.decide(context, this.memory);
  }

  onGameEvent(event: GameEvent) {
    this.memory.applyEvent(event);
  }
}
