import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HN Front Page Predictor — Will Your Show HN Hit #1?",
  description: "Paste your Show HN title and description. Get an ML-powered probability score and actionable suggestions to maximize your front page chances."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-mono antialiased">
        {children}
      </body>
    </html>
  );
}
