import { HeroSection } from "@/components/landing/HeroSection";
import { LatestEpisodeSection } from "@/components/landing/LatestEpisodeSection";
import { EpisodesSection } from "@/components/landing/EpisodesSection";
import { MythBusterSection } from "@/components/landing/MythBusterSection";
import { AudienceSection } from "@/components/landing/AudienceSection";
import { SeriesSection } from "@/components/landing/SeriesSection";
import { PartnerSection } from "@/components/landing/PartnerSection";
import { AboutNewsletterSection } from "@/components/landing/AboutNewsletterSection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div style={{ width: "100%" }}>
      <HeroSection />
      <LatestEpisodeSection />
      <EpisodesSection />
      <MythBusterSection />
      <AudienceSection />
      <SeriesSection />
      <PartnerSection />
      <AboutNewsletterSection />
      <Footer />
    </div>
  );
}
