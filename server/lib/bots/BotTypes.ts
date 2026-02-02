import { Policy, Vote } from "../game/GameTypes.js";

export type BotActionContext =
  | {
      type: "VOTE_GOVERNMENT";
      presidentId: string;
      chancellorId: string;
    }
  | {
      type: "NOMINATE_CHANCELLOR";
      eligiblePlayers: string[];
    }
  | {
      type: "DISCARD_POLICY";
      policies: Policy[];
    }
  | {
      type: "EXECUTE_PLAYER";
      eligiblePlayers: string[];
    }
  | {
      type: "CLAIM_POLICIES";
      actualPolicies: Policy[];
    };

export type BotDecision =
  | {
      type: "VOTE";
      vote: Vote;
    }
  | {
      type: "NOMINATE";
      playerId: string;
    }
  | {
      type: "DISCARD";
      policy: Policy;
    }
  | {
      type: "EXECUTE";
      playerId: string;
    }
  | {
      type: "CLAIM";
      claim: {
        type: "POLICY_DRAW" | "DISCARD";
        data: unknown;
      };
    };
