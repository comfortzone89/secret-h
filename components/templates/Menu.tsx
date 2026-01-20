"use client";

import { MenuIcon } from "lucide-react";

interface MenuItem {
  label: string;
  link: string;
  target?: string;
}

interface MenuProps {
  items: MenuItem[];
}

const Menu: React.FC<MenuProps> = ({ items }) => {
  return (
    <div className="relative inline-block items-center group menu-group">
      <div className="menu-btn cursor-pointer md:px-4 py-2 rounded-xl md:bg-amber-600 text-white transition duration-200 group-hover:bg-amber-500">
        <span className="hidden md:inline-block">Menu</span>
        <span className="flex items-center justify-center md:hidden">
          <MenuIcon size={30} />
        </span>
      </div>

      <div
        className={
          "sub-menu left-0 absolute w-40 rounded-xl bg-amber-600 shadow-2xl transition pointer-events-none overflow-hidden"
        }
      >
        <ul>
          {items.map((item, i) => (
            <li key={i}>
              <a
                href={item.link}
                target={item.target}
                className="block px-4 py-3 text-sm text-white hover:bg-amber-500"
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
