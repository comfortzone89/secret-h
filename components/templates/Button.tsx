import React from "react";
import clsx from "clsx";

export default function Button({
  children,
  className,
  onClick,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      className={clsx(
        "relative px-6 py-3 bg-amber-600 text-white rounded-xl shadow-theme hover:bg-amber-500 active:shadow-none! active:translate-y-[5px] transition-all cursor-pointer uppercase",
        className
      )}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
