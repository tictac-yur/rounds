import { HeroSection } from "@/components/landing/HeroSection";
import { LatestEpisodeSection } from "@/components/landing/LatestEpisodeSection";
import { EpisodesSection } from "@/components/landing/EpisodesSection";
import { MythBusterSection } from "@/components/landing/MythBusterSection";
import { AudienceSection } from "@/components/landing/AudienceSection";
import { SeriesSection } from "@/components/landing/SeriesSection";
import { PartnerSection } from "@/components/landing/PartnerSection";
import { HostsSection } from "@/components/landing/HostsSection";
import { Footer } from "@/components/landing/Footer";
import { getHomeContent } from "@/lib/content";

export default async function Home() {
  const content = await getHomeContent();
  const { settings } = content;
  return (
    <div style={{ width: "100%" }}>
      <HeroSection settings={settings} />
      {content.latest && <LatestEpisodeSection episode={content.latest} />}
      <EpisodesSection episodes={content.episodes} />
      {content.myths.length > 0 && <MythBusterSection myths={content.myths} />}
      <AudienceSection settings={settings} segments={content.audienceSegments} />
      <SeriesSection series={content.series} />
      <PartnerSection settings={settings} guests={content.guests} packages={content.sponsorPackages} />
      <HostsSection hosts={content.hosts} />
      <Footer settings={settings} />
    </div>
  );
}
