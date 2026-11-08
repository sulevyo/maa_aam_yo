import { Geist, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

// Pealkirjade jaoks: õhuke, rahulik serif. latin-ext katab ka š ja ž.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
});

export const metadata = {
  metadataBase: new URL("https://maaaam.ee"),
  title: "MAA.AAM — Eesti loodushelid ja ambient taust",
  description:
    "Minimalistlik audiopleier Eesti loodushelidega. Ideaalne taust meditatsiooniks, keskendumiseks, joogaks ja lõõgastumiseks.",
  keywords: [
    "loodushelid",
    "ambient",
    "meditatsioonitaust",
    "vihmavaling",
    "linnulaul",
    "Eesti loodus",
    "helid magamiseks",
    "taustaheli",
  ],
  openGraph: {
    title: "maa.aam",
    description: "loodushelid",
    url: "https://maaaam.ee",
    siteName: "MAA.AAM",
    images: [{ url: "/images/matsalulambad.webp", width: 1200, height: 630 }],
    locale: "et_EE",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  viewportFit: "cover", // vajalik, et env(safe-area-inset-*) töötaks iPhone'is
};

export default function RootLayout({ children }) {
  return (
    <html lang="et">
      <body
        className={`${geistSans.variable} ${cormorant.variable} antialiased bg-black`}
      >
        {children}
      </body>
    </html>
  );
}
