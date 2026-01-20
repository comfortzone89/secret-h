import Image from "next/image";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Player, Vote } from "../../server/types";
import { useGameStore } from "../../store/game";
import { useState } from "react";

interface PlayerContainerProps {
  player?: Player; // after initialized
  portrait?: string; // before initialized
  name?: string; // optional name (for before Player exists)
  index?: number;
  currentChancellor?: number | null;
  currentPresident?: number | null;
  className?: string;
  me?: Player;
  vote?: Vote;
  maxPlayers?: number;
  highlight?: boolean;
  checkTermLimits?: boolean;
  showRoles?: boolean;
}

const PlayerContainer: React.FC<PlayerContainerProps> = ({
  player,
  portrait,
  name,
  index,
  currentChancellor,
  currentPresident,
  className,
  me,
  vote,
  maxPlayers = 10,
  highlight = false,
  checkTermLimits = false,
  showRoles = false,
}) => {
  const { gameInstance } = useGameStore();
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  // --- Branch: Before initialized (lobby or picking portrait) ---
  if (!player) {
    return (
      <div className={clsx("flex flex-col items-center relative", className)}>
        <Image
          src="/images/player-base.png"
          alt="Player Portrait"
          priority={true}
          width={120}
          height={120}
          className="w-auto"
        />

        {portrait && (
          <Image
            src={portrait}
            alt={name ?? "Unassigned"}
            width={100}
            height={60}
            className="absolute top-[10px] w-[82%]"
          />
        )}

        {name && (
          <p className="text-lg m-0 text-black font-medium absolute bottom-8">
            {name}
          </p>
        )}
      </div>
    );
  }

  // --- Branch: After initialized (full Player object) ---
  // still show player even if "me" is missing,
  // just skip role-visibility logic
  let canSeeRole = false;
  if (!showRoles) {
    if (me) {
      if (me.id === player.id) {
        canSeeRole = true;
      } else if (me.role === "fascist") {
        canSeeRole = player.role === "fascist" || player.role === "hitler";
      } else if (me.role === "hitler") {
        if (maxPlayers <= 6) {
          canSeeRole = player.role === "fascist";
        }
      }
    }
  } else {
    canSeeRole = true;
  }

  const showVotes = gameInstance?.showVotes;
  const voteVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15, // stagger only for entrance
        duration: 0.4,
      },
    }),
    exit: {
      opacity: 0,
      y: 0, // stays in place
      transition: {
        duration: 0.3,
      },
    },
  };

  let checkTermLimitForPresident = true;
  const alivePlayers = gameInstance?.players.filter((p) => p.alive === true);

  if (alivePlayers) {
    if (alivePlayers.length <= 5) {
      checkTermLimitForPresident = false;
    }
  } else {
    checkTermLimitForPresident = false;
  }

  return (
    <div className="relative">
      {player.alive === false ? (
        <div className="uppercase text-[4vmin] font-bold absolute left-[50%] -translate-x-1/2 top-[20%]">
          Dead
        </div>
      ) : (
        checkTermLimits &&
        (player.index === gameInstance?.lastGovernment.chancellorId ||
          (checkTermLimitForPresident &&
            player.index === gameInstance?.lastGovernment.presidentId)) && (
          <div className="uppercase text-[4vmin] font-bold absolute left-[50%] -translate-x-1/2 top-[20%] leading-8 z-10">
            Term Limit
          </div>
        )
      )}

      <div
        className={clsx(
          "flex flex-col items-center relative",
          className,
          highlight ? "bg-amber-500 rounded-xl" : "",
          player.alive === false ||
            (checkTermLimits &&
              (player.index === gameInstance?.lastGovernment.chancellorId ||
                (checkTermLimitForPresident &&
                  player.index === gameInstance?.lastGovernment.presidentId)))
            ? "opacity-30"
            : ""
        )}
      >
        <p className="m-0 text-center absolute top-[-20px]">
          {currentChancellor != null &&
            currentChancellor === index &&
            "Chancellor"}
          {currentPresident != null &&
            currentPresident === index &&
            "President"}
        </p>
        <AnimatePresence>
          {vote === "yes" && showVotes && (
            <motion.div
              key={`yes-${index}`}
              custom={index}
              variants={voteVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="yea z-10 absolute w-[75%] h-[20%] top-[40%]"
            >
              <Image src="/images/player-icon-ja.png" alt="Yea" fill />
            </motion.div>
          )}

          {vote === "no" && showVotes && (
            <motion.div
              key={`no-${index}`}
              custom={index}
              variants={voteVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="nay z-10 absolute w-[75%] h-[20%] top-[40%]"
            >
              <Image src="/images/player-icon-nein.png" alt="Yea" fill />
            </motion.div>
          )}
        </AnimatePresence>

        <Image
          src="/images/player-base.png"
          alt="Player Portrait"
          width={256}
          height={366}
          className="w-[25vmin] [@media(max-width:700px)]:[@media(max-height:400px)]:w-[12vmax] [@media(max-height:600px)]:w-[6vmax] md:w-[15vmin] h-auto"
          onLoad={() => setImageLoaded(true)}
        />

        {imageLoaded && (
          <>
            <Image
              src={player.portrait}
              alt={player.name}
              width={100}
              height={60}
              className="absolute top-[6.3%] w-[82%]"
            />

            <p className="text-base md:text-lg m-0 text-black font-medium absolute top-[64%]">
              {player.name}
            </p>
          </>
        )}

        {canSeeRole && player.role && (
          <div className="absolute flex items-center justify-center top-[78%]">
            <Image
              src={`/images/player-icon-${player.role}.png`}
              alt={player.role}
              width={50}
              height={50}
              className="w-[22%]"
            />
            <p
              className={clsx("capitalize text-sm md:text-lg", {
                liberal: player.role === "liberal",
                fascist: player.role === "fascist" || player.role === "hitler",
              })}
            >
              {player.role}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerContainer;
