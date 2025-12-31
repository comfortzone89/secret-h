// app/layout.tsx
import Link from "next/link";
import "./globals.css";
import localFont from "next/font/local";

const germania = localFont({
  src: "../public/fonts/GermaniaOne-Regular.ttf",
  variable: "--font-germania", // tailwind-friendly variable
  weight: "400",
});

export const metadata = {
  title: "My Game",
  description: "Multiplayer game with phases",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${germania.variable}`}>
      <body className="bg-stone-700 text-white font-[family-name:var(--font-germania)]">
        <header className="p-5 bg-amber-900 text-4xl text-white font-bold text-center h-[80px] flex items-center justify-center">
          <Link href={process.env.NEXT_PUBLIC_HOSTNAME || '#'}>Secret Hitler</Link>
        </header>
        <main className="h-[calc(100vh-80px)]">{children}</main>
      </body>
    </html>
  );
}
