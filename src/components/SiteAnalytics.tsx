"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const GA_MEASUREMENT_ID = "G-B9VQKK1B38";

export function SiteAnalytics() {
  const pathname = usePathname() ?? "";
  if (pathname.startsWith("/studio")) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());if(!location.pathname.startsWith('/studio')){gtag('config','${GA_MEASUREMENT_ID}');}`}
      </Script>
    </>
  );
}
