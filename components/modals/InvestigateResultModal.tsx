import React from "react";
import Modal from "../templates/Modal";
import Image from "next/image";
import Button from "../templates/Button";
import { useGameStore } from "../../store/game";
import { motion } from "framer-motion";
import PlayerContainer from "../templates/PlayerContainer";
import { INVESTIGATE_RESULT_MODAL_H } from "../../constants";

const InvestigateResultModal: React.FC = () => {
  const { gameInstance, getMe, handleInvestigateResultModalClose } =
    useGameStore();
  const me = getMe();

  const investigatedPlayerIndex = gameInstance?.presidentInvestigation;
  const investigatedPlayer = gameInstance?.players[investigatedPlayerIndex!];
  const investigatedPlayerName = investigatedPlayer?.name;
  const investigatedPlayerParty = investigatedPlayer?.party;

  const presidentIndex = gameInstance?.currentPresidentIndex;
  if (presidentIndex === null || presidentIndex === undefined) return;
  const president = gameInstance?.players[presidentIndex];
  const presidentName = gameInstance?.players[presidentIndex].name;

  return (
    <Modal modal="investigateResult" className="bg-black" allowMinimize={false}>
      <h2 className="text-xl mb-4 text-center">{INVESTIGATE_RESULT_MODAL_H}</h2>
      {gameInstance?.currentPresidentIndex === me?.index && (
        <>
          <div className="flex justify-center mb-4 w-full">
            <div className="relative w-[28vmin] aspect-[500/713]">
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -180, opacity: 0 }}
                transition={{
                  rotateY: { duration: 1, delay: 1 },
                  opacity: { duration: 0, delay: 1.35 },
                }}
                className="absolute w-[28vmin] aspect-[500/713]"
              >
                <Image
                  src="/images/party-membership.png"
                  alt="Unknown Membership Card"
                  fill
                />
              </motion.div>
              <motion.div
                initial={{ rotateY: -180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{
                  rotateY: { duration: 1, delay: 1 },
                  opacity: { duration: 0, delay: 1.35 },
                }}
                className="absolute w-[28vmin] aspect-[500/713]"
              >
                <Image
                  src={`/images/party-membership-${investigatedPlayerParty}.png`}
                  alt={`${investigatedPlayerParty} Membership Card`}
                  fill
                />
              </motion.div>
            </div>
          </div>
          <p className="text-center mb-4">
            <span className="text-amber-600">{investigatedPlayerName}</span> is
            a member of the{" "}
            <span className="capitalize">{investigatedPlayerParty}</span> party
          </p>
        </>
      )}

      {investigatedPlayerIndex === me?.index && (
        <>
          <p className="text-center mb-4">
            You have been investigated by{" "}
            <span className="text-amber-600">{presidentName}</span>
          </p>
          <div className="flex justify-center mb-4">
            <PlayerContainer player={president} />
          </div>

          <p className="text-center mb-4">
            <span className="text-amber-600">{presidentName}</span> now knows
            your party membership.
          </p>
        </>
      )}

      {gameInstance?.currentPresidentIndex !== me?.index &&
        investigatedPlayerIndex !== me?.index && (
          <>
            <div className="flex justify-center mb-4">
              <PlayerContainer player={investigatedPlayer} />
            </div>

            <p className="text-center mb-4">
              <span className="text-amber-600">{investigatedPlayerName}</span>{" "}
              has been investigated by{" "}
              <span className="text-amber-600">{presidentName}</span>, who now
              knows the investigated player&apos;s party membership.
            </p>
          </>
        )}

      <div className="flex justify-center">
        <Button onClick={handleInvestigateResultModalClose}>Okay</Button>
      </div>
    </Modal>
  );
};

export default InvestigateResultModal;
