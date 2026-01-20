import React from "react";
import PlayerContainer from "../templates/PlayerContainer";
import { useGameStore } from "../../store/game";
import { motion } from "framer-motion";

const Players: React.FC = () => {
  const { gameInstance, getMe } = useGameStore();
  const me = getMe();

  const players = gameInstance?.players;
  const maxPlayers = players?.length;
  const currentChancellor = gameInstance?.currentChancellorIndex;
  const currentPresident = gameInstance?.currentPresidentIndex;

  const containerVariants = {
    hidden: { opacity: 1 }, // parent stays visible
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // delay between votes
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex justify-center gap-2 md:gap-4 w-full bg-stone-800 flex-wrap"
    >
      {players?.map((p, i) => (
        <PlayerContainer
          key={i}
          index={i}
          player={p}
          me={me!}
          vote={p.vote}
          maxPlayers={maxPlayers}
          currentChancellor={currentChancellor}
          currentPresident={currentPresident}
          highlight={me?.index === p.index}
          className="mb-2"
        />
      ))}
    </motion.div>
  );
};

export default Players;
