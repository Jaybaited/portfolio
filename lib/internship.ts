// Work Immersion / internship content (Euthenics 2, Prefinals Requirements 3 and 4).
// Edit the wording here; the page sections read from this file.

export const careerObjective =
  "To secure an internship where I can apply my full-stack web and mobile development skills to real business systems, earn industry-recognized certifications, and learn secure, enterprise-grade practices from experienced mentors, as my first step toward becoming a developer who builds secure and accessible software.";

export const immersionGoals = [
  {
    title: "Work in a real team codebase",
    detail: "Use version control, code reviews and agile routines on a production system, not only school projects.",
  },
  {
    title: "Earn at least one industry certification",
    detail: "Build a certified foundation in cloud, enterprise IT or security, beyond my TESDA NC II and Oracle Academy course.",
  },
  {
    title: "Learn secure development",
    detail: "Understand how real systems are protected and how my code can prevent, not cause, security problems.",
  },
  {
    title: "Grow as a professional communicator",
    detail: "Report progress clearly, write documentation, ask good questions and present my work to supervisors.",
  },
  {
    title: "Finish strong",
    detail: "Complete my required hours with a good evaluation and leave with mentors who can vouch for my work.",
  },
];

export const personalInfo = [
  { label: "Name", value: "Ciejay F. Fortu" },
  { label: "Program", value: "BS Information Technology, STI College Alabang" },
  { label: "Location", value: "Muntinlupa City, Philippines" },
  { label: "Languages", value: "English, Filipino" },
];

export const softSkills = [
  { name: "Communication", proof: "Presented and defended system designs to panels, advisers and our partner school." },
  { name: "Teamwork", proof: "Worked in capstone, thesis and research teams as developer, designer and documenter." },
  { name: "Leadership", proof: "Lead developer of SignSpeak-SafeCheck: planned the work and owned the system end to end." },
  { name: "Problem-solving", proof: "Turned real problems (gate attendance, sign recognition, café timekeeping) into working software." },
  { name: "Digital literacy", proof: "Comfortable across web, mobile, databases, cloud deployment and AI-assisted development tools." },
  { name: "Adaptability", proof: "Moved between C#, PHP, TypeScript and Python as each project needed." },
  { name: "Time management", proof: "Balanced a capstone, freelance work and coursework on fixed deadlines." },
  { name: "Critical thinking", proof: "Weighed design trade-offs, like where to run sign recognition, before building." },
];

export type Certificate = {
  title: string;
  issuer: string;
  date: string;
  kind: "Award" | "National Certificate" | "Course";
  image: string;
  w: number;
  h: number;
  note?: string;
};

export const certificates: Certificate[] = [
  {
    title: "1st Runner-Up, CODEFEST 2026: Android app development (Android Studio)",
    issuer: "Tagisan ng Talino at Tagisan ng Sining · STI College Alabang",
    date: "September 25, 2026",
    kind: "Award",
    image: "/certs/codefest-2026.jpg",
    w: 2000,
    h: 1563,
  },
  {
    title: "National Certificate II in Computer Systems Servicing",
    issuer: "TESDA",
    date: "Issued June 29, 2023 · valid until June 28, 2028",
    kind: "National Certificate",
    image: "/certs/tesda-nc2-css.jpg",
    w: 1270,
    h: 1796,
    note: "Certificate numbers are hidden for privacy.",
  },
  {
    title: "Java Fundamentals",
    issuer: "Oracle Academy",
    date: "June 19, 2024",
    kind: "Course",
    image: "/certs/oracle-java-fundamentals-2024.jpg",
    w: 1800,
    h: 1391,
  },
];

// ---- Company and HTE evaluation (Requirement 3) ------------------------------

export const criteria = [
  { key: "profile", label: "Company profile", hint: "Size, stability and track record" },
  { key: "industry", label: "Industry fit", hint: "How close the work is to my field" },
  { key: "reputation", label: "Reputation", hint: "Standing in the industry and as an employer" },
  { key: "learning", label: "Learning opportunities", hint: "Training, mentoring and certifications" },
  { key: "access", label: "Accessibility", hint: "Travel from Alabang, Muntinlupa" },
  { key: "growth", label: "Career growth", hint: "Where the internship can lead" },
] as const;

export type CriterionKey = (typeof criteria)[number]["key"];

export type Company = {
  name: string;
  short: string;
  industry: string;
  location: string;
  background: string;
  why: string; // in my own words
  learning: string[];
  pros: string[];
  cons: string[];
  growth: string;
  scores: Record<CriterionKey, number>; // 1 to 5
  sources: { label: string; href: string }[];
};

export const companies: Company[] = [
  {
    name: "Accenture Philippines",
    short: "Accenture",
    industry: "IT services and consulting",
    location: "Several Metro Manila sites, including Axis Tower One, Filinvest City, Alabang (opened 2019)",
    background:
      "Accenture is a global professional services company in technology and consulting, present in the Philippines for over 35 years, with delivery centers across Metro Manila, Cebu and other cities. Its Alabang site was opened so employees in the south could work closer to home.",
    why: "I'm drawn to Accenture's strong culture of continuous learning and structured upskilling. Beyond fulfilling my OJT hours, I want to be in an environment that actively supports earning industry-recognized certifications and provides mentorship, so I can build a solid, certified foundation in enterprise IT and security.",
    learning: [
      "Internship program with mentoring from senior staff",
      "Technology Academy for 4th-year tech students: specialized certifications, deep-tech training, workshops and hackathons",
      "Exposure to enterprise-scale projects and tools",
    ],
    pros: [
      "Most structured training and certification path of the three",
      "Large projects and many career tracks to explore",
      "Has a site in Alabang, near home (assignment not guaranteed)",
    ],
    cons: [
      "Very large organization: interns may get narrow or non-coding tasks",
      "Competitive selection",
      "Assignment to a team or site is not guaranteed",
    ],
    growth: "Clear entry path to associate software engineering roles after graduation, with certifications along the way.",
    scores: { profile: 5, industry: 5, reputation: 5, learning: 5, access: 4, growth: 5 },
    sources: [
      { label: "Accenture PH: Internships", href: "https://www.accenture.com/ph-en/careers/life-at-accenture/internships-careers" },
      { label: "Accenture PH: About", href: "https://www.accenture.com/ph-en/about/company/philippines" },
      { label: "Prosple: Technology Academy", href: "https://slu.prosple.com/graduate-employers/accenture-in-the-philippines/jobs-internships/technology-academy" },
      { label: "Newsbytes: Alabang office (2019)", href: "https://newsbytes.ph/2019/07/31/accenture-expands-presence-in-ph-with-new-office-in-alabang/" },
    ],
  },
  {
    name: "Trend Micro Philippines",
    short: "Trend Micro",
    industry: "Cybersecurity",
    location: "The Rockwell Business Center Tower 2, Ortigas Avenue, Pasig City",
    background:
      "Trend Micro is a global cybersecurity company. Its Philippine operation has long hosted research and support teams (TrendLabs), and it runs cybersecurity internships covering threat research, threat hunting and cloud security.",
    why: "While my primary background is in full-stack development, I'm very interested in exploring cybersecurity in a real-world setting before committing to a full-time career track. Trend Micro stands out because of its strong reputation for training interns in threat research and cloud security, giving me the chance to apply my development and networking fundamentals to defending systems.",
    learning: [
      "Threat research and threat hunting (early detection before customers are affected)",
      "Cloud security and system development work",
      "Helping build cybersecurity training modules",
    ],
    pros: [
      "World-known security company and real threat data",
      "Builds on my networking background (NC II)",
      "Security skills make me a stronger developer",
    ],
    cons: [
      "Outside my main full-stack track",
      "Pasig is the longest commute from Alabang",
      "Listings ask for 500 to 900+ training hours; openings are seasonal",
    ],
    growth: "Can lead to IT security, threat research or system development roles.",
    scores: { profile: 5, industry: 4, reputation: 5, learning: 5, access: 3, growth: 4 },
    sources: [
      { label: "Prosple: Cybersecurity Intern", href: "https://slu.prosple.com/graduate-employers/trend-micro-philippines/jobs-internships/cybersecurity-intern" },
      { label: "Trend Micro PH: Contact", href: "https://www.trendmicro.com/en_ph/business/get-info-form.html" },
      { label: "Inquirer: Filipino malware researchers", href: "https://technology.inquirer.net/?p=36768" },
    ],
  },
  {
    name: "Uratex (RGC Group)",
    short: "Uratex",
    industry: "Manufacturing (foam, mattresses and furniture)",
    location: "Km 23 East Service Road, Cupang, Muntinlupa City",
    background:
      "Uratex is a Filipino manufacturer founded in 1968 and a household name in foam and mattresses, with factories and showrooms nationwide. Its in-house IT supports manufacturing, sales and operations across the group.",
    why: "I appreciate that Uratex embraces modern, pragmatic development practices, including AI-assisted coding. In my own projects, leveraging AI tools lets me iterate faster, catch edge cases earlier, and focus more energy on clean system design and delivering practical solutions that support real business operations.",
    learning: [
      "Building and maintaining internal business systems",
      "Seeing how IT supports a real manufacturing company",
      "Pragmatic, AI-assisted development in a smaller team",
    ],
    pros: [
      "Closest to home (Cupang, Muntinlupa)",
      "Smaller IT team: more hands-on responsibility",
      "Work directly tied to business operations",
    ],
    cons: [
      "Not a tech company: IT is a support function",
      "Fewer formal training or certification programs",
      "Little public information about its internship",
    ],
    growth: "Good for practical full-stack experience; fewer specialized tech career tracks.",
    scores: { profile: 4, industry: 3, reputation: 4, learning: 3, access: 5, growth: 3 },
    sources: [
      { label: "Uratex: Our story", href: "https://uratex.com.ph/pages/our-story" },
      { label: "Philstar: Innovation at Uratex", href: "https://philstar.com/business/business-as-usual/2009/11/23/525474/innovation-technological-expertise-key-uratexs-success" },
    ],
  },
];

export const average = (c: Company) =>
  Math.round((Object.values(c.scores).reduce((a, b) => a + b, 0) / criteria.length) * 100) / 100;

export const recommendation = {
  pick: "Accenture Philippines",
  summary:
    "Accenture best matches my career goals. It has the most structured learning environment of the three, with mentoring, training academies and certifications, which is exactly the foundation I want. Its Alabang site is also near home. Trend Micro is my strong second choice if I decide to explore cybersecurity, and Uratex is the most practical if I want hands-on business systems close to home.",
  prepares:
    "An internship at Accenture would prepare me for my future career by putting me inside real enterprise projects, teaching me how large teams build and secure software, and giving me certifications that employers recognize.",
};

// ---- Reflection (Requirement 4, section 7) ----------------------------------

export const reflectionQuestion =
  "How has preparing for Work Immersion helped me understand my career goals and future professional responsibilities?";

export const reflection = [
  "Preparing for the Work Immersion has really helped me figure out what I want to do in the future. It made me stop and look honestly at my strengths, my weaknesses and the skills I already have, and that is what shaped a clear goal in my mind.",
  "Building SignSpeak-SafeCheck showed me that I enjoy owning a system from end to end, from the database to the screens people actually use. It also showed me my weaknesses: I still have a lot to learn about security, testing, and working inside a large team with real processes. Researching companies like Accenture, Trend Micro and Uratex made these gaps concrete, because each one asks for different strengths, and I had to decide which of them I want to grow into.",
  "It also made me realize my future professional responsibilities as an IT student. The systems I build are used by real people, like the students and parents of a school for the deaf, so I am responsible for making them reliable, secure and respectful of their data. Being a professional is not only about writing code; it means communicating clearly, meeting deadlines, accepting feedback and continuing to learn even when no one is grading me.",
  "Preparing for the Work Immersion helped me carve out a path that I want to walk and can be proud of. It gave me a deeper realization of my capabilities and motivated me to continue what I am doing, and to keep working hard until I reach the goal I have set: to become a full-stack developer who builds secure, accessible systems that make a difference.",
];

// ---- Career development plan (bonus) ----------------------------------------

export const careerPlan = [
  {
    when: "Year 1",
    title: "Intern, then graduate",
    points: ["Complete my internship and earn my first industry certification", "Graduate with my BSIT and a finished capstone"],
  },
  {
    when: "Years 2 to 3",
    title: "Junior full-stack developer",
    points: ["Ship features on production systems in a team", "Earn a cloud or security certification", "Keep building and maintaining my own projects"],
  },
  {
    when: "Years 4 to 5",
    title: "Full-stack developer with a security focus",
    points: ["Lead small features or projects", "Mentor newer developers", "Specialize in secure, accessible systems"],
  },
];
