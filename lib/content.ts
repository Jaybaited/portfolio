// All site content lives here. Edit this file to update the portfolio.

export const profile = {
  name: "Ciejay Fortu",
  firstName: "Ciejay",
  lastName: "Fortu",
  role: "Full-Stack Developer",
  tagline:
    "I build accessible systems, from Filipino Sign Language recognition to RFID school gates, across web, mobile and desktop.",
  location: "Muntinlupa City, Philippines",
  school: "BS Information Technology · STI College Alabang",
  email: "ciejayfortu29@gmail.com",
  github: "https://github.com/Jaybaited",
  githubHandle: "Jaybaited",
  photo: "/img/ciejay.jpg",
  about: [
    "I'm an IT student at STI College Alabang who likes owning a system end to end: the database, the API, the screens people actually touch, and the small details that make them feel right.",
    "Most of my recent work is SignSpeak-SafeCheck, my capstone for the Philippine School for the Deaf. I lead its development: a web platform, an Android app, a Filipino Sign Language recognition service and an RFID gate that tells parents when their child arrives and leaves.",
    "Outside of school I take on freelance C# work, and design interfaces for my teams' projects.",
  ],
};

// My personal best on Monkeytype (words 25, english). The typing challenge uses
// these exact words, and the ghost caret replays the run frame by frame.
export const typingRecord = {
  wpm: 164,
  accuracy: 100,
  seconds: 9,
  proof: "/img/monkeytype-164.png",
  words: "follow same present begin what run help little not last part not look then present out show new develop if some a see what only".split(" "),
  // [milliseconds since the first keystroke, characters typed], read from the screen recording at 60 frames per second
  replay: [
    [0, 0], [17, 1], [117, 2], [283, 3], [383, 4], [483, 6], [583, 7], [600, 8], [683, 9], [717, 10], [783, 11], [883, 13],
    [983, 14], [1100, 15], [1183, 16], [1317, 17], [1383, 18], [1483, 19], [1583, 20], [1683, 21], [1783, 22], [1800, 23],
    [1883, 25], [2017, 26], [2083, 27], [2183, 29], [2283, 30], [2317, 31], [2383, 32], [2417, 33], [2517, 34], [2583, 35],
    [2683, 36], [2783, 38], [2800, 39], [2917, 40], [2983, 41], [3083, 42], [3117, 43], [3283, 44], [3317, 45], [3417, 46],
    [3483, 47], [3517, 48], [3583, 49], [3617, 50], [3683, 51], [3717, 52], [3783, 53], [3800, 54], [3883, 55], [3983, 56],
    [4017, 57], [4083, 58], [4183, 59], [4283, 60], [4383, 62], [4483, 63], [4517, 64], [4583, 65], [4617, 66], [4717, 67],
    [4800, 68], [4917, 69], [4983, 70], [5083, 71], [5117, 72], [5217, 73], [5317, 74], [5483, 77], [5683, 78], [5717, 79],
    [5800, 80], [5917, 81], [6083, 82], [6183, 84], [6217, 85], [6317, 86], [6417, 87], [6483, 88], [6517, 89], [6583, 90],
    [6683, 91], [6783, 93], [6883, 94], [6917, 95], [7017, 96], [7083, 97], [7183, 98], [7283, 99], [7317, 100], [7383, 101],
    [7517, 102], [7583, 103], [7683, 104], [7717, 106], [7800, 107], [7883, 108], [7983, 110], [8083, 111], [8183, 112],
    [8217, 113], [8317, 114], [8383, 115], [8483, 116], [8583, 117], [8683, 118], [8717, 119], [8800, 120], [8883, 122],
    [8983, 123], [9083, 124], [9183, 126], [9250, 127],
  ] as [number, number][],
};

export type ProjectStatus = "Live" | "Prototype" | "Proposal" | "Design" | "Freelance" | "In development";

export type Project = {
  slug: string;
  title: string;
  kind: string;
  years?: string;
  role: string;
  status: ProjectStatus;
  research?: string;
  summary: string;
  points: string[];
  stack: string[];
  image?: { src: string; w: number; h: number; cropTop?: number; alt: string };
  links: { label: string; href: string }[];
};

export const featured: Project = {
  slug: "signspeak-safecheck",
  title: "SignSpeak-SafeCheck",
  kind: "Capstone · Web + Mobile + ML",
  years: "2025 – 2026",
  role: "Lead Developer · Full stack, web and mobile",
  status: "Live",
  research:
    "SignSpeak-SafeCheck: A Cross-Platform Filipino Sign Language Recognition System and Integrated RFID-Based Student Gate Attendance and Safety Monitoring for the Philippine School for the Deaf",
  summary:
    "One platform for a school for the deaf: students learn and practise Filipino Sign Language with a camera, while an RFID gate records every arrival and departure and keeps parents informed.",
  points: [
    "Filipino Sign Language recognition from the camera, served by a Python FastAPI service",
    "RFID gate kiosk that logs Time In / Time Out and alerts parents by push notification and SMS",
    "Role-based web platform for admins, guards, students and parents",
    "Android app for students and parents, built with Expo",
  ],
  stack: ["Next.js", "TypeScript", "NestJS", "Prisma", "PostgreSQL", "Supabase", "Python", "FastAPI", "Expo", "React Native", "RFID"],
  image: {
    src: "/projects/signspeak.webp",
    w: 1877,
    h: 1042,
    cropTop: 74,
    alt: "SignSpeak-SafeCheck landing page for the Philippine School for the Deaf",
  },
  links: [
    { label: "Visit live site", href: "https://safecheck-signspeak-sllf.vercel.app" },
    { label: "Android app", href: "https://github.com/Jaybaited/safecheck-signspeak-app" },
  ],
};

export const projects: Project[] = [
  {
    slug: "pagpag",
    title: "Pagpag: The Hunger Games",
    kind: "Game · Game-development thesis",
    role: "Programmer · UI/UX · Co-created the game concept",
    status: "Prototype",
    summary:
      "A 2D survival game set in a Filipino slum. Survive 365 days, find a stable job and escape. Hardcore mode: one life, no second chances. Built to put real social issues in the Philippines in front of players.",
    points: [
      "Programmed core survival systems and the game's interface",
      "Helped shape the concept around everyday life in the slums",
    ],
    stack: ["Game development", "UI/UX", "Team project"],
    image: { src: "/projects/pagpag.webp", w: 1878, h: 970, alt: "Pagpag: The Hunger Games title screen over a map of a Filipino slum" },
    links: [{ label: "Team repository", href: "https://github.com/barceeee/PagpagTheHungerGames" }],
  },
  {
    slug: "e-borrow",
    title: "E-Borrow",
    kind: "Web system · Research project",
    years: "2024 – 2025",
    role: "UI/UX · Front-end developer and designer",
    status: "Prototype",
    research: "E-Borrow: A Web-Based Barangay Alabang Equipment Lending System",
    summary:
      "An equipment lending system for Barangay Alabang, so residents can borrow tables, chairs and sound systems online instead of in line.",
    points: [
      "Designed the interface and built the responsive front end",
      "Prepared the presentation materials used to pitch the system",
    ],
    stack: ["TypeScript", "React", "Tailwind CSS", "UI/UX"],
    image: { src: "/projects/eborrow.webp", w: 968, h: 543, cropTop: 38, alt: "E-Borrow System for Barangay Alabang home page" },
    links: [],
  },
  {
    slug: "alabang-clinic",
    title: "Alabang Medical Clinic",
    kind: "Web system · Research project",
    role: "Documenter · Wireframed the whole system",
    status: "Design",
    research: "Development of a Web-Based Appointment Management System for Alabang Medical Clinic",
    summary:
      "An appointment management system for a local clinic. I documented the project and designed the wireframes for every screen of the system.",
    points: ["Wireframes for the full system in Figma", "Research documentation"],
    stack: ["Figma", "Wireframing", "Documentation"],
    image: { src: "/projects/clinic.webp", w: 1280, h: 690, cropTop: 80, alt: "Sign-in screen wireframe for the Alabang Medical Clinic system" },
    links: [],
  },
  {
    slug: "ald-concrete",
    title: "ALD Concrete Products",
    kind: "Website · Proposal prototype",
    role: "UI/UX · Front-end developer and designer",
    status: "Proposal",
    research: "Web-Based Product Catalog and Customer Inquiry Management System for ALD Concrete Products",
    summary:
      "A product catalog and inquiry system proposed for a concrete supplier with over 20 years in business. The proposal did not continue; this prototype of the website is what we built.",
    points: ["Designed and built the prototype website", "Product catalog and contact flow"],
    stack: ["React", "Tailwind CSS", "Vercel", "UI/UX"],
    image: { src: "/projects/ald.webp", w: 1874, h: 1041, cropTop: 74, alt: "ALD Concrete Products prototype home page" },
    links: [{ label: "View prototype", href: "https://ald-concrete-products.vercel.app" }],
  },
  {
    slug: "pisonet",
    title: "Pisonet Daily Tracker",
    kind: "Desktop app · Freelance",
    years: "2025 – 2026",
    role: "Freelance C# Developer",
    status: "Freelance",
    summary:
      "A desktop app for a small pisonet computer café that tracks daily usage and automates timekeeping, replacing a paper log.",
    points: [
      "Designed the interface and the session-tracking logic",
      "Built for accurate daily totals and reliable everyday use",
    ],
    stack: ["C#", "Windows Forms", ".NET"],
    links: [{ label: "Source code", href: "https://github.com/Jaybaited/DailyTrackerSystem" }],
  },
];

export const archive = [
  { title: "Student Attendance Management", note: "Integrative Programming · System 3", stack: "C#", href: "https://github.com/Jaybaited/StudentAttendanceManagement" },
  { title: "Pharmacy POS", note: "Integrative Programming · System 2", stack: "C#", href: "https://github.com/Jaybaited/PharmacyPOS" },
  { title: "Library Book Management", note: "Integrative Programming · System 1", stack: "C#", href: "https://github.com/Jaybaited/LibraryBookManagementSystem" },
  { title: "RFID Attendance with Database", note: "Event-Driven Programming · Finals", stack: "C#", href: "https://github.com/Jaybaited/Event-Driven-Finals" },
  { title: "AI Voice Quote Generator", note: "Personal project", stack: "JavaScript", href: "https://github.com/Jaybaited/quote-generator-with-voice" },
];

// Keycaps for the skills keyboard. `label` is what is printed on the cap.
export type Skill = { label: string; name: string; group: string; note: string };

export const skills: Skill[] = [
  { label: "TS", name: "TypeScript", group: "Language", note: "My default for web, backend and mobile." },
  { label: "JS", name: "JavaScript", group: "Language", note: "Where it started: responsive pages in HTML, CSS and JS." },
  { label: "C#", name: "C#", group: "Language", note: "Desktop apps in Windows Forms, including freelance work." },
  { label: "Py", name: "Python", group: "Language", note: "The sign-language recognition service and model training." },
  { label: "Jv", name: "Java", group: "Language", note: "Java Fundamentals certified, 2024." },
  { label: "</>", name: "HTML & CSS", group: "Language", note: "Semantic, responsive layouts." },
  { label: "Re", name: "React", group: "Framework", note: "Interfaces for every web project here." },
  { label: "N", name: "Next.js", group: "Framework", note: "SignSpeak-SafeCheck's web app, and this site." },
  { label: "~", name: "Tailwind CSS", group: "Framework", note: "Fast, consistent styling." },
  { label: "Ne", name: "NestJS", group: "Framework", note: "SignSpeak-SafeCheck's API: auth, roles, attendance." },
  { label: "▲", name: "Prisma", group: "Framework", note: "Typed database access and migrations." },
  { label: "Fa", name: "FastAPI", group: "Framework", note: "Serves the FSL recognition model." },
  { label: "Ex", name: "Expo / React Native", group: "Mobile", note: "The SignSpeak-SafeCheck Android app." },
  { label: "Pg", name: "PostgreSQL", group: "Database", note: "Production data on Supabase." },
  { label: "My", name: "MySQL", group: "Database", note: "School systems and XAMPP projects." },
  { label: "Sb", name: "Supabase", group: "Database", note: "Postgres, private storage and signed URLs." },
  { label: "CV", name: "Computer vision", group: "ML", note: "Hand-landmark based sign recognition." },
  { label: "RF", name: "RFID", group: "Hardware", note: "Gate kiosk taps that become attendance records." },
  { label: "Git", name: "Git & GitHub", group: "Tools", note: "Branches, checkpoints, reviews." },
  { label: "Vc", name: "Vercel", group: "Tools", note: "Deploys for the web projects." },
  { label: "Fg", name: "Figma", group: "Design", note: "Wireframes and UI design." },
  { label: "UX", name: "UI/UX design", group: "Design", note: "Interaction and interface design." },
  { label: "PC", name: "Computer systems servicing", group: "IT", note: "NC II certified, 2023." },
  { label: "Net", name: "Networking", group: "IT", note: "Basic network configuration and troubleshooting." },
];

export const timeline = [
  { year: "2026", title: "1st Runner-up, CODEFEST", place: "Tagisan ng Talino at Sining · STI College", kind: "Award" },
  { year: "2025 – 2026", title: "Lead Developer, SignSpeak-SafeCheck", place: "Capstone · Philippine School for the Deaf", kind: "Project" },
  { year: "2025 – 2026", title: "Freelance C# Developer", place: "Pisonet Daily Tracker", kind: "Work" },
  { year: "2024", title: "Java Fundamentals", place: "Certification", kind: "Certificate" },
  { year: "2023 – 2026", title: "BS Information Technology", place: "STI College Alabang", kind: "Education" },
  { year: "2023", title: "Computer Systems Servicing NC II", place: "TESDA certification", kind: "Certificate" },
  { year: "2021 – 2023", title: "Information and Communication Technology", place: "Muntinlupa National High School", kind: "Education" },
];
