import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import Client from "./Client";

export const metadata: Metadata = {
  title: "DevLinks | Your All-in-One Link Sharing Profile",
  description:
    "Create, customize, and share your professional links with the world using DevLinks.",
  keywords: [
    "Linktree clone",
    "Developer Portfolio",
    "Next.js",
    "Firebase",
    "Social Links",
  ],
  authors: [{ name: "Fatimah Adebimpe" }],

  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "DevLinks | Connect All Your Links in One Place",
    description:
      "Connect your audience to all your social platforms with one link.",
    url: "https://alx-project-nexus-delta-one.vercel.app/",
    siteName: "DevLinks",
    images: [
      {
        url: "https://alx-project-nexus-delta-one.vercel.app/preview.png",
        width: 1200,
        height: 630,
        alt: "DevLinks App Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevLinks | Share All Your Links in One Place",
    description: "The professional way to share your links.",
    images: ["https://alx-project-nexus-delta-one.vercel.app/preview.png"],
  },
  manifest: "/manifest.json",
  themeColor: "#633CFF",
};

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={instrumentSans.className}>
        <Client>{children}</Client>
      </body>
    </html>
  );
}
