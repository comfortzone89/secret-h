import React, { useState } from "react";
import Modal from "../templates/Modal";
import Image from "next/image";
import Button from "../templates/Button";
import PlayerContainer from "../templates/PlayerContainer";
import { useGameStore } from "../../store/game";
import { Vote } from "../../server/types";
import clsx from "clsx";
import { VOTING_MODAL_H, VOTING_MODAL_P1 } from "../../constants";

const VotingModal: React.FC = () => {
  const { gameInstance, handleVoteModalClose } = useGameStore();

  const [selectedVote, setSelectedVote] = useState<Vote | null>(null);

  const chancellorIndex = gameInstance?.currentChancellorIndex;
  const chancellor = gameInstance?.players[chancellorIndex!];
  const chancellorName = chancellor?.name;
  const presidentIndex = gameInstance?.currentPresidentIndex;
  if (presidentIndex === null || gameInstance === null) return;
  const presidentName = gameInstance?.players[presidentIndex!].name;

  return (
    <Modal modal="voting" className="bg-black">
      <h2 className="text-xl font-bold uppercase mb-5">{VOTING_MODAL_H}</h2>
      <div className="flex gap-5 mb-4">
        <div>
          <PlayerContainer player={chancellor} />
        </div>
        <div className="flex-1">
          <p className="mb-4">
            {presidentName} has nominated {chancellorName} as chancellor
          </p>
          <p>{VOTING_MODAL_P1}</p>
        </div>
      </div>
      <div className="flex justify-center gap-10">
        <button
          className={clsx(
            "rounded-xl p-1 cursor-pointer",
            selectedVote === "yes" ? "bg-amber-500" : ""
          )}
          onClick={() => setSelectedVote("yes")}
          value="yes"
        >
          <Image
            src="/images/vote-yes.png"
            alt="Vote Yes"
            width={200}
            height={100}
            className="w-[25vmin]"
          />
        </button>
        <button
          className={clsx(
            "rounded-xl p-1 cursor-pointer",
            selectedVote === "no" ? "bg-amber-500" : ""
          )}
          onClick={() => setSelectedVote("no")}
          value="no"
        >
          <Image
            src="/images/vote-no.png"
            alt="Vote No"
            width={200}
            height={100}
            className="w-[25vmin]"
          />
        </button>
      </div>
      <div className="mt-5 flex justify-center">
        <Button
          disabled={selectedVote === null}
          onClick={() => {
            if (selectedVote !== null) {
              handleVoteModalClose(selectedVote);
            }
          }}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default VotingModal;
