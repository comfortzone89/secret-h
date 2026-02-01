"use client";

import { useState, useRef, useEffect } from "react";
import MenuList from "./MenuList";
import { MenuItem } from "@/react-types";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

interface MenuProps {
  items: MenuItem[];
}

const Menu: React.FC<MenuProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  /* Close menu when clicking outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={menuRef}
      className="relative flex font-[family-name:var(--font-roboto)]"
    >
      {/* Menu Button */}
      <button
        type="button"
        onClick={toggleMenu}
        className="cursor-pointer md:px-4 py-2 md:border-2 md:border-black md:bg-amber-600 text-white transition md:hover:bg-amber-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="hidden md:inline-block">Menu</span>
        <span className="flex items-center justify-center md:hidden">
          <div className="menu-toggle">
            <span className={clsx("bar", isOpen && "x")}></span>
            <span className={clsx("bar", isOpen && "x")}></span>
            <span className={clsx("bar", isOpen && "x")}></span>
          </div>
        </span>
      </button>

      {/* Top-level menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute -left-5 md:left-0 top-full w-[50vw] md:w-45 bg-amber-600 shadow-2xl/50 z-50"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{
              duration: 0.3,
            }}
          >
            <MenuList items={items} onItemClick={closeMenu} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Menu;
