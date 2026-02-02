import { BotBehavior } from "./BotBehavior.js";
import { CautiousLiberal } from "./liberal/CautiousLiberal.js";
import { SilentFascist } from "./fascist/SilentFascist.js";
import { Role } from "../../game/GameTypes.js";

export class BotBehaviorFactory {
  static create(role: Role, playerCount: number): BotBehavior {
    switch (role) {
      case "LIBERAL":
        return new CautiousLiberal();

      case "FASCIST":
        return new SilentFascist();

      case "HITLER":
        return new SilentFascist(); // later: Hitler-specific behavior
    }
  }
}
