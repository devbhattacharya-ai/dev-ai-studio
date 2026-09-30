import type { Metadata } from "next";
import { PricingPage } from "@/components/PricingPage";

export const metadata: Metadata = {
  title: "Pricing | DEV / AI STUDIO",
  description:
    "Clear starting prices for business websites, animated websites, extra motion and WhatsApp automation. Every project is scoped before work begins.",
};

export default function Page() {
  return <PricingPage />;
}
