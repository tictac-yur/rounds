import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/landing/SiteNav";
import { Footer } from "@/components/landing/Footer";
import { getHomeContent } from "@/lib/content";
import { filled } from "@/lib/placeholders";

export const metadata: Metadata = {
  title: "นโยบายความเป็นส่วนตัว — Rounds",
  description: "Rounds เก็บข้อมูลอะไรจากคุณบ้าง (แทบไม่เก็บเลย) และสิทธิของคุณ · What Rounds collects, and your rights.",
};

const UPDATED = "12 พฤศจิกายน 2569 (12 November 2026)";

export default async function PrivacyPage() {
  const content = await getHomeContent();
  const email = filled(content.settings.contactEmail);
  const contact = email ? (
    <a href={`mailto:${email}`} className="text-link">
      {email}
    </a>
  ) : (
    "ช่องทางติดต่อในหน้านี้"
  );

  return (
    <>
      <SiteNav base="/" />
      <main id="main">
        <section className="dark legal-hero" aria-labelledby="privacy-title">
          <div className="wrap">
            <h1 className="partner-h" id="privacy-title">
              นโยบายความเป็นส่วนตัว
            </h1>
            <p className="body-lg muted" lang="en">
              Privacy &amp; medical disclaimer
            </p>
            <p className="small muted">ปรับปรุงล่าสุด {UPDATED}</p>
          </div>
        </section>

        <section className="wrap section legal" aria-label="นโยบายความเป็นส่วนตัว">
          <p className="body-lg">
            สั้นๆ: เว็บไซต์นี้ <b>ไม่เก็บข้อมูลส่วนบุคคลของผู้เข้าชม</b> ไม่มีบัญชีผู้ใช้ ไม่มีแบบฟอร์ม ไม่มีจดหมายข่าว
            ไม่ใช้คุกกี้ และไม่มีเครื่องมือติดตามพฤติกรรม
          </p>

          <h2>ใครดูแลข้อมูล</h2>
          <p>
            เว็บไซต์ Rounds (ตีตี้และปั๊บ) จัดทำและดูแลโดย จักริน เศรณีอริยาภรณ์ และ นราวิศว์ อินทศักดิ์อุบล
            ซึ่งเป็นผู้ควบคุมข้อมูลส่วนบุคคลตามนโยบายนี้ ติดต่อเราได้ที่ {contact}
          </p>

          <h2>ข้อมูลที่เกิดขึ้นเองตามปกติ</h2>
          <ul>
            <li>
              <b>บันทึกการเข้าถึงเซิร์ฟเวอร์</b> ผู้ให้บริการโฮสติ้งของเรา (Vercel) บันทึกข้อมูลทางเทคนิคของทุกคำขอ เช่น
              ที่อยู่ IP และเวลา เพื่อให้เว็บไซต์ทำงานและปลอดภัย เราไม่ได้นำข้อมูลนี้ไปวิเคราะห์ตัวบุคคล
              และเก็บตามระยะเวลาที่ผู้ให้บริการกำหนด
            </li>
            <li>
              <b>ภาพจาก YouTube</b> ภาพปกตอนและคลิปสั้นโหลดจากเซิร์ฟเวอร์ของ YouTube (Google) ดังนั้น Google
              จึงเห็นที่อยู่ IP ของคุณเมื่อหน้าเว็บโหลดภาพเหล่านี้
            </li>
            <li>
              <b>ลิงก์ไปเว็บไซต์อื่น</b> เมื่อคุณกดไปดูที่ YouTube, Spotify, Apple Podcasts, Instagram หรือ TikTok
              ข้อมูลของคุณจะอยู่ภายใต้นโยบายของแพลตฟอร์มนั้น
            </li>
            <li>
              <b>เกมทาย Red / Green flag</b> ทำงานในเบราว์เซอร์ของคุณเท่านั้น ไม่ส่งคำตอบไปที่ใด
            </li>
          </ul>

          <h2>อีเมลที่คุณส่งมาหาเรา</h2>
          <p>
            หากคุณอีเมลหาเรา (เช่น เรื่องสปอนเซอร์หรือมาเป็นแขกรับเชิญ) เราจะใช้ข้อมูลนั้นเพื่อตอบเรื่องที่คุณติดต่อเท่านั้น
            ไม่ขายและไม่ส่งต่อให้ผู้อื่น และจะลบเมื่อคุณขอ
          </p>

          <h2>บุคคลที่ปรากฏบนเว็บไซต์</h2>
          <p>
            อาจารย์แพทย์แขกรับเชิญและทีมงานปรากฏชื่อ ประวัติโดยย่อ รูปภาพ และลิงก์โปรไฟล์ได้ด้วยความยินยอมของบุคคลนั้น
            หากต้องการแก้ไขหรือให้เราถอดข้อมูลของคุณ ส่งอีเมลมาที่ {contact} เราจะดำเนินการโดยเร็ว
          </p>

          <h2>ผู้ดูแลระบบ</h2>
          <p>
            หน้าจัดการเว็บไซต์เปิดให้เฉพาะทีมงานที่ได้รับอนุญาต เราเก็บเพียงอีเมลของผู้ดูแลและรหัสผ่านที่ถูกเข้ารหัสแบบแฮช
            (เราอ่านรหัสผ่านไม่ได้) ข้อมูลทั้งหมดส่งผ่าน HTTPS
          </p>

          <h2>การเชื่อมต่อ YouTube (YouTube API Services)</h2>
          <p>
            เราใช้ YouTube API Services เพื่ออ่านวิดีโอ ยอดวิวสาธารณะ และสถิติผู้ชมโดยรวม (ช่วงอายุ เพศ ประเทศ
            ในรูปแบบสรุป ไม่ระบุตัวบุคคล) ของช่อง Rounds เอง เมื่อทีมงานเชื่อมต่อบัญชี YouTube ของช่อง
            เราไม่เข้าถึงข้อมูลของผู้ชมรายบุคคล การใช้งานนี้อยู่ภายใต้{" "}
            <a href="https://www.youtube.com/t/terms" className="text-link" target="_blank" rel="noopener">
              ข้อกำหนดการให้บริการของ YouTube
            </a>{" "}
            และ{" "}
            <a href="https://policies.google.com/privacy" className="text-link" target="_blank" rel="noopener">
              นโยบายความเป็นส่วนตัวของ Google
            </a>{" "}
            ทีมงานเพิกถอนสิทธิ์ได้ทุกเมื่อที่{" "}
            <a href="https://security.google.com/settings/security/permissions" className="text-link" target="_blank" rel="noopener">
              การตั้งค่าความปลอดภัยของ Google
            </a>
          </p>

          <h2>สิทธิของคุณตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)</h2>
          <p>
            คุณมีสิทธิขอเข้าถึง แก้ไข ลบ หรือคัดค้านการใช้ข้อมูลส่วนบุคคลของคุณ และถอนความยินยอมที่เคยให้ไว้ ส่งคำขอมาที่ {contact}{" "}
            หากไม่พอใจการดำเนินการของเรา คุณร้องเรียนได้ที่สำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.)
          </p>

          <h2>การเปลี่ยนแปลงนโยบาย</h2>
          <p>หากเราเพิ่มเครื่องมือที่เก็บข้อมูลเพิ่ม (เช่น สถิติผู้เข้าชม) เราจะแก้หน้านี้ก่อน และขอความยินยอมในกรณีที่กฎหมายกำหนด</p>

          <h2>ข้อควรทราบทางการแพทย์</h2>
          <p>
            Rounds จัดทำโดยนักศึกษาแพทย์ ไม่ใช่แพทย์ที่มีใบอนุญาต เนื้อหาเป็นการให้ความรู้ทั่วไป
            ไม่ใช่การวินิจฉัย การรักษา หรือคำแนะนำทางการแพทย์สำหรับบุคคลใด และความเห็นของอาจารย์แพทย์ในแต่ละตอน
            เป็นความเห็นส่วนบุคคลของท่าน หากมีอาการหรือกังวลเรื่องสุขภาพ กรุณาปรึกษาแพทย์ของคุณ
            และหากเป็นเหตุฉุกเฉินให้โทร 1669
          </p>

          <details className="legal-en" lang="en">
            <summary>English version</summary>
            <p>
              <b>In short:</b> this website does not collect visitors&apos; personal data. There are no accounts, forms,
              newsletters, cookies or tracking tools.
            </p>
            <h2>Who runs it</h2>
            <p>
              Rounds (Titi and Pup) is created and run by Jakkrin Seraneeariyaporn and Narawit Inthasakubon, who are the
              data controllers under this policy. Contact: {contact}
            </p>
            <h2>What happens automatically</h2>
            <ul>
              <li>
                <b>Server logs.</b> Our host (Vercel) records technical details of each request, such as IP address and
                time, to run and secure the site. We don&apos;t analyse them about individuals; they are kept for the
                period the host sets.
              </li>
              <li>
                <b>YouTube images.</b> Episode and Shorts thumbnails load from YouTube&apos;s servers (Google), so Google
                sees your IP address when a page loads them.
              </li>
              <li>
                <b>Outbound links</b> to YouTube, Spotify, Apple Podcasts, Instagram and TikTok are covered by those
                platforms&apos; policies.
              </li>
              <li>
                <b>The Red / Green flag game</b> runs only in your browser; answers aren&apos;t sent anywhere.
              </li>
            </ul>
            <h2>Emails you send us</h2>
            <p>
              We use them only to reply, never sell or share them, and delete them when you ask.
            </p>
            <h2>People shown on the site</h2>
            <p>
              Guest doctors and the team appear with their consent. To correct or remove your details, email {contact}
              and we&apos;ll act promptly.
            </p>
            <h2>Admin accounts</h2>
            <p>
              The admin area is for authorised team members only. We store their email and a hashed password. Everything
              is sent over HTTPS.
            </p>
            <h2>YouTube API Services</h2>
            <p>
              When the team connects the channel&apos;s YouTube account, we use YouTube API Services to read the
              channel&apos;s own videos, public view counts and aggregate audience statistics (age ranges, gender,
              countries; summaries, not individuals). We cannot see individual viewers. Use is subject to the{" "}
              <a href="https://www.youtube.com/t/terms" className="text-link" target="_blank" rel="noopener">
                YouTube Terms of Service
              </a>{" "}
              and the{" "}
              <a href="https://policies.google.com/privacy" className="text-link" target="_blank" rel="noopener">
                Google Privacy Policy
              </a>
              . Access can be revoked at any time in{" "}
              <a href="https://security.google.com/settings/security/permissions" className="text-link" target="_blank" rel="noopener">
                Google security settings
              </a>
              .
            </p>
            <h2>Your rights</h2>
            <p>
              Under Thailand&apos;s Personal Data Protection Act you can ask to access, correct, delete or object to the
              use of your personal data, and withdraw consent. Email {contact}. You can also complain to Thailand&apos;s
              Personal Data Protection Committee.
            </p>
            <h2>Changes</h2>
            <p>
              If we add anything that collects more data (such as visitor statistics), we will update this page first and
              ask for consent where the law requires it.
            </p>
            <h2>Medical disclaimer</h2>
            <p>
              Rounds is made by medical students, not licensed physicians. Content is general education, not diagnosis,
              treatment or personal medical advice, and each guest doctor&apos;s views are their own. If you have symptoms
              or concerns, talk to your own doctor. In an emergency in Thailand, call 1669.
            </p>
          </details>

          <p>
            <Link href="/" className="text-link">
              ← กลับหน้าแรก
            </Link>
          </p>
        </section>
      </main>
      <Footer settings={content.settings} />
    </>
  );
}
