import type { ExecutivePowerName, MilestoneInfo } from "../types/index.js";

export function getRoomIdFromUrl() {
  return new URLSearchParams(window.location.search).get("roomId");
}

export function powersTableFor(
  playerCount: number
): Record<number, MilestoneInfo> {
  const slot = (
    n: number,
    power: ExecutivePowerName,
    unlocks = false
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
