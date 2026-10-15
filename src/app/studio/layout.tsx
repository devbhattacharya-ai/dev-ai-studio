import type { Metadata, Viewport } from "next";
import { StudioShell } from "./shell";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Studio",
  applicationName: "Studio",
  manifest: "/studio.webmanifest",
  appleWebApp: { capable: true, title: "Studio", statusBarStyle: "black-translucent" },
  icons: {
    icon: [
      { url: "/studio-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/studio-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/studio-icon-180.png",
  },
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StudioShell />
      {children}
    </>
  );
}
