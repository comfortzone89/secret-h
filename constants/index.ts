import { Variants } from "framer-motion";

export const investigateCardAnimations = {
  front: {
    variants: {
      initial: { rotateY: 0, opacity: 1 },
      animate: { rotateY: -180, opacity: 0 },
    } satisfies Variants,
    transition: {
      rotateY: { duration: 1, delay: 1 },
      opacity: { duration: 0, delay: 1.35 },
    },
  },
  back: {
    variants: {
      initial: { rotateY: -180, opacity: 0 },
      animate: { rotateY: 0, opacity: 1 },
    } satisfies Variants,
    transition: {
      rotateY: { duration: 1, delay: 1 },
      opacity: { duration: 0, delay: 1.35 },
    },
  },
};

export const DEFAULT_PORTRAIT =
  "/images/player-portraits/player-portrait-0.svg";

export const PORTRAITS = Array.from(
  { length: 21 },
  (_, i) => `/images/player-portraits/player-portrait-${i}.svg`
);

export const CHANCELLOR_MODAL_H =
  "Select a policy to enact. The other card will discarded to the discard pile.";
export const ELECTION_TRACKER_MODAL_H = "Legislative Failed";
export const ELECTION_TRACKER_MODAL_P1 =
  "The election tracker advances by 1 every time a government fails to (or refuses to) pass a policy, and resets whenever a policy is passed.";
export const ELECTION_TRACKER_MODAL_P2 =
  "When the tracker reaches 3, the top policy on the draw deck is instantly passed. No presidential powers trigger and all term limits will be reset.";
export const EXECUTION_MODAL_H = "Execution";
export const EXECUTION_MODAL_P1 =
  "Choose a player to execute. The executed player will be out for the remainder of the game. This means he can't perform any role, including voting, be a part of a government, or even speak and share his insights.";
export const EXECUTION_MODAL_P2 =
  "If the player is Hitler, the game ends in a Liberal victory. If he isn't, the game continues. The executed player (provided he isn't Hitler) will not reveal his party membership.";
export const EXECUTION_RESULT_MODAL_H = "Player Executed";
export const EXECUTION_RESULT_MODAL_ME =
  "From here on out, you are no longer able to talk and share insights, be elected into a government, or vote.";
export const GAME_OVER_MODAL_PLEFT =
  "A player has left the game. It can no longer be restarted. You'll need to create a new game, or join an existing one.";
export const GAME_OVER_MODAL_WAIT = "Or wait for the host to restart the game";
export const INVESTIGATE_MODAL_H = "Investigate Loyalty";
export const INVESTIGATE_MODAL_P1 =
  "Choose a player and investigate their party alignment. You'll learn if the player is a member of the Fascist or Liberal party, but not their specific role (e.g., Hitler).";
export const INVESTIGATE_MODAL_P2 =
  "Players that have been investigated once cannot be investigated again.";
export const INVESTIGATE_MODAL_P3 =
  "(Remember that you can lie about the player's party alignment!)";
export const ROLE_MODAL_LIBERAL_P1 =
  "You win if the board fills with liberal policies, or if Hitler is executed.";
export const ROLE_MODAL_LIBERAL_P2 =
  "You lose if the board fills with fascist policies, or if Hitler is elected chancellor after 3 fascist policies are passed.";
export const ROLE_MODAL_LIBERAL_P3 =
  "Keep your eyes open and look for suspicious actions. Suss out Hitler, and remember that anyone might be lying!";
export const ROLE_MODAL_FASCIST_P1 =
  "You win if Hitler is successfully elected chancellor once 3 fascist policies are on the board, or if the board fills with fascist policies.";
export const ROLE_MODAL_FASCIST_P2 =
  "You lose if the board fills with liberal policies or if Hitler is executed.";
export const ROLE_MODAL_FASCIST_P3 =
  "Keep suspicion off of Hitler and look for ways to throw confusion into the game.";
export const ROLE_MODAL_HITLER_P1 =
  "You win if you are successfully elected chancellor once 3 fascist policies are on the board, or if the board fills with fascist policies.";
export const ROLE_MODAL_HITLER_P2 =
  "You lose if the board fills with liberal policies or if you are executed.";
export const ROLE_MODAL_HITLER_P3 =
  "Try to gain trust and rely on the other fascists to open opportunities for you.";
export const INVESTIGATE_RESULT_MODAL_H = "Investigation Result";
export const NOMINATE_CHANCELLOR_MODAL_H =
  "You are the President. Pick a Chancellor:";
export const PEEK_MODAL_H = "Presidential Power: Peek";
export const POLICY_ENACTED_MODAL_H = "Policy enacted";
export const PORTRAIT_MODAL_H = "Choose a Portrait";
export const PRESIDENT_HAND_MODAL_H = "President hand";
export const PRESIDENT_HAND_MODAL_P1 =
  "Select a policy to discard. The remaining cards will be given to the Chancellor.";
export const PROPOSE_VETO_MODAL_H = "Propose Veto";
export const PROPOSE_VETO_MODAL_P1 =
  "has proposed a veto. You can oblige or reject the request. Obliging the request will move the election tracker up one stage. Rejecting the request will force the Chancellor to play his/her hand.";
export const SPECIAL_ELECTION_MODAL_H = "Special Election";
export const SPECIAL_ELECTION_MODAL_P1 =
  "Choose a player to be elected to President without any votes. The presidential round order will continue from where it left off. This means if you pick a player who's next in line to be President, he will get to be president twice in a row.";
export const UNLOCKED_VETO_MODAL_H = "Veto Unlocked";
export const UNLOCKED_VETO_MODAL_P1 =
  "Veto power has been unlocked. From here on out, if the Chancellor doesn't want to play his hand, he/she can request the President to veto the legislation.";
export const UNLOCKED_VETO_MODAL_P2 =
  "If the President agrees, the government falls and the election tracker moves up a stage. If the President disagrees, the Chancellor must play the hand he/she received.";
export const VOTING_MODAL_H = "Voting";
export const VOTING_MODAL_P1 =
  "Vote on whether you want this government to proceed; The vote passes if over 50% of the votes are yes.";
