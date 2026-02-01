"use client";

import React, { MouseEventHandler, useState } from "react";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import { MenuItem } from "@/react-types";
import { AnimatePresence, motion } from "framer-motion";

/* -----------------------------
   Type guards
------------------------------ */

const isLinkItem = (
  item: MenuItem
): item is Extract<MenuItem, { link: string }> => "link" in item;

const isActionItem = (
  item: MenuItem
): item is Extract<
  MenuItem,
  { onClick: MouseEventHandler<HTMLButtonElement> }
> => "onClick" in item;

/* -----------------------------
   Props
------------------------------ */

interface MenuListProps {
  items: MenuItem[];
  onItemClick?: () => void;
}

/* -----------------------------
   Component
------------------------------ */

const MenuList: React.FC<MenuListProps> = ({ items, onItemClick }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleSubMenu = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <ul className="min-w-full">
      {items.map((item, index) => {
        const hasSubMenu = Boolean(item.subMenu);
        const isOpen = openIndex === index;

        return (
          <li key={index} className="relative">
            {/* ───────────── LINK ITEM ───────────── */}
            {isLinkItem(item) && (
              <a
                href={item.link}
                onClick={onItemClick}
                className={clsx(
                  "flex items-center gap-2 px-4 py-3 text-sm text-white",
                  "md:hover:bg-amber-500 whitespace-nowrap",
                  hasSubMenu && "pr-10",
                  isOpen && "bg-amber-500"
                )}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>

                {hasSubMenu && (
                  <ChevronRight size={16} className="opacity-75" />
                )}
              </a>
            )}

            {/* ───────────── ACTION ITEM ───────────── */}
            {isActionItem(item) && (
              <button
                type="button"
                onClick={(e) => {
                  item.onClick(e);
                  onItemClick?.();
                }}
                className={clsx(
                  "w-full text-left flex items-center gap-2 px-4 py-3 text-sm text-white cursor-pointer",
                  "md:hover:bg-amber-500"
                )}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
              </button>
            )}

            {/* ───────────── CONTAINER ITEM (submenu only) ───────────── */}
            {!isLinkItem(item) && !isActionItem(item) && (
              <button
                type="button"
                onClick={() => toggleSubMenu(index)}
                className={clsx(
                  "w-full text-left flex items-center gap-2 px-4 py-3 text-sm text-white cursor-pointer",
                  "md:hover:bg-amber-500",
                  isOpen && "bg-amber-500"
                )}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>

                <ChevronRight
                  size={16}
                  className={clsx(
                    "transition-transform",
                    isOpen && "rotate-90"
                  )}
                />
              </button>
            )}

            {/* ───────────── SUB MENU ───────────── */}
            <AnimatePresence>
              {hasSubMenu && isOpen && (
                <motion.div
                  className="absolute top-0 left-full w-[50vw] md:w-45 bg-amber-600 shadow-2xl/50 z-50"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{
                    duration: 0.3,
                  }}
                >
                  <MenuList items={item.subMenu!} onItemClick={onItemClick} />
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
};

export default MenuList;
