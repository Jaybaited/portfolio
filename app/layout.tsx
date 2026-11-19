import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import Script from "next/script";
import { profile } from "@/lib/content";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  // Full site address, so link previews get an absolute URL for the preview image
  metadataBase: new URL(profile.site),
  title: "Ciejay Fortu · Full-Stack Developer",
  description:
    "Portfolio of Ciejay Fortu, a full-stack developer from Muntinlupa, Philippines. Lead developer of SignSpeak-SafeCheck.",
  authors: [{ name: "Ciejay Fortu" }],
  openGraph: {
    title: "Ciejay Fortu · Full-Stack Developer",
    description: "Web, mobile and desktop systems, from sign-language recognition to RFID school gates.",
    type: "website",
    url: "/",
    siteName: "Ciejay Fortu",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ciejay Fortu · Full-Stack Developer",
    description: "Web, mobile and desktop systems, from sign-language recognition to RFID school gates.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#f4f4f2" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} antialiased`}
    >
      <body className="min-h-full">
        {/* Set the theme before first paint so there is no flash */}
        <Script id="theme-init" strategy="beforeInteractive">{`(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.dataset.theme=t;if(sessionStorage.getItem('intro'))document.documentElement.dataset.intro='done'}catch(e){document.documentElement.dataset.theme='dark'}})()`}</Script>
        {children}
      </body>
    </html>
  );
}
