import { ReactNode } from "react";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="font-[family-name:var(--font-roboto)] max-w-[800px] w-full p-5">
      {children}
    </div>
  );
}
