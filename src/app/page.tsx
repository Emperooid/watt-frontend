import { About } from "@/components/landing/About";
import { AdditionalTools } from "@/components/landing/AdditionalTools";
import { EnergyTips } from "@/components/landing/EnergyTips";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { LandingNav } from "@/components/landing/LandingNav";
import { QuickCalculator } from "@/components/landing/QuickCalculator";
import { TariffReference } from "@/components/landing/TariffReference";
import { WaitlistSection } from "@/components/landing/WaitlistSection";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <TariffReference />
        <QuickCalculator />
        <AdditionalTools />
        <EnergyTips />
        <About />
        <WaitlistSection />
      </main>
      <Footer />
    </div>
  );
}
