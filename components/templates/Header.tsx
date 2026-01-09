"use client";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="p-5 bg-amber-900 text-4xl text-white font-bold text-center h-[80px] flex items-center justify-center">
      <a href={pathname || "#"}>Secret Hitler</a>
    </header>
  );
}
