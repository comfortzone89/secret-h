import React from "react";
import Modal from "../templates/Modal";
import Image from "next/image";
import Button from "../templates/Button";
import { useGameStore } from "../../store/game";
import { motion } from "framer-motion";
import {
  ELECTION_TRACKER_MODAL_H,
  ELECTION_TRACKER_MODAL_P1,
  ELECTION_TRACKER_MODAL_P2,
} from "../../constants";

const ElectionTrackerModal: React.FC = () => {
  const { gameInstance, handleElectionTrackerModalClose } = useGameStore();

  const electionTracker = gameInstance?.electionTracker;

  let startingPoint = "";
  let endingPoint = "";
  switch (electionTracker) {
    case 1:
      startingPoint = "17.7%";
      endingPoint = "36.8%";
      break;

    case 2:
      startingPoint = "36.8%";
      endingPoint = "55.9%";
      break;

    case 3:
      startingPoint = "55.9%";
      endingPoint = "75%";
  }

  return (
    <Modal modal="election_tracker" className="bg-black" allowMinimize={false}>
      <h2 className="text-xl mb-4 text-center">{ELECTION_TRACKER_MODAL_H}</h2>
      <p className="mb-4">{ELECTION_TRACKER_MODAL_P1}</p>
      <p className="mb-4">{ELECTION_TRACKER_MODAL_P2}</p>
      <div className="relative mb-4">
        <Image
          src="/images/board-election-tracker.png"
          alt="Election Tracker Board"
          width={400}
          height={100}
          className="w-full"
        />
        <motion.div
          initial={{ left: startingPoint }}
          animate={{ left: endingPoint }}
          transition={{ duration: 1.4, delay: 0.3, ease: "easeInOut" }}
          className="w-[7.5%] aspect-[1/1] absolute top-[50%]"
        >
          <Image
            src="/images/board-tracker.png"
            alt="Election Tracker"
            className="object-contain"
            fill
          />
        </motion.div>
      </div>
      <div className="flex justify-center">
        <Button onClick={handleElectionTrackerModalClose}>Okay</Button>
      </div>
    </Modal>
  );
};

export default ElectionTrackerModal;
