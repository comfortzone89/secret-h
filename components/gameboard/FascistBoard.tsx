"use client";
import { useGameStore } from "@/store/game";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const FascistBoard: React.FC = () => {
  const { gameInstance } = useGameStore();

  const policies = gameInstance?.fascistPolicies ?? 0;
  const playersLength = gameInstance?.players.length ?? 5;

  const cards = Array.from({ length: policies }, (_, i) => ({
    key: `fascist-${i}`,
    src: "/images/board-policy-fascist.png",
    left: 9 + i * 11,
  }));

  return (
    <div className="relative">
      {/* Fascist board background, dynamic by player count */}
      <Image
        src={`/images/board-fascist-${
          playersLength <= 6 ? "5-6" : playersLength <= 8 ? "7-8" : "9-10"
        }.png`}
        alt="Fascist Board"
        width={500}
        height={100}
        className="w-[80vmin]"
      />

      {/* Policies */}
      <AnimatePresence>
        {cards.map((card) => (
          <motion.div
            key={card.key}
            className="absolute bottom-[50%] translate-y-1/2 w-[7vmin]"
            style={{ left: `${card.left}vmin` }}
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
