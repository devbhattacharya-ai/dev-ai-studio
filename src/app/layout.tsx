import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import { LanguageProvider } from "@/lib/LanguageContext";
import { META } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const noto = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "700"],
  variable: "--font-noto-devanagari",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  openGraph: {
    title: META.ogTitle,
    description: META.ogDescription,
    siteName: META.ogSiteName,
    images: [
      {
        url: "/og.png",
        alt: META.ogImageAlt,
      },
    ],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-language="en" className={`${inter.variable} ${noto.variable}`}>
      <body
        style={{
          fontFamily:
            'var(--font-inter), "Inter", var(--font-noto-devanagari), "Noto Sans Devanagari", Arial, sans-serif',
        }}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
