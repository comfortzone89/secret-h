// app/layout
import Link from "next/link";
import "./globals.css";
import localFont from "next/font/local";
import { useEffect, useState } from "react";

const germania = localFont({
  src: "../public/fonts/GermaniaOne-Regular.ttf",
  variable: "--font-germania", // tailwind-friendly variable
  weight: "400",
});

export const metadata = {
  title: "Secret Hitler - Social Deduction Game",
  description: "Multiplayer online game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pathname, setPathname] = useState<string>("#");

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  return (
    <html lang="en" className={`${germania.variable}`}>
      <body className="bg-stone-700 text-white font-[family-name:var(--font-germania)]">
        <header className="p-5 bg-amber-900 text-4xl text-white font-bold text-center h-[80px] flex items-center justify-center">
          <Link href={pathname || "#"}>Secret Hitler</Link>
        </header>
        <main className="h-[calc(100vh-80px)]">{children}</main>
      </body>
    </html>
  );
}
