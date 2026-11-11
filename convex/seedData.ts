// Starter content for the site (Thai first). It is loaded into the database
// from the admin dashboard, and is used as a fallback by the public site when
// no Convex deployment is configured.

export const seedSettings = {
  heroKicker: "ตอนใหม่ทุกสองสัปดาห์",
  heroHeadline: "Medical school,\nas it happens.",
  heroHeadlineTh: "ชีวิตนักศึกษาแพทย์แบบเรียลไทม์",
  heroIntro:
    "Titi and Pup are first-year medical students at Thammasat. They document med school in real time, and sit down with the specialists who teach it.",
  heroIntroTh:
    "ตีตี้และปั๊บเป็นนักศึกษาแพทย์ปีที่ 1 ที่ธรรมศาสตร์ พวกเขาบันทึกชีวิตช่วงเรียนแพทย์แบบเรียลไทม์ และพูดคุยกับอาจารย์แพทย์เฉพาะทางที่สอนพวกเขา",
  heroImageCaption: "ตีตี้และปั๊บ กับแขกรับเชิญ",
  stats: [
    { value: "[XX]K", label: "ผู้ติดตามทุกแพลตฟอร์ม" },
    { value: "[XX]K", label: "ยอดวิวต่อเดือน" },
    { value: "TH / EN", label: "สองภาษา ทุกตอน" },
  ],
  audienceIntro:
    "น้องๆ ที่อยากเป็นหมอ นักศึกษาแพทย์ และคนทั่วไปที่มีคำถามเรื่องสุขภาพจริงๆ ทั้งภาษาไทยและภาษาอังกฤษ",
  platformHandles: [
    "YouTube @roundsmed",
    "TikTok @rounds.med",
    "Instagram @rounds.md",
    "Spotify · Apple Podcasts",
  ],
  contactEmail: "roundsmedofficial@gmail.com",
  mediaKitUrl: "[MEDIA KIT LINK]",
  youtubeUrl: "https://www.youtube.com/@roundsmed",
  spotifyUrl: "[SPOTIFY LINK]",
  appleUrl: "[APPLE PODCASTS LINK]",
  instagramUrl: "https://www.instagram.com/rounds.md",
  tiktokUrl: "https://www.tiktok.com/@rounds.med",
  linktreeUrl: "https://linktr.ee/rounds.med",
};

export const seedSeries = [
  {
    name: "The Consult",
    kicker: "สัมภาษณ์ · 30–50 นาที",
    description:
      "หมอเฉพาะทางเล่าว่างานจริงๆ ทำอะไร ความจริงที่ไม่ค่อยมีใครพูด คำแนะนำสำหรับนักศึกษาแพทย์ และปิดท้ายด้วย Red flag / Green flag",
    accentColor: "#0a0f14",
  },
  {
    name: "[ชื่อซีรีส์]",
    kicker: "วล็อก",
    description:
      "ชีวิตประจำวัน การเรียน และช่วงเวลาสำคัญ ตามติดตีตี้และปั๊บตลอดเส้นทางนักศึกษาแพทย์",
    accentColor: "#1b3a5f",
  },
  {
    name: "A Day With a Doctor",
    kicker: "ตามติดหมอ",
    description: "ใช้เวลาทั้งวันข้างหมอเฉพาะทาง เพื่อดูว่างานจริงในวันธรรมดาเป็นอย่างไร",
    accentColor: "#9ba6b2",
  },
];

export const seedGuests = [
  {
    name: "ผศ.นพ.กานต์ วิฑูรชาติ",
    nameLang: "th" as const,
    field: "อายุรศาสตร์โรคหัวใจ",
    affiliation: "อายุรแพทย์โรคหัวใจ คณะแพทยศาสตร์ มหาวิทยาลัยธรรมศาสตร์",
    // From what he says in The Consult EP.1.
    bio: "อายุรแพทย์โรคหัวใจ โรงพยาบาลธรรมศาสตร์ เชี่ยวชาญการตรวจภาพหัวใจขั้นสูง (advanced cardiac imaging) ด้วย CT และ MRI และเป็นอาจารย์แพทย์ที่สอนนักศึกษาแพทย์ อาจารย์เลือกสายหัวใจเพราะชอบงานที่ต้องตัดสินใจภายใต้ความกดดัน และได้เห็นคนไข้ที่หัวใจหยุดเต้นกลับมาใช้ชีวิตได้อีกครั้ง",
  },
];

// The episodes on the channel (youtube.com/@roundsmed). Newer uploads arrive
// as drafts through the hourly YouTube sync (convex/youtube.ts).
export const seedEpisodes = [
  {
    slug: "cardiology",
    title: "คุยกับหมอหัวใจ “ถอดรหัสโรคหัวใจ”",
    status: "published" as const,
    featured: true,
    seriesIndex: 0,
    guestIndex: 0,
    specialty: "โรคหัวใจ",
    summary:
      "อกหักจนหัวใจวายได้จริงไหม? ชีพจร 90 ต้องตกใจหรือเปล่า? แล้วกาแฟที่ดื่มทุกวัน ดีหรือร้ายกับหัวใจกันแน่? ตั้งแต่วิธีเช็คหัวใจเองที่บ้าน ภาวะ “หัวใจสลาย” ที่เกิดจากความเครียด ไปจนถึง myth เรื่องหัวใจที่คนเชื่อกันผิดมาตลอด",
    thumbLabel: "โรค\nหัวใจ",
    thumbVariant: 0,
    releaseDate: "1 พ.ย. 2026",
    youtubeUrl: "https://www.youtube.com/watch?v=o4kY44zLgig",
    youtubeVideoId: "o4kY44zLgig",
    youtubeThumbnailUrl: "https://i.ytimg.com/vi/o4kY44zLgig/maxresdefault.jpg",
  },
  {
    slug: "what-is-rounds",
    title: "ทำความรู้จักกับเรา “What is Rounds?”",
    status: "published" as const,
    featured: false,
    seriesIndex: 0,
    guestIndex: -1,
    specialty: "",
    summary:
      "เรียนหมอ 6 ปี เริ่มนับจากวันนี้... ตีตี้และปั๊บพาไปรู้จักช่อง Rounds ว่าเป็นใคร เริ่มต้นมาจากไหน ทำไมชื่อ “ROUNDS” และในช่องนี้จะมีอะไรให้ดูบ้าง",
    thumbLabel: "What is\nRounds?",
    thumbVariant: 2,
    releaseDate: "26 ต.ค. 2026",
    youtubeUrl: "https://www.youtube.com/watch?v=27T2ZaG26K4",
    youtubeVideoId: "27T2ZaG26K4",
    youtubeThumbnailUrl: "https://i.ytimg.com/vi/27T2ZaG26K4/maxresdefault.jpg",
  },
];

// The doctor's verdict on a common belief: "red" (don't believe it) or
// "green" (true / a healthy habit). From The Consult EP.1.
export const seedMyths = [
  {
    claim: "กินไข่วันละ 1–2 ฟอง ทำให้ไขมันอุดตันเส้นเลือด",
    answer: "ไข่ 1–2 ฟองไม่ได้น่ากลัวอย่างที่คิด แต่ขึ้นอยู่กับว่ากินแบบไหน และเราเป็นใคร",
    verdict: "red" as const,
    episodeIndex: 0,
  },
  {
    claim: "อกหักจนหัวใจพังได้จริง",
    answer:
      "มีภาวะที่เรียกว่า “ทาโกะสึโบะ” หรือภาวะหัวใจสลาย มักเกี่ยวกับการตกใจอย่างรุนแรง และส่วนใหญ่รักษาให้ดีขึ้นได้",
    verdict: "green" as const,
    episodeIndex: 0,
  },
  {
    claim: "สูบบุหรี่ไม่เป็นไร ถ้าออกกำลังกายสม่ำเสมอ",
    answer:
      "ในคนอ้วน คนไม่ออกกำลังกาย และคนที่ออกกำลังกายแต่สูบบุหรี่จัด คนสูบบุหรี่เสี่ยงโรคหัวใจที่สุด บุหรี่ทำให้ความดันขึ้นและคราบไขมันในหลอดเลือดแตกจนหัวใจวายได้",
    verdict: "red" as const,
    episodeIndex: 0,
  },
  {
    claim: "กาแฟหรือเครื่องดื่มชูกำลัง ทำให้หัวใจมีปัญหา",
    answer:
      "ไม่จริง 100% คนทั่วไปกินกาแฟได้ แต่คนที่ใจสั่นง่าย ไทรอยด์ผิดปกติ หรือมีโรคหัวใจ ต้องระวังปริมาณ",
    verdict: "red" as const,
    episodeIndex: 0,
  },
  {
    claim: "มือเย็น แปลว่าเลือดไหลเวียนไม่ดี หัวใจอ่อนแอ",
    answer: "ไม่จริงแน่นอน มือเย็นมีได้หลายสาเหตุ เช่นอยู่ในห้องเย็น ไม่ควรสรุปว่าเป็นโรคหัวใจ",
    verdict: "red" as const,
    episodeIndex: 0,
  },
  {
    claim: "กินเนื้อติดมันบ่อยๆ ทำให้คอเลสเตอรอลสูง",
    answer: "เพิ่มความเสี่ยงจริง เพราะมีคอเลสเตอรอลเยอะ ขึ้นอยู่กับว่ากินเนื้อและมันมากแค่ไหน",
    verdict: "green" as const,
    episodeIndex: 0,
  },
  {
    claim: "หัวใจวายต้องเจ็บหน้าอกแรงๆ เสมอ",
    answer:
      "คนไข้หัวใจวายส่วนใหญ่เจ็บหน้าอก แต่ไม่ใช่ทุกคน ถ้ามีความเสี่ยง ควรไปตรวจแม้ไม่มีอาการ",
    verdict: "red" as const,
    episodeIndex: 0,
  },
];

export const seedAudienceSegments = [
  {
    stat: "[XX]%",
    title: "นักเรียนที่อยากเป็นหมอ",
    description: "กำลังตัดสินใจว่าจะเรียนแพทย์ไหม และเรียนที่ไหนดี",
  },
  {
    stat: "[XX]%",
    title: "นักศึกษาแพทย์",
    description: "กำลังเลือกสาขาเฉพาะทาง และพยายามผ่านแต่ละปีไปให้ได้",
  },
  {
    stat: "[XX]%",
    title: "คนทั่วไป",
    description: "มาดู Red flag / Green flag และคำถามสุขภาพในชีวิตประจำวัน",
  },
];

export const seedSponsorPackages = [
  {
    letter: "A",
    title: "สปอนเซอร์ประจำตอน",
    description: "พิธีกรพูดถึงแบรนด์ใน The Consult พร้อมลิงก์ในคำอธิบายทุกแพลตฟอร์ม",
  },
  {
    letter: "B",
    title: "แพ็กเกจคลิปสั้น",
    description: "เครดิตในคลิปสั้นที่ตัดจากแต่ละตอน สำหรับ TikTok, Reels และ Shorts",
  },
];

export const seedHosts = [
  {
    name: "ตีตี้",
    role: "ผู้ร่วมก่อตั้งและพิธีกร · นักศึกษาแพทย์ปี 1 ธรรมศาสตร์ (CICM)",
  },
  {
    name: "ปั๊บ",
    role: "ผู้ร่วมก่อตั้งและพิธีกร · นักศึกษาแพทย์ปี 1 ธรรมศาสตร์ (CICM)",
  },
];
