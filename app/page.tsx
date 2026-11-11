import { SiteNav } from "@/components/landing/SiteNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatementSection } from "@/components/landing/StatementSection";
import { LatestEpisodeSection } from "@/components/landing/LatestEpisodeSection";
import { EpisodesSection } from "@/components/landing/EpisodesSection";
import { FlagsQuiz } from "@/components/landing/FlagsQuiz";
import { SeriesSection } from "@/components/landing/SeriesSection";
import { HostsSection } from "@/components/landing/HostsSection";
import { DoctorsSection } from "@/components/landing/DoctorsSection";
import { PartnerSection } from "@/components/landing/PartnerSection";
import { Footer } from "@/components/landing/Footer";
import { getHomeContent } from "@/lib/content";
import { isPlaceholder } from "@/lib/placeholders";

export default async function Home() {
  const content = await getHomeContent();
  const { settings } = content;
  // Starter rows like "[ตัวอย่าง Green flag ...]" stay out of the quiz.
  const myths = content.myths.filter((m) => !isPlaceholder(m.claim) && !isPlaceholder(m.answer));
  return (
    <>
      <a href="#main" className="skip-link">
        ข้ามไปที่เนื้อหา
      </a>
      <SiteNav />
      <main id="main">
        <HeroSection settings={settings} latest={content.latest} />
        <StatementSection />
        {content.latest && <LatestEpisodeSection episode={content.latest} />}
        <EpisodesSection episodes={content.episodes} />
        {myths.length > 0 && <FlagsQuiz myths={myths} />}
        <DoctorsSection content={content} />
        <HostsSection hosts={content.hosts} intro={content.episodes.find((ep) => ep.status === "published" && !ep.guestName) ?? null} />
        <SeriesSection series={content.series} />
        {/* For sponsors: kept together at the end. */}
        <PartnerSection settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
