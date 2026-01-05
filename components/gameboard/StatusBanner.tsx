"use client";

import { useGameStore } from "../../store/game";
import React from "react";

const StatusBanner: React.FC = () => {
  const { getMe } = useGameStore();
  const me = getMe();

  const statusBanner = me?.statusBanner;

  return (
    <div className="bg-black text-center">
      <span className={statusBanner?.loading ? "animate-flicker" : ""}>
        {statusBanner?.text}
      </span>
    </div>
  );
};

export default StatusBanner;
