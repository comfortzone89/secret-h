"use client";
import { useGameStore } from "../../store/game";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const FascistBoard: React.FC = () => {
  const { gameInstance, maxPlayers } = useGameStore();

  const policies = gameInstance?.fascistPolicies ?? 0;

  const cards = Array.from({ length: policies }, (_, i) => ({
    key: `fascist-${i}`,
    src: "/images/board-policy-fascist.png",
    left: 11.5 + i * 13.5,
  }));

  return (
    <div className="relative w-[800px] max-w-full">
      {/* Fascist board background, dynamic by player count */}
      <Image
        src={`/images/board-fascist-${
          maxPlayers <= 6 ? "5-6" : maxPlayers <= 8 ? "7-8" : "9-10"
        }.png`}
        alt="Fascist Board"
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
              alt="Fascist Policy Card"
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

export default FascistBoard;
