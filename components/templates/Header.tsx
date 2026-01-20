"use client";

// import { socket } from "@/socket/socket";
// import Button from "./Button";
import Menu from "./Menu";

export default function Header() {
  // const handleLeaveGame = () => {
  //   socket.disconnect();
  // };

  return (
    <header className="p-5 bg-amber-900 text-4xl text-white font-bold text-center h-[80px] flex items-center justify-center fixed top-0 w-full z-20">
      <div className="absolute left-5 text-start">
        <Menu
          items={[
            { label: "Home", link: "/" },
            { label: "How to play?", link: "/how-to-play" },
            { label: "Credits", link: "/credits" },
          ]}
        />
      </div>

      <div className="text-center">
        <h1>Secret Hitler</h1>
      </div>
      {/* <div className="text-end hidden md:block">
        <Button onClick={handleLeaveGame}>Leave Game</Button>
      </div> */}
    </header>
  );
}
