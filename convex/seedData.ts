// Starter content for the site. It mirrors the original hard-coded landing
// page, is loaded into the database from the admin dashboard, and is used as
// a fallback by the public site when no Convex deployment is configured.

export const seedSettings = {
  heroKicker: "New episode every other week",
  heroHeadline: "Medical school,\nas it happens.",
  heroIntro:
    "Titi and Pup are first-year medical students at Thammasat. They document med school in real time, and sit down with the specialists who teach it.",
  heroIntroTh:
    "ติติและปั๊บเป็นนักศึกษาแพทย์ปีที่ 1 ที่ธรรมศาสตร์ พวกเขาบันทึกชีวิตช่วงเรียนแพทย์แบบเรียลไทม์ และพูดคุยกับอาจารย์แพทย์เฉพาะทางที่สอนพวกเขา",
  heroImageCaption: "Titi & Pup, with a guest",
  stats: [
    { value: "[XX]K", label: "Followers, all platforms" },
    { value: "[XX]K", label: "Monthly views" },
    { value: "TH / EN", label: "Bilingual, every episode" },
  ],
  audienceIntro:
    "Thai pre-meds, medical students and people with real health questions, reached in both Thai and English.",
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
    kicker: "Interview · 30–50 min",
    description:
      "Specialists on what they actually do, the hard truths, advice for students, and a myth-buster to close.",
    accentColor: "#0a0f14",
  },
  {
    name: "[SERIES NAME]",
    kicker: "Vlog",
    description:
      "Daily life, training and milestones, following Titi and Pup through medical school as it happens.",
    accentColor: "#1b3a5f",
  },
  {
    name: "A Day With a Doctor",
    kicker: "Shadow",
    description:
      "A full day beside a specialist, to see what the job looks like on an ordinary shift.",
    accentColor: "#9ba6b2",
  },
];

export const seedGuests = [
  {
    name: "[Emergency Medicine physician — name pending]",
    nameLang: "en" as const,
    field: "Emergency Medicine",
    affiliation: "Emergency Medicine, Thammasat University",
  },
  {
    name: "Dr. Pakornkit Phrueksaudomchai",
    nameLang: "en" as const,
    field: "Cornea & refractive surgery",
  },
  {
    name: "Asst. Prof. Dr. Dhave Setabutr",
    nameLang: "en" as const,
    field: "Pediatric ENT",
  },
  {
    name: "อ.พญ.นิพัทธา",
    nameLang: "th" as const,
    field: "Obstetrics & Gynecology",
  },
];

export const seedEpisodes = [
  {
    slug: "emergency-medicine",
    title: "The ER isn't first come, first served",
    status: "published" as const,
    featured: true,
    seriesIndex: 0,
    guestIndex: 0,
    specialty: "Emergency",
    summary:
      "Who gets seen first when you walk into an ER, what really happens in the minutes after a heart stops, why motorbikes and alcohol fill the night shift, and where AI will change emergency care first.",
    thumbLabel: "Emergency\nMedicine",
    thumbVariant: 0,
    releaseDate: "[DATE]",
    runtime: "[RUNTIME]",
    youtubeUrl: "https://www.youtube.com/@roundsmed",
    spotifyUrl: "[SPOTIFY LINK]",
    appleUrl: "[APPLE PODCASTS LINK]",
  },
  {
    slug: "ophthalmology",
    title: "Screens, exams and your eyes",
    status: "published" as const,
    featured: false,
    seriesIndex: 0,
    guestIndex: 1,
    specialty: "Ophthalmology",
    summary: "",
    thumbLabel: "Ophthal-\nmology",
    thumbVariant: 1,
    releaseDate: "[DATE]",
    runtime: "[RUNTIME]",
  },
  {
    slug: "ent",
    title: "What an ENT doctor actually does",
    status: "coming_soon" as const,
    featured: false,
    seriesIndex: 0,
    guestIndex: 2,
    specialty: "ENT",
    summary: "",
    thumbLabel: "ENT",
    thumbVariant: 2,
    metaNote: "Two-part episode",
  },
  {
    slug: "ob-gyn",
    title: "[EPISODE TITLE]",
    status: "coming_soon" as const,
    featured: false,
    seriesIndex: 0,
    guestIndex: 3,
    specialty: "OB-GYN",
    summary: "",
    thumbLabel: "OB-GYN",
    thumbVariant: 3,
    metaNote: "With an IVF deep-dive",
  },
];

export const seedMyths = [
  {
    claim: "Wearing glasses makes your eyes weaker over time.",
    answer: "Glasses correct focus. They don't change the eye's structure or make it lazier.",
    episodeIndex: 1,
  },
  {
    claim: "Darker sunglasses block more UV.",
    answer: "UV protection comes from a UV400 rating, not how dark the lens looks.",
    episodeIndex: 1,
  },
  {
    claim: "Sitting too close to the TV damages your eyes.",
    answer: "No lasting damage. Kids who are already nearsighted sit closer so they can see.",
    episodeIndex: 1,
  },
];

export const seedAudienceSegments = [
  {
    stat: "[XX]%",
    title: "Pre-med & high school",
    description: "Deciding whether medicine is for them, and which school.",
  },
  {
    stat: "[XX]%",
    title: "Medical students",
    description: "Picking a specialty and getting through the years.",
  },
  {
    stat: "[XX]%",
    title: "General public",
    description: "Here for the myth-busters and everyday health questions.",
  },
];

export const seedSponsorPackages = [
  {
    letter: "A",
    title: "Episode sponsor",
    description: "A host-read spot in The Consult, with a link in every platform's description.",
  },
  {
    letter: "B",
    title: "Short-form package",
    description: "A credit on the clips we cut from each episode for TikTok, Reels and Shorts.",
  },
  {
    letter: "C",
    title: "Newsletter placement",
    description: "One slot per issue, sent with every new episode.",
  },
];

export const seedHosts = [
  { name: "Titi", role: "Co-founder & host · MD candidate, Year 1, Thammasat (CICM)" },
  { name: "Pup", role: "Co-founder & host · MD candidate, Year 1, Thammasat (CICM)" },
];
