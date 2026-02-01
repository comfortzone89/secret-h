import "./globals.css";
import localFont from "next/font/local";
import Header from "@/components/templates/Header";
import { Inter, Roboto, Playfair_Display } from "next/font/google";

const germania = localFont({
  src: "../public/fonts/GermaniaOne-Regular.ttf",
  variable: "--font-germania", // tailwind-friendly variable
  weight: "400",
});

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata = {
  title: "Secret Hitler",
  description:
    "Secret Hitler is a social deduction game for 5-10 players. This version is an adaptation of the board game created by Max Temkin, Mike Boxleiter, Tommy Maranges, and illustrated by Mackenzie Schubert.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${germania.variable} ${roboto.variable}`}>
      <body className="bg-stone-700 text-white font-[family-name:var(--font-germania)]">
        <div className="page min-h-[100vh] flex flex-col items-center">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
