"use client";
import { useGameStore } from "../../store/game";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const DrawPile: React.FC = () => {
  const { gameInstance } = useGameStore();
  const drawPileLength = gameInstance?.drawPile.length ?? 0;

  // Create cards from bottom → top
  const cards = Array.from({ length: drawPileLength }, (_, i) => ({
    key: `card-${i}`,
    src: "/images/board-policy.png",
    offset: `calc(24% + ${i * 0.6}vmin)`,
    order: i, // 0 = bottom, larger = closer to top
  }));

  return (
    <div className="relative">
      <Image
        src="/images/board-draw.png"
        priority={true}
        alt="Draw pile"
        width={100}
        height={300}
        className="w-[30vmin] md:w-[20vmin]"
      />

      <AnimatePresence>
        {cards.map((card) => (
          <motion.div
            key={card.key}
            className="absolute left-[50%] -translate-x-1/2 w-[17vmin] md:w-[14vmin]"
            style={{ bottom: card.offset }}
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{
              duration: 0.3,
              delay: card.order * 0.05, // stagger based on pile order
            }}
          >
            <Image
              src={card.src}
              alt="Policy Card"
              width={100}
              height={300}
              className="w-full"
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <span className="absolute bottom-2 w-full text-center text-[4.5vmin] md:text-[3.5vmin]">
        {drawPileLength}
      </span>
    </div>
  );
};

export default DrawPile;
