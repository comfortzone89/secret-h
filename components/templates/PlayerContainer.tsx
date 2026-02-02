import Image from "next/image";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "../../store/game";
import { useState } from "react";
import { Player, Vote } from "@/server/lib/game/GameTypes";

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
  showInvestigated?: boolean;
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
  showInvestigated = false,
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
            priority={true}
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
      } else if (me.role === "FASCIST") {
        canSeeRole = player.role === "FASCIST" || player.role === "HITLER";
      } else if (me.role === "HITLER") {
        if (maxPlayers <= 6) {
          canSeeRole = player.role === "FASCIST";
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

  const connected = player.connected;

  return (
    <div className="relative flex justify-center">
      {player.alive === false && (
        <div className="uppercase text-[2.8cqw] md:text-[1cqw] font-bold absolute left-[50%] -translate-x-1/2 top-[20%] z-10">
          Dead
        </div>
      )}
      {player.alive === true &&
        checkTermLimits &&
        (player.index === gameInstance?.lastGovernment.chancellorId ||
          (checkTermLimitForPresident &&
            player.index === gameInstance?.lastGovernment.presidentId)) && (
          <div className="uppercase text-[2.8cqw] md:text-[1cqw] font-bold absolute left-[50%] -translate-x-1/2 top-[20%] z-10">
            Term Limit
          </div>
        )}
      {showInvestigated && player.investigated && player.alive && (
        <div className="uppercase text-[2.8cqw] md:text-[1cqw] font-bold absolute left-[50%] -translate-x-1/2 top-[20%] z-10">
          Investigated
        </div>
      )}

      <div
        className={clsx(
          "flex flex-col items-center relative w-[20vmin] [@media(max-width:700px)]:[@media(max-height:400px)]:w-[12vmax] [@media(max-height:600px)]:w-[18vmin] md:w-[15vmin] h-auto",
          className,
          highlight ? "bg-amber-500 rounded-xl" : "",
          player.alive === false ||
            (checkTermLimits &&
              (player.index === gameInstance?.lastGovernment.chancellorId ||
                (checkTermLimitForPresident &&
                  player.index ===
                    gameInstance?.lastGovernment.presidentId))) ||
            (showInvestigated && player.investigated)
            ? "opacity-30"
            : ""
        )}
      >
        <p className="m-0 text-center absolute bottom-[97%] left-[50%] -translate-x-1/2 text-[3.2cqw] md:text-[1cqw]">
          {currentChancellor != null &&
            currentChancellor === index &&
            "Chancellor"}
          {currentPresident != null &&
            currentPresident === index &&
            "President"}
        </p>
        <AnimatePresence>
          {vote === "JA" && showVotes && (
            <motion.div
              key={`JA-${index}`}
              custom={index}
              variants={voteVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="yea z-10 absolute w-[75%] h-[20%] top-[40%]"
            >
              <Image
                src="/images/player-icon-ja.png"
                alt="Yea"
                fill
                sizes="(max-width: 768px) 15vw, 10vw"
              />
            </motion.div>
          )}

          {vote === "NEIN" && showVotes && (
            <motion.div
              key={`NEIN-${index}`}
              custom={index}
              variants={voteVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="nay z-10 absolute w-[75%] h-[20%] top-[40%]"
            >
              <Image
                src="/images/player-icon-nein.png"
                alt="Nay"
                fill
                sizes="(max-width: 768px) 15vw, 10vw"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Image
          src="/images/player-base.png"
          alt="Player Portrait"
          width={256}
          height={366}
          className="w-full"
          onLoad={() => setImageLoaded(true)}
          priority={true}
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

            <p className="text-[3.2cqw] md:text-[1cqw] m-0 text-black font-medium absolute top-[64%]">
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
              className={clsx("capitalize text-[3cqw] md:text-[1cqw]", {
                liberal: player.role === "LIBERAL",
                fascist: player.role === "FASCIST" || player.role === "HITLER",
              })}
            >
              {player.role}
            </p>
          </div>
        )}
        {!connected && (
          <div className="absolute -bottom-[12.5%] left-[50%] translate-x-[-50%] text-[3cqw] md:text-[0.8cqw]">
            Disconnected
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerContainer;
