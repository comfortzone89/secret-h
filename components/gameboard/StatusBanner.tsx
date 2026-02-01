"use client";

import clsx from "clsx";
import { useGameStore } from "../../store/game";
import React from "react";

const StatusBanner: React.FC = () => {
  const { getMe } = useGameStore();
  const me = getMe();

  const statusBanner = me?.statusBanner;

  return (
    <div className="status-banner bg-black text-center p-[6px] md:p-[1.5rem]">
      <span
        className={clsx(
          "text-sm md:text-base",
          statusBanner?.loading ? "animate-flicker" : ""
        )}
      >
        {statusBanner?.text}
      </span>
    </div>
  );
};

export default StatusBanner;
