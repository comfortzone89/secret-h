"use client";
import { useGameStore } from "../../store/game";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const LiberalBoard: React.FC = () => {
  const { gameInstance } = useGameStore();

  const policies = gameInstance?.liberalPolicies ?? 0;
  const electionTracker = gameInstance?.electionTracker ?? 0;

  const cards = Array.from({ length: policies }, (_, i) => ({
    key: `liberal-${i}`,
    src: "/images/board-policy-liberal.png",
    left: 18 + i * 13.8,
    // left: `calc(5vmin + ${i * 10.9}vmin)`,
  }));

  return (
    <div className="relative w-[800px] max-w-full">
      {/* Election tracker */}
      <Image
        src="/images/board-tracker.png"
        alt="Election Tracker"
        width={30}
        height={30}
        className="w-[3%] absolute bottom-[17%]"
        style={{ left: `${34.3 + electionTracker * 9.2}%` }}
      />

      {/* Board */}
      <Image
        src="/images/board-liberal.png"
        alt="Liberal Board"
        width={500}
        height={100}
        className="w-full"
      />

      {/* Policies */}
      <AnimatePresence>
        {cards.map((card) => (
          <motion.div
            key={card.key}
            className="absolute bottom-[50%] translate-y-1/2 w-[9%] md:w-[10%]"
            style={{ left: `${card.left}%` }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={card.src}
              alt="Liberal Policy Card"
              width={100}
              height={300}
              className="w-full"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default LiberalBoard;
