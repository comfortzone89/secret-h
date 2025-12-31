"use client";

import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255, 255, 255, 0)",
        zIndex: 9999,
      }}
    >
      <Loader2 className="animate-spin h-10 w-10 text-white-600" />
    </div>
  );
}
