"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="p-5 bg-amber-900 text-4xl text-white font-bold text-center h-[80px] flex items-center justify-center">
      <Link href={pathname || "#"}>Secret Hitler</Link>
    </header>
  );
}
