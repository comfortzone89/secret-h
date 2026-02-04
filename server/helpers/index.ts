import { Game } from "../lib/game/Game.js";
import { ExecutivePowerName, MilestoneInfo } from "../lib/game/GameTypes.js";

export function getRoomIdFromUrl() {
  return new URLSearchParams(window.location.search).get("roomId");
}

export function capitalizeFirstLetter(string: string) {
  if (!string) {
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function powersTableFor(
  playerCount: number,
): Record<number, MilestoneInfo> {
  const slot = (
    n: number,
    power: ExecutivePowerName,
    unlocks = false,
  ): MilestoneInfo => ({
    slot: n,
    power,
    unlocksVeto: unlocks,
  });

  if (playerCount <= 6) {
    // 5-6 players
    return {
      1: slot(1, null),
      2: slot(2, null),
      3: slot(3, "peek"),
      4: slot(4, "execution"),
      5: slot(5, "execution", true), // execution + veto unlocked
    };
  }

  if (playerCount <= 8) {
    // 7-8 players
    return {
      1: slot(1, null),
      2: slot(2, "investigate"),
      3: slot(3, "specialElection"),
      4: slot(4, "execution"),
      5: slot(5, "execution", true),
    };
  }

  // 9-10 players
  return {
    1: slot(1, "investigate"),
    2: slot(2, "investigate"),
    3: slot(3, "specialElection"),
    4: slot(4, "execution"),
    5: slot(5, "execution", true),
  };
}

export function getEligiblePlayers(game: Game): string[] {
  const presidentIndex = game.currentPresidentIndex;
  return game.players
    .filter(
      (p) =>
        p.alive &&
        p.index !== presidentIndex &&
        game.lastGovernment.presidentId !== p.index &&
        game.lastGovernment.chancellorId !== p.index &&
        p.id !== null,
    )
    .map((p) => p.id!);
}
