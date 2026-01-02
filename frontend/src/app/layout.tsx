import { ToastProvider } from "@/components/scoreboard/components/common/Toast";
import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Providers from "./providers";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "49ers Leaderboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="no-scrollbar">
      <body className={montserrat.className}>
        <Providers>
          <ToastProvider />
          {children}
        </Providers>
        </body>
    </html>
  );
}
