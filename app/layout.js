import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MAA.AAM — Eesti loodushelid ja ambient taust",
  description: "Minimalistlik audiopleier Eesti loodushelidega. Ideaalne taust meditatsiooniks, keskendumiseks, joogaks ja lõõgastumiseks.",
  keywords: "loodushelid, ambient, meditatsioonitaust, vihmavaling, linnulaul, Eesti loodus, helid magamiseks, taustaheli",
  openGraph: {
    title: "maa.aam — eesti loodushelid",
    description: "Kuula rahu.",
    url: "https://maaaam.ee",
    siteName: "MAA.AAM",
    images: [
      {
        url: "https://maaaam.ee/images/matsalulambad.webp", 
        width: 1200,
        height: 630,
      },
    ],
    locale: "et_EE",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="et">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        {children}
      </body>
    </html>
  );
}