import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import Script from "next/script";
import { GaPageView } from "@/components/GaPageView";
import { LanguageProvider } from "@/lib/LanguageContext";
import { META } from "@/lib/content";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-B9VQKK1B38";

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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`}
        </Script>
        <GaPageView />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
