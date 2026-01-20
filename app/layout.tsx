// app/layout
import "./globals.css";
import localFont from "next/font/local";
import Header from "@/components/templates/Header";

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
  return (
    <html lang="en" className={`${germania.variable}`}>
      <body className="bg-stone-700 text-white font-[family-name:var(--font-germania)]">
        <Header />
        <main className="min-h-[calc(100vh-80px)] flex items-center justify-center mt-[80px]">
          {children}
        </main>
      </body>
    </html>
  );
}
