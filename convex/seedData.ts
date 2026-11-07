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
  contactEmail: "[EMAIL]",
  mediaKitUrl: "[MEDIA KIT LINK]",
  youtubeUrl: "https://www.youtube.com/@roundsmed",
  spotifyUrl: "[SPOTIFY LINK]",
  appleUrl: "[APPLE PODCASTS LINK]",
  instagramUrl: "https://www.instagram.com/rounds.md",
  tiktokUrl: "https://www.tiktok.com/@rounds.med",
  linktreeUrl: "https://linktr.ee/rounds.md",
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
    name: "[ชื่ออาจารย์แพทย์เวชศาสตร์ฉุกเฉิน]",
    nameLang: "th" as const,
    field: "เวชศาสตร์ฉุกเฉิน",
    affiliation: "เวชศาสตร์ฉุกเฉิน มหาวิทยาลัยธรรมศาสตร์",
  },
  {
    name: "Dr. Pakornkit Phrueksaudomchai",
    nameLang: "en" as const,
    field: "กระจกตาและการผ่าตัดแก้ไขสายตา",
  },
  {
    name: "Asst. Prof. Dr. Dhave Setabutr",
    nameLang: "en" as const,
    field: "หู คอ จมูกเด็ก",
  },
  {
    name: "อ.พญ.นิพัทธา",
    nameLang: "th" as const,
    field: "สูติศาสตร์และนรีเวชวิทยา",
  },
];

export const seedEpisodes = [
  {
    slug: "emergency-medicine",
    title: "ห้องฉุกเฉิน ไม่ใช่มาก่อนได้ก่อน",
    status: "published" as const,
    featured: true,
    seriesIndex: 0,
    guestIndex: 0,
    specialty: "เวชศาสตร์ฉุกเฉิน",
    summary:
      "ใครได้ตรวจก่อนเมื่อเดินเข้าห้องฉุกเฉิน นาทีหลังหัวใจหยุดเต้นเกิดอะไรขึ้นจริงๆ ทำไมเวรดึกถึงเต็มไปด้วยอุบัติเหตุมอเตอร์ไซค์และแอลกอฮอล์ และ AI จะเปลี่ยนการแพทย์ฉุกเฉินตรงไหนก่อน",
    thumbLabel: "เวชศาสตร์\nฉุกเฉิน",
    thumbVariant: 0,
    releaseDate: "[วันที่]",
    runtime: "[ความยาว]",
    youtubeUrl: "https://www.youtube.com/@roundsmed",
    spotifyUrl: "[SPOTIFY LINK]",
    appleUrl: "[APPLE PODCASTS LINK]",
  },
  {
    slug: "ophthalmology",
    title: "จ้องจอ ตรวจตา และดวงตาของเรา",
    status: "published" as const,
    featured: false,
    seriesIndex: 0,
    guestIndex: 1,
    specialty: "จักษุวิทยา",
    summary: "",
    thumbLabel: "จักษุ\nวิทยา",
    thumbVariant: 1,
    releaseDate: "[วันที่]",
    runtime: "[ความยาว]",
  },
  {
    slug: "ent",
    title: "หมอหู คอ จมูก ทำอะไรบ้างจริงๆ",
    status: "coming_soon" as const,
    featured: false,
    seriesIndex: 0,
    guestIndex: 2,
    specialty: "หู คอ จมูก",
    summary: "",
    thumbLabel: "หู คอ\nจมูก",
    thumbVariant: 2,
    metaNote: "แบ่งเป็น 2 ตอน",
  },
  {
    slug: "ob-gyn",
    title: "[ชื่อตอน]",
    status: "coming_soon" as const,
    featured: false,
    seriesIndex: 0,
    guestIndex: 3,
    specialty: "สูติ-นรีเวช",
    summary: "",
    thumbLabel: "สูติ-\nนรีเวช",
    thumbVariant: 3,
    metaNote: "พร้อมเจาะลึกเรื่อง IVF",
  },
];

// The doctor's verdict on a common belief: "red" (don't believe it) or
// "green" (true / a healthy habit).
export const seedMyths = [
  {
    claim: "ใส่แว่นนานๆ แล้วสายตาจะแย่ลง",
    answer: "แว่นแค่ช่วยปรับโฟกัส ไม่ได้เปลี่ยนโครงสร้างของตา หรือทำให้ตาขี้เกียจ",
    verdict: "red" as const,
    episodeIndex: 1,
  },
  {
    claim: "แว่นกันแดดยิ่งสีเข้ม ยิ่งกัน UV ได้มาก",
    answer: "การกัน UV ขึ้นอยู่กับมาตรฐาน UV400 ไม่ใช่ความเข้มของเลนส์",
    verdict: "red" as const,
    episodeIndex: 1,
  },
  {
    claim: "นั่งดูทีวีใกล้ๆ ทำให้ตาเสีย",
    answer: "ไม่ทำให้ตาเสียถาวร เด็กที่สายตาสั้นอยู่แล้วต่างหากที่ต้องนั่งใกล้เพื่อให้มองเห็นชัด",
    verdict: "red" as const,
    episodeIndex: 1,
  },
  {
    claim: "[ตัวอย่าง Green flag — ใส่คำถามจริงในหน้าแอดมิน]",
    answer: "[คำตอบจากคุณหมอ]",
    verdict: "green" as const,
    // Not linked to an episode, so no doctor is credited with a placeholder.
    episodeIndex: -1,
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
