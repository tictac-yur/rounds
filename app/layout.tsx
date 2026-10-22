import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Rounds — Home",
  description:
    "Rounds follows Titi and Pup, two first-year medical students at Thammasat, as they document med school in real time and sit down with the specialists who teach it.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} ${notoSansThai.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
