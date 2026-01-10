"use client";

import { useState } from "react";
import { clsx } from "clsx";

interface MenuItem {
  label: string;
  link: string;
  target?: string;
}

interface MenuProps {
  items: MenuItem[];
}

const Menu: React.FC<MenuProps> = ({ items }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative inline-block group"
      onClick={() => setOpen((v) => !v)}
    >
      <span className="cursor-pointer px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium select-none">
        Menu
      </span>

      <div
        className={clsx(
          "absolute mt-2 w-40 rounded-xl bg-amber-600 shadow-lg ring-1 ring-black/20 transition overflow-hidden z-10",
          // mobile click
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none",
          // desktop hover
          "group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto"
        )}
      >
        <ul className="py-1">
          {items.map((item, i) => (
            <li key={i}>
              <a
                href={item.link}
                target={item.target ? item.target : ""}
                onClick={() => {
                  setOpen(false);
                }}
                className="w-full text-left block px-4 py-2 text-sm text-gray-200 hover:bg-amber-500 transition cursor-pointer"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Menu;
