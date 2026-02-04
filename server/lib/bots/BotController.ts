import { BotMemory } from "./BotMemory.js";
import { BotBehavior } from "./behaviors/BotBehavior.js";
import { BotActionContext, BotDecision } from "./BotTypes.js";
import { GameEvent } from "../game/GameEvents.js";
import { Role } from "../game/GameTypes.js";
import { PlayerId } from "./BotMemoryTypes.js";

export class BotController {
  readonly role: Role;
  readonly behavior: BotBehavior;
  readonly memory: BotMemory;

  constructor(params: {
    playerId: PlayerId;
    role: Role;
    behavior: BotBehavior;
    playerIds: PlayerId[];
    knownPlayers?: PlayerId[];
  }) {
    this.role = params.role;
    this.behavior = params.behavior;

    this.memory = new BotMemory(
      params.playerId,
      params.playerIds,
      params.knownPlayers ?? [],
    );
  }

  decide(context: BotActionContext): BotDecision {
    return this.behavior.decide(context, this.memory);
  }

  onGameEvent(event: GameEvent) {
    this.memory.applyEvent(event);
  }
}
