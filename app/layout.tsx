import type { Metadata } from "next";
import "./globals.css";

const siteName = "HN Front Page Predictor";
const description =
  "Predict whether your Show HN launch will reach the front page before you post. Get a probability score, timing guidance, and practical title/content fixes.";

export const metadata: Metadata = {
  metadataBase: new URL("https://hnfrontpagepredictor.com"),
  title: {
    default: siteName,
    template: `%s | ${siteName}`
  },
  description,
  keywords: [
    "show hn",
    "hacker news",
    "launch predictor",
    "developer tools marketing",
    "startup launch",
    "front page"
  ],
  openGraph: {
    title: siteName,
    description,
    type: "website",
    siteName,
    url: "https://hnfrontpagepredictor.com"
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
