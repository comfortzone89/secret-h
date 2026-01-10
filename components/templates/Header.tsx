"use client";

import Menu from "./Menu";

export default function Header() {
  return (
    <header className="p-5 bg-amber-900 text-4xl text-white font-bold text-center h-[80px] flex items-center justify-between fixed top-0 w-full z-20">
      <div className="w-[30%] text-start">
        <Menu
          items={[
            { label: "Home", link: "/" },
            { label: "How to play?", link: "/how-to-play" },
            { label: "Credits", link: "/credits" },
          ]}
        />
      </div>

      <div className="w-[70%] md:w-[40%] text-center">
        <h1>Secret Hitler</h1>
      </div>
      <div className="w-[30%] text-end hidden md:block"></div>
    </header>
  );
}
