// lib/game/Game
// runtime values (must exist at runtime)
import { powersTableFor } from "../helpers/index.js";

// type-only imports (erased at runtime)
import type {
  Player,
  ExecutivePowerName,
  MilestoneInfo,
  GamePhase,
  Modal,
  Policy,
  StatusBanner,
  Vote,
  Party,
  WinReason,
} from "../types/index.js";

/* ---------- Game class ---------- */

export class Game {
  /* Players and round bookkeeping */
  id: string;
  hostId: string;
  players: Player[];
  round = 0;
  currentPhase: GamePhase = null;
  currentModal: string | null = "role";
  statusBanner: StatusBanner = { text: "---", loading: false };
  showVotes: boolean = false;
  presidentialPower: ExecutivePowerName = null;
  presidentInvestigation: number | null = null;
  lastExecutedPlayer: number | null = null;

  /* Tracks */
  liberalPolicies = 0; // 0..5
  fascistPolicies = 0; // 0..6
  electionTracker = 0; // failed governments 0..3
  vetoUnlocked = false;

  /* Deck (ordered): top of deck = index 0 */
  drawPile: Policy[] = [];
  discardPile: Policy[] = [];
  enactedPolicies: Policy[] = []; // historical order

  /* Government & term limits */
  currentPresidentIndex: number | null = null;
  currentChancellorIndex: number | null = null;
  lastGovernment = {
    presidentId: null as number | null,
    chancellorId: null as number | null,
  };
  specialElectionNextPresidentId: number | null = null;
  previousPresidentialOrder: number | null = null;
  failedToElectGovernment: boolean = false;
  gameWon: Party | null = null;
  winReason: WinReason = null;
  playerLeft: boolean = false;

  /* Legislative temporary hands */
  presidentHand: Policy[] = [];
  chancellorHand: Policy[] = [];

  /* Veto negotiation state (used during Legislative_Chancellor) */
  chancellorProposedVeto = false;

  constructor(
    id: string,
    hostId: string,
    lobbyPlayers: Player[],
    playersId?: string[]
  ) {
    this.id = id;
    this.hostId = hostId;
    this.players = lobbyPlayers.map((p) => ({
      id: p.id,
      permaId: p.permaId,
      name: p.name,
      portrait: p.portrait,
      role: undefined,
      party: undefined,
      alive: true,
      vote: null,
      modal: "role",
      modalConfirm: false,
      phase: null,
      statusBanner: { text: "---", loading: false },
      endTerm: false,
    }));

    this.assignRoles(playersId);
    this.resetFullDeckAndShuffle();
  }

  /* ---------------- Deck management ---------------- */

  /** Create standard 17-card deck (11 fascist, 6 liberal) and shuffle */
  resetFullDeckAndShuffle() {
    this.drawPile = [
      ...Array<Policy>(11).fill("fascist"),
      ...Array<Policy>(6).fill("liberal"),
    ];
    this.shuffleInPlace(this.drawPile);
    this.discardPile = [];
    this.enactedPolicies = [];
  }

  private shuffleInPlace(cards: Policy[]) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }

  /* ---------------- Round & Phase control ---------------- */

  setChancellor(chancellorId: number | null) {
    this.currentChancellorIndex = chancellorId;
  }

  /** Nominate a chancellor (called by president) */
  nominateChancellor(chancellorId: number) {
    this.setChancellor(chancellorId);
    this.currentPhase = "voting";
    this.currentModal = null;
  }

  /** Get MilestoneInfo for a fascist slot 1..5 (slot 6 is game-end) */
  getMilestoneInfoAt(slot: number): MilestoneInfo | null {
    if (slot < 1 || slot > 5) return null;
    const table = powersTableFor(this.players.length);
    return table[slot] ?? null;
  }

  /** Get the milestone info for the most recently enacted fascist policy (if any) */
  getCurrentMilestoneInfo(): MilestoneInfo | null {
    const slot = this.fascistPolicies;
    if (slot < 1 || slot > 5) return null;
    return this.getMilestoneInfoAt(slot);
  }

  /** Advance president to next alive player or apply special election target if present */
  advancePresidentForNextRound(): void {
    if (this.currentPresidentIndex === null) {
      this.currentPresidentIndex = 0;
    } else {
      this.players[this.currentPresidentIndex].endTerm = false;
      // If Special Election
      if (this.specialElectionNextPresidentId !== null) {
        const currentPresident = this.currentPresidentIndex;

        // Store current President for later use
        this.previousPresidentialOrder = currentPresident;

        // Set new President from Special Election
        this.setPresident(this.specialElectionNextPresidentId);

        // Reset Special Election event
        this.specialElectionNextPresidentId = null;
        return;
      }

      // If Special Election ended
      if (this.previousPresidentialOrder !== null) {
        // Restore the Presidential order
        this.setPresident(this.previousPresidentialOrder);
        this.previousPresidentialOrder = null;
        this.advancePresidentForNextRound();
        return;
      }

      const playersLength = this.players.length - 1;
      if (this.currentPresidentIndex === playersLength) {
        this.currentPresidentIndex = null;
        this.advancePresidentForNextRound();
      } else {
        this.currentPresidentIndex++;
        if (this.players[this.currentPresidentIndex].alive === false) {
          this.advancePresidentForNextRound();
        }
      }
    }
  }

  assignRoles(playersId: string[] | undefined) {
    const total = this.players.length;

    // Determine number of fascists (including Hitler)
    let totalFascists = 0;
    if (total <= 6) totalFascists = 2; // 5–6 players: 1 fascist + Hitler
    else if (total <= 8) totalFascists = 3; // 7–8 players: 2 fascists + Hitler
    else totalFascists = 4; // 9–10 players: 3 fascists + Hitler

    // Create an array of roles
    const roles: {
      role: "hitler" | "fascist" | "liberal";
      party: "fascist" | "liberal";
    }[] = [];

    // Add Hitler
    roles.push({ role: "hitler", party: "fascist" });

    // Add remaining fascists
    for (let i = 1; i < totalFascists; i++) {
      roles.push({ role: "fascist", party: "fascist" });
    }

    // Add liberals
    while (roles.length < total) {
      roles.push({ role: "liberal", party: "liberal" });
    }

    // Shuffle roles
    const shuffledRoles = roles.sort(() => Math.random() - 0.5);

    // Assign shuffled roles back to players
    const shuffledPlayers = [...this.players].sort(() => Math.random() - 0.5);
    shuffledPlayers.forEach((p, i) => {
      p.role = shuffledRoles[i].role;
      p.party = shuffledRoles[i].party;
    });

    // Shuffle again so no one can infer based on order
    this.players = shuffledPlayers.sort(() => Math.random() - 0.5);
    this.players.forEach((_, i) => {
      this.players[i].index = i;
    });

    // Manual order
    if (playersId) {
      const playerMap = new Map(this.players.map((p) => [p.id, p]));

      this.players = playersId
        .map((id) => playerMap.get(id))
        .filter((p): p is (typeof this.players)[number] => Boolean(p));

      this.players.forEach((player, index) => {
        player.index = index;
      });
    }
  }

  setModal(playerIndex: number, modal: Modal) {
    this.players[playerIndex].modal = modal;

    if (modal === "voting") {
      if (!this.players[playerIndex].alive) {
        this.players[playerIndex].modal = null;
      }
      this.setStatusBanner(playerIndex, "Tallying votes...", true);
    }

    if (modal === "election_tracker") {
      this.resetVotes();
    }
  }

  setModalAll(modal: Modal) {
    this.players.map((p) => (p.modal = modal));
    if (modal === "voting") {
      this.players.map((p) => {
        if (!p.alive) {
          p.modal = null;
        }
      });
      this.setStatusBannerAll("Tallying votes...", true);
    }

    if (modal === "election_tracker") {
      this.resetVotes();
    }
  }

  setPhase(playerIndex: number, phase: GamePhase) {
    if (phase === "legislative_session") {
      const checkWin = this.checkWin();
      if (checkWin) {
        return;
      }
    }
    this.players[playerIndex].phase = phase;
  }

  setPhaseAll(phase: GamePhase): void {
    this.players.map((p) => (p.phase = phase));
  }

  voteFailed() {
    if (this.electionTracker != null) {
      this.electionTracker++;
      this.failedToElectGovernment = true;
    }
  }

  setStatusBanner(playerIndex: number, text: string, loading: boolean = false) {
    this.players[playerIndex].statusBanner = { text, loading };
  }

  setStatusBannerAll(text: string, loading: boolean = false) {
    this.players.map((p) => (p.statusBanner = { text, loading }));
  }

  setVote(playerIndex: number, vote: Vote) {
    this.players[playerIndex].vote = vote;
  }

  resetVotes() {
    this.players.map((p) => (p.vote = null));
    this.showVotes = false;
  }

  replenishFromDiscardIfNeeded() {
    if (this.drawPile.length < 3) {
      this.drawPile = [...this.drawPile, ...this.discardPile];
      this.discardPile = [];
      this.shuffleInPlace(this.drawPile);
    }
  }

  presidentDrawCards() {
    const cards = this.drawPile.splice(0, 3);
    this.setPresidentHand(cards);
  }

  setPresidentHand(cards: Policy[] = []) {
    this.presidentHand = cards;
  }

  setChancellorHand(cards: Policy[] = []) {
    this.chancellorHand = cards;
  }

  setPresidentDiscard(discard: number) {
    const discardedPolicy = this.presidentHand[Number(discard)];
    const remainingCards = this.presidentHand.filter(
      (_, i) => i !== Number(discard)
    );
    this.setChancellorHand(remainingCards);
    this.setPresidentHand([]);
    this.discardPolicy(discardedPolicy);
  }

  discardPolicy(card: Policy) {
    this.discardPile = [...this.discardPile, card];
  }

  enactPolicy(policy: Policy) {
    this.enactedPolicies = [...this.enactedPolicies, policy];
    if (policy === "liberal") {
      this.liberalPolicies++;
    } else {
      this.fascistPolicies++;
    }

    this.replenishFromDiscardIfNeeded();
  }

  drawAndEnactPolicy(): void {
    const policyName = this.drawPile.splice(0, 1)[0];
    this.enactPolicy(policyName);
    this.setStatusBannerAll(
      `Policy enacted: ${
        policyName.charAt(0).toUpperCase() + policyName.slice(1)
      }`
    );
  }

  setChancellorEnact(policyIndex: number) {
    const policy: Policy = this.chancellorHand[policyIndex];
    const discardedPolicy = this.chancellorHand.find(
      (_, index) => index !== policyIndex
    );
    this.setChancellorHand([]);

    if (!discardedPolicy) {
      throw new Error("Expected exactly 2 policies in chancellor hand");
    }

    this.discardPolicy(discardedPolicy);
    this.enactPolicy(policy);
  }

  setModalConfirm(playerIndex: number) {
    this.players[playerIndex].modalConfirm = true;
  }

  resetModalConfirm(): void {
    this.players.map((p) => (p.modalConfirm = false));
  }

  checkModalConfirm(): boolean {
    const alivePlayers = this.players.filter((p) => p.alive);
    const allConfirmed = alivePlayers.every((p) => p.modalConfirm !== false);
    return allConfirmed;
  }

  setLastGovernment(
    presidentId: number | null,
    chancellorId: number | null
  ): void {
    this.lastGovernment = { presidentId, chancellorId };
  }

  setPresident(presidentIndex: number): void {
    this.currentPresidentIndex = presidentIndex;
  }

  startNewRound(): void {
    if (this.electionTracker < 3) {
      if (!this.failedToElectGovernment) {
        this.setLastGovernment(
          this.currentPresidentIndex,
          this.currentChancellorIndex
        );
      }
    } else {
      // Election tracker is at 3
      this.electionTracker = 0;
      this.setLastGovernment(null, null);
    }

    this.setPhaseAll("nomination");
    this.setStatusBannerAll("---");
    this.setModalAll(null);
    this.setPresidentHand([]);
    this.setChancellorHand([]);
    this.setChancellor(null);
    this.advancePresidentForNextRound();
    this.resetModalConfirm();
    this.chancellorProposedVeto = false;

    if (this.failedToElectGovernment) {
      this.failedToElectGovernment = false;
    }
  }

  /* HANDLERS */

  handleRoleModalClose(playerIndex: number): boolean {
    this.setModalConfirm(playerIndex);
    this.players[playerIndex].modal = null;

    const allConfirmed = this.checkModalConfirm();
    if (allConfirmed) {
      this.setPhaseAll("game_start");
      this.setStatusBannerAll("Game started!");
    } else {
      this.setStatusBanner(
        playerIndex,
        "Waiting for other players to start the game...",
        true
      );
    }

    return allConfirmed;
  }

  handleNominateChancellorModalClose(chancellorId: number): void {
    this.nominateChancellor(chancellorId);
    this.setModalAll(null);
    this.setPhaseAll("voting");
    this.setStatusBannerAll("---");
  }

  handleVoteModalClose(playerIndex: number, vote: Vote): boolean {
    this.setVote(playerIndex, vote);
    this.setModal(playerIndex, null);

    const alivePlayers = this.players.filter((p) => p.alive);
    const allVoted = alivePlayers.every((p) => p.vote !== null);
    if (allVoted) {
      const yesVotes = this.players.filter((p) => p.vote === "yes").length;
      const noVotes = this.players.filter((p) => p.vote === "no").length;
      this.showVotes = true;
      this.setStatusBannerAll(
        `${yesVotes} - ${noVotes}: Vote ${
          yesVotes > noVotes ? "passed" : "failed"
        }`
      );

      if (yesVotes > noVotes) {
        this.setPhaseAll("vote_passed");
      } else {
        this.setPhaseAll("vote_failed");
        this.voteFailed();
      }
    }

    return allVoted;
  }

  handlePresidentHandModalClose(playerIndex: number, discard: number): void {
    this.setPresidentDiscard(discard);
    const chancellorIndex = this.currentChancellorIndex;
    this.setModal(playerIndex, null);
    this.setModal(chancellorIndex!, "chancellor_hand");
    this.setStatusBannerAll(
      "Waiting for Chancellor to enact a policy...",
      true
    );
  }

  handleChancellorHandModalClose(enact: number): void {
    this.setChancellorEnact(enact);

    if (this.checkWin(true)) return;

    const policyName = this.enactedPolicies[this.enactedPolicies.length - 1];
    this.setModalAll("policy_enacted");
    this.setStatusBannerAll(
      `Policy enacted: ${
        policyName.charAt(0).toUpperCase() + policyName.slice(1)
      }`
    );
  }

  handlePolicyEnactedModalClose(playerIndex: number) {
    this.setModal(playerIndex, null);
    const presidentialAction = this.getCurrentMilestoneInfo();

    if (
      presidentialAction &&
      presidentialAction?.power !== null &&
      this.enactedPolicies[this.enactedPolicies.length - 1] === "fascist"
    ) {
      this.setPhase(playerIndex, "presidential_power");
      if (this.currentPresidentIndex === playerIndex) {
        this.setStatusBanner(playerIndex, "Confirm your Presidential Power");
        this.presidentialPower = presidentialAction?.power;
        if (presidentialAction.unlocksVeto) {
          this.vetoUnlocked = true;
        }
      } else {
        this.setStatusBanner(
          playerIndex,
          "Waiting for President to make use of his Presidential power...",
          true
        );
      }
    } else {
      if (this.currentPresidentIndex === playerIndex) {
        this.players[this.currentPresidentIndex].endTerm = true;
        this.setStatusBanner(playerIndex, "End your term to continue");
      } else {
        this.setStatusBanner(
          playerIndex,
          "Waiting for President to end his term...",
          true
        );
      }
    }
  }

  handleElectionTrackerModalClose(playerIndex: number): boolean {
    if (this.electionTracker >= 3) {
      if (playerIndex === this.currentPresidentIndex) {
        this.drawAndEnactPolicy();
        this.setModalAll("policy_enacted");
        return true;
      } else {
        this.setStatusBanner(
          playerIndex,
          "Waiting for President to draw a card from the top of the deck and play it...",
          true
        );
        this.setModal(playerIndex, null);
      }
    } else {
      this.setModal(playerIndex, null);
      this.players[this.currentPresidentIndex!].endTerm = true;
      this.failedToElectGovernment = true;
      if (this.currentPresidentIndex === playerIndex) {
        this.setStatusBanner(playerIndex, "End your term to continue");
      } else {
        this.setStatusBanner(
          playerIndex,
          "Waiting for President to end his term...",
          true
        );
      }
    }

    return false;
  }

  handlePeekModalClose(playerIndex: number): void {
    this.setModal(playerIndex, null);
    this.players[playerIndex].endTerm = true;
  }

  handleInvestigateModalClose(playerIndex: number): void {
    this.presidentInvestigation = playerIndex;
    this.setModalAll("investigateResult");
  }

  handleInvestigateResultModalClose(playerIndex: number): void {
    if (this.currentPresidentIndex === playerIndex) {
      this.presidentInvestigation = null;
      this.players[playerIndex].endTerm = true;
      this.setStatusBanner(playerIndex, "End your term to continue");
    } else {
      this.setStatusBanner(
        playerIndex,
        "Waiting for President to end his term...",
        true
      );
    }
    this.setModal(playerIndex, null);
  }

  handleSpecialElectionModalClose(newPresidentIndex: number): void {
    this.specialElectionNextPresidentId = newPresidentIndex;
    this.startNewRound();
  }

  handleExecutionModalClose(playerIndex: number): void {
    this.players[playerIndex].alive = false;
    this.lastExecutedPlayer = playerIndex;
    if (this.checkWin()) return;
    this.setModalAll("executionResult");
  }

  handleExecutionResultModalClose(playerIndex: number): void {
    if (this.vetoUnlocked) {
      this.setModal(playerIndex, "vetoUnlock");
      this.setStatusBanner(playerIndex, "Veto power has been unlocked!");
    } else {
      this.setModal(playerIndex, null);
      if (this.currentPresidentIndex === playerIndex) {
        this.players[playerIndex].endTerm = true;
        this.setStatusBanner(playerIndex, "End your term to continue");
      } else {
        this.setStatusBanner(
          playerIndex,
          "Waiting for President to end his term...",
          true
        );
      }
    }
  }

  handleVetoUnlockedModalClose(playerIndex: number): void {
    this.setModal(playerIndex, null);
    if (this.currentPresidentIndex === playerIndex) {
      this.players[playerIndex].endTerm = true;
      this.setStatusBanner(playerIndex, "End your term to continue");
    } else {
      this.setStatusBanner(
        playerIndex,
        "Waiting for President to end his term...",
        true
      );
    }
  }

  handleShowPresidentHand(playerIndex: number): void {
    if (playerIndex === this.currentPresidentIndex) {
      this.presidentDrawCards();
      this.setModal(playerIndex, "president_hand");
      this.setStatusBanner(playerIndex, "Select a card to discard.");
    } else {
      this.setStatusBanner(
        playerIndex,
        "Waiting for President to select a policy to discard...",
        true
      );
    }

    this.resetVotes();
  }

  handleVeto(playerIndex: number): void {
    this.chancellorProposedVeto = true;
    this.setModal(playerIndex, null);
    const presidentIndex = this.currentPresidentIndex;
    this.setModal(presidentIndex!, "vetoProposed");
    this.setStatusBannerAll(
      "Chancellor proposed a veto! Waiting for President to take action...",
      true
    );
  }

  handleProposeVetoModalClose(playerIndex: number, oblige: boolean): void {
    if (oblige) {
      this.voteFailed();
      this.setModalAll("election_tracker");
    } else {
      this.setModal(playerIndex, null);
      const chancellorIndex = this.currentChancellorIndex;
      this.setModal(chancellorIndex!, "chancellor_hand");
    }
  }

  handleEndTerm(): void {
    this.startNewRound();
  }

  handleShowAffiliationModal(playerIndex: number, show: boolean): void {
    if (show) {
      this.players[playerIndex].modal = "showAffiliation";
    } else {
      this.players[playerIndex].modal = null;
    }
  }

  /* ---------------- Win checks ---------------- */

  checkWin(justPassedPolicy = false): boolean {
    if (this.liberalPolicies >= 5) {
      this.setModalAll("gameOver");
      this.gameWon = "liberal";
      this.winReason = "policy";
      return true;
    }

    if (this.fascistPolicies >= 6) {
      this.setModalAll("gameOver");
      this.gameWon = "fascist";
      this.winReason = "policy";
      return true;
    }

    const hitler = this.players.find((p) => p.role === "hitler");
    if (hitler && !hitler.alive) {
      this.setModalAll("gameOver");
      this.gameWon = "liberal";
      this.winReason = "hitlerExecuted";
      return true;
    }

    // Hitler zone victory check
    if (!justPassedPolicy) {
      if (
        this.fascistPolicies >= 3 &&
        this.players[this.currentChancellorIndex!].role === "hitler"
      ) {
        this.setModalAll("gameOver");
        this.gameWon = "fascist";
        this.winReason = "hitlerElected";
        return true;
      }
    }

    return false;
  }
}
