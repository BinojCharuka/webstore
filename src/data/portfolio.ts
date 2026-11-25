/**
 * Portfolio content is intentionally kept in one editable place.
 * Replace or extend these records with verified information before publishing.
 * /admin lets you preview changes in THIS browser and export JSON; it does not write to GitHub.
 */
export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  categories: string[];
  year: string;
  status: "Live" | "In progress" | "Concept";
  liveUrl?: string;
  sourceUrl?: string;
  featured?: boolean;
  highlights: string[];
  /** Two placeholder images used by PixelSwap – first is primary, second is secondary */
  images?: [string, string];
};
export type EventEntry = {
  slug: string;
  title: string;
  group: string;
  role: string;
  year: string;
  summary: string;
  highlights: string[];
  images?: string[]; // Multiple flyers / event gallery photos
};
export type CreativeWork = {
  slug: string;
  title: string;
  category: string;
  context: string;
  year: string;
  image?: string; // Add your own image file under public/ and use its /path here.
  images?: string[]; // Multiple flyers / gallery photos for this event
};
export type Certificate = {
  slug?: string | undefined;
  title: string;
  issuer: string;
  year: string;
  description?: string | undefined;
  details?: string | undefined;
  highlights?: string[] | undefined;
  skills?: string[] | undefined;
  url?: string | undefined;
  image?: string | undefined;
  credentialId?: string | undefined;
};
export type EducationEntry = {
  institution: string;
  degree: string;
  field?: string;
  period: string;
  description?: string;
  highlights?: string[];
  logo?: string; // Institution logo (Cloudinary URL or /path)
};
export type Milestone = { when: string; what: string; where: string; detail?: string };
export interface Role {
  slug?: string | undefined;
  title: string;
  group: string;
  description: string;
  year: string;
  details?: string | undefined;
  highlights?: string[] | undefined;
  organization?: string | undefined;
  link?: string | undefined;
  images?: string[] | undefined;
}
export const CV_SECTION_KEYS = [
  "summary",
  "education",
  "skills",
  "projects",
  "leadership",
  "creative",
  "languages",
  "events",
  "journey",
  "certificates",
] as const;

export type CvSectionKey = (typeof CV_SECTION_KEYS)[number];

export type CvLanguageEntry = {
  name: string;
  proficiency: string;
};

export type CvSettings = {
  enabled: boolean;
  buttonLabel: string;
  fileName: string;
  paperSize: "a4" | "letter";
  fontStyle: "sans" | "serif";
  briefMode: boolean;
  compactMode: boolean;
  includeLinks: boolean;
  includeProjectLinks: boolean;
  includeProjectHighlights: boolean;
  includeCertificatesDetails: boolean;
  headlineOverride: string;
  summaryOverride: string;
  phone: string;
  languages: CvLanguageEntry[];
  sectionOrder: CvSectionKey[];
  sections: Record<CvSectionKey, boolean>;
  limits: {
    projects: number;
    roles: number;
    events: number;
    creative: number;
    certificates: number;
    journey: number;
  };
  featuredProjectsOnly: boolean;
};

export const defaultCvSettings: CvSettings = {
  enabled: true,
  buttonLabel: "Download CV",
  fileName: "Binoj_Charuka_CV",
  paperSize: "a4",
  fontStyle: "sans",
  briefMode: true,
  compactMode: false,
  includeLinks: true,
  includeProjectLinks: false,
  includeProjectHighlights: false,
  includeCertificatesDetails: false,
  headlineOverride: "",
  summaryOverride: "",
  phone: "",
  languages: [
    { name: "English", proficiency: "Professional Working Proficiency" },
    { name: "Sinhala", proficiency: "Native Proficiency" },
  ],
  sectionOrder: [...CV_SECTION_KEYS],
  sections: {
    summary: true,
    education: true,
    skills: true,
    projects: true,
    leadership: true,
    creative: true,
    languages: true,
    events: false,
    journey: false,
    certificates: false,
  },
  limits: {
    projects: 6,
    roles: 6,
    events: 4,
    creative: 5,
    certificates: 5,
    journey: 6,
  },
  featuredProjectsOnly: false,
};

export type PortfolioContent = {
  profile: {
    name: string;
    shortName: string;
    headline: string;
    intro: string;
    bio: string;
    location: string;
    university: string;
    focus: string;
    availability: string;
    email: string; // Leave blank until you choose a public contact email.
    github: string;
    linkedin: string; // Leave blank until confirmed.
    website: string;
    portrait: string; // Replace with /my-photo.jpg after putting it in public/.
  };
  education?: EducationEntry[];
  skills: { group: string; items: string[] }[];
  projects: Project[];
  roles: Role[];
  events: EventEntry[];
  creative: CreativeWork[];
  journey: Milestone[];
  certificates: Certificate[];
  cvSettings?: CvSettings | undefined;
};

export const defaultPortfolio: PortfolioContent = {
  profile: {
    name: "Binoj Charuka Bandara Kumburegama",
    shortName: "Binoj Charuka",
    headline: "Electronics undergraduate, developer & creative builder.",
    intro:
      "I bring together technology, design and student leadership to build useful digital experiences.",
    bio: "I'm an undergraduate in the Department of Electronics at Wayamba University of Sri Lanka. I enjoy building web tools that solve everyday problems, exploring electronics, and contributing to student communities through IEEE volunteering. I also create visual identities and event graphics — often moving between code and design in the same project.",
    location: "Sri Lanka",
    university: "Wayamba University of Sri Lanka",
    focus: "Web • Electronics • Design",
    availability: "Open to collaborations",
    email: "",
    github: "https://github.com/BinojCharuka",
    linkedin: "",
    website: "https://charudesignstudio.us",
    portrait: "/profile.png",
  },
  education: [
    {
      institution: "Wayamba University of Sri Lanka",
      degree: "B.Sc. (Hons) Undergraduate",
      field: "Department of Electronics, Faculty of Applied Sciences",
      period: "2025 – Present",
      description:
        "Currently pursuing an undergraduate degree at the Faculty of Applied Sciences, Wayamba University of Sri Lanka. Developing knowledge and practical skills in computing, software development, and technology while actively engaging in academic projects, extracurricular activities, and student community initiatives.",
      highlights: [
        "Department of Electronics, Faculty of Applied Sciences",
        "Active student member in IEEE Student Branch WUSL",
        "Publicity and creative design lead for university initiatives",
      ],
      logo: "/assets/education/wusl.svg",
    },
    {
      institution: "Ananda College",
      degree: "Secondary Education",
      field: "Mathematics",
      period: "2021 – 2024",
      description:
        "Completed my secondary education from Ananda College, successfully passing the G.C.E. Ordinary Level (O/L) examination and continuing my studies until the G.C.E. Advanced Level (A/L) examination. Followed the Physical Science stream, specializing in Combined Mathematics, Physics, and Information & Communication Technology (ICT).",
      highlights: [
        "Physical Science Stream (A/L)",
        "Combined Mathematics, Physics & ICT",
      ],
      logo: "/assets/education/ananda.svg",
    },
    {
      institution: "Rajasinghe Central College",
      degree: "Primary Education",
      field: "From Grade 6 – 11",
      period: "2015 – 2021",
      description:
        "Completed secondary education from Grade 6 to Grade 11 at Rajasinghe Central College, building a strong academic foundation and developing essential skills in teamwork, communication, and personal development. Successfully completed the G.C.E. Ordinary Level (O/L) examination.",
      highlights: [
        "G.C.E. Ordinary Level (O/L) Examination",
        "Foundational education and skills development",
      ],
      logo: "/assets/education/rajasinghe.svg",
    },
  ],
  skills: [
    {
      group: "Development",
      items: [
        "JavaScript & TypeScript",
        "React / Next.js",
        "HTML & CSS",
        "SQL & Databases",
        "Java / OOP",
      ],
    },
    {
      group: "Tools & Platforms",
      items: ["Git & GitHub", "Tailwind CSS", "Figma", "Canva", "Cloudinary", "Vercel"],
    },
    {
      group: "Exploring",
      items: [
        "Electronics",
        "UI / UX",
        "Web Applications",
        "Creative Design",
        "Team Collaboration",
      ],
    },
  ],
  projects: [
    {
      slug: "pdf-mithura",
      name: "PDF Mithura",
      tagline: "Everyday PDF tasks, without the clutter.",
      description:
        "A browser-based PDF toolkit for common document workflows, including image conversion, merging, splitting and compression. Designed to be simple to use on phones and desktops.",
      categories: ["Web Tool", "PDF", "Browser-first"],
      year: "2026",
      status: "Live",
      featured: true,
      liveUrl: "https://pdfmithura.charudesignstudio.us",
      highlights: [
        "PDF ↔ image conversion",
        "Merge, split and compression options",
        "Browser-focused workflow",
      ],
      images: [
        "/assets/projects/pdf-mithura-editor.jpg",
        "/assets/projects/pdf-mithura-preview.jpg",
      ],
    },
    {
      slug: "gpa-calculator",
      name: "GPA Calculator",
      tagline: "Make academic planning a little easier.",
      description:
        "A dedicated web tool for calculating and reviewing grade-point averages. Created with student convenience and a clear interface in mind.",
      categories: ["Education", "Web Tool"],
      year: "2026",
      status: "Live",
      featured: true,
      liveUrl: "https://gpa.charudesignstudio.us",
      highlights: [
        "Student-focused workflow",
        "Clear input and results",
        "Responsive web experience",
      ],
      images: [
        "/assets/projects/gpa-1.jpg",
        "/assets/projects/gpa-2.jpg",
      ],
    },
    {
      slug: "ieeextreme-region-10",
      name: "IEEEXtreme R10",
      tagline: "An event hub for a global coding community.",
      description:
        "A regional IEEEXtreme event website featuring event information, a Region 10 map and a registration pathway.",
      categories: ["IEEE", "Event Website", "Frontend"],
      year: "2026",
      status: "Live",
      featured: true,
      liveUrl: "https://xtreme-r10.vercel.app",
      highlights: [
        "Region 10 event information",
        "Interactive regional map",
        "Event registration navigation",
      ],
      images: [
        "/assets/projects/xtreme-1.jpg",
        "/assets/projects/xtreme-2.jpg",
      ],
    },
    {
      slug: "charu-design-studio",
      name: "Charu Design Studio",
      tagline: "A home for digital ideas and creative work.",
      description:
        "A personal web presence connecting design, development and a collection of utility projects.",
      categories: ["Portfolio", "Branding", "Web"],
      year: "2026",
      status: "Live",
      featured: true,
      liveUrl: "https://charudesignstudio.us",
      highlights: ["Digital project showcase", "Personal brand", "Connected web utilities"],
      images: [
        "/assets/projects/studio-1.jpg",
        "/assets/projects/studio-2.jpg",
      ],
    },
    {
      slug: "lab-graph-helper",
      name: "Lab Graph Helper",
      tagline: "Making graph-paper scaling less frustrating.",
      description:
        "A graph planning concept for choosing axis scales from minimum and maximum readings, plotting multiple curves and preparing graph-paper layouts for lab work.",
      categories: ["Education", "Electronics", "In development"],
      year: "2026",
      status: "In progress",
      highlights: [
        "Automatic scale planning",
        "Multi-curve plotting concept",
        "Graph-paper export direction",
      ],
    },
    {
      slug: "divido-finance",
      name: "Divido Finance",
      tagline: "A student project exploring personal finance UI.",
      description:
        "An object-oriented programming project concept for a finance management application, with attention to clear information architecture and a simple visual system.",
      categories: ["OOP", "Finance UI", "Student Project"],
      year: "2026",
      status: "In progress",
      highlights: [
        "Object-oriented application design",
        "Finance-oriented interface",
        "Component-focused visual identity",
      ],
    },
  ],
  roles: [
    {
      slug: "ieee-day-2026",
      title: "PV Lead OC",
      group: "IEEE Day 2026",
      year: "2026",
      organization: "IEEE Student Branch — WUSL",
      description: "Leading publicity and visual communications work for the organizing committee.",
      details:
        "As the Publicity & Visuals (PV) Lead for IEEE Day 2026, spearheaded end-to-end creative campaign direction, promotional asset design, and strategic digital outreach. Orchestrated volunteer designers to execute high-impact countdown visuals, event collateral, and community announcements that amplified student branch engagement across regional networks.",
      highlights: [
        "Led creative direction and visual identity for all IEEE Day 2026 promotions",
        "Managed a team of volunteer designers across countdowns, posters, and social campaigns",
        "Coordinated closely with branch executive committee on communications strategy",
        "Drove cross-platform student engagement and event visibility across university channels",
      ],
    },
    {
      slug: "ieee-student-branch-wusl",
      title: "PC OC Member",
      group: "IEEE Student Branch — WUSL",
      year: "2026",
      organization: "Wayamba University of Sri Lanka",
      description: "Contributing to student branch activities and coordination.",
      details:
        "Serving as an active Program Coordination (PC) Organizing Committee member within the IEEE Student Branch at Wayamba University of Sri Lanka. Actively supporting technical sessions, workshop scheduling, speaker coordination, and cross-team synchronization to deliver impactful community programs.",
      highlights: [
        "Assisted in structuring program agendas and event timelines for student workshops",
        "Coordinated with guest speakers, session hosts, and student attendees",
        "Facilitated logistical workflows and member support during branch technical events",
      ],
    },
    {
      slug: "futurequest-sl-inspire",
      title: "PV OC",
      group: "FutureQuest — SL Inspire",
      year: "2026",
      organization: "SL Inspire",
      description: "Supporting event publicity and organizing work.",
      details:
        "Contributed to the Publicity and Visuals Organizing Committee for FutureQuest by SL Inspire. Conceptualized and crafted digital promotional banners, social media marketing designs, and community flyers to inspire and engage young leaders and student innovators.",
      highlights: [
        "Crafted cohesive visual media for social promotion and outreach",
        "Collaborated with the central organizing team on messaging and event branding",
        "Supported live event coverage and participant communications",
      ],
    },
    {
      slug: "sgd-sprint",
      title: "PV OC",
      group: "SGD Sprint",
      year: "2026",
      organization: "Student Developer Community",
      description: "Contributing to promotional and creative event work.",
      details:
        "Member of the Publicity & Visuals Organizing Committee for the SGD Sprint developer competition. Designed promotional flyers, rule infographics, and announcement artworks that conveyed competition tracks clearly and energized student teams.",
      highlights: [
        "Designed competition promotional graphics and track announcement collateral",
        "Maintained consistent brand guidelines across social posts and digital banners",
        "Contributed to participant communications and engagement materials",
      ],
    },
    {
      slug: "jamborieee",
      title: "PV OC",
      group: "JAMBORIEEE",
      year: "2025",
      organization: "IEEE Sri Lanka Section / Student Branches",
      description: "Supporting event communications as an organizing committee member.",
      details:
        "Contributed to the Organizing Committee for JAMBORIEEE 2025, a landmark gathering of IEEE student members. Spearheaded promotional graphic rollouts, schedule infographics, and attendee communication assets that fostered enthusiasm and unified team representation.",
      highlights: [
        "Coordinated and produced event countdowns, schedule cards, and banners",
        "Supported cross-branch volunteer communications and media coordination",
        "Helped drive active participation through clear, compelling promotional visuals",
      ],
    },
  ],
  events: [
    {
      slug: "ieeextreme-20",
      title: "IEEEXtreme 20.0",
      group: "IEEE",
      role: "Event communications & creative contributions",
      year: "2026",
      summary:
        "Countdowns, informational graphics and competition communications for IEEEXtreme 20.0.",
      highlights: [
        "Competition countdown content",
        "Rules and timing communications",
        "Digital promotional materials",
      ],
    },
    {
      slug: "ieee-day-2026",
      title: "IEEE Day 2026",
      group: "IEEE Student Branch — WUSL",
      role: "PV Lead OC",
      year: "2026",
      summary: "Publicity and visual communication contributions supporting IEEE Day celebrations.",
      highlights: ["Publicity coordination", "Creative campaign materials", "Team collaboration"],
    },
    {
      slug: "ai-driven-sri-lanka",
      title: "AI Driven Sri Lanka Collaboration",
      group: "IEEE Student Branch — WUSL",
      role: "Creative and promotional contributions",
      year: "2026",
      summary: "Creative communications for an AI-focused community collaboration.",
      highlights: ["Event announcement designs", "Speaker reveal concepts", "Countdown creatives"],
    },
    {
      slug: "jamborieee",
      title: "JAMBORIEEE",
      group: "IEEE",
      role: "PV OC",
      year: "2025",
      summary: "Volunteering and publicity contributions as part of an IEEE organizing committee.",
      highlights: ["Organizing committee contribution", "Event graphics", "Publicity coordination"],
    },
    {
      slug: "prayaama-2026",
      title: "Prayaama — 8th Community Service Project",
      group: "Electronics Society — WUSL",
      role: "Community service",
      year: "2026",
      summary:
        "A community service initiative associated with the Electronics Society at Wayamba University of Sri Lanka.",
      highlights: [
        "Community engagement",
        "Student-led volunteering",
        "University society initiative",
      ],
    },
  ],
  creative: [
    {
      slug: "ieeextreme-campaign",
      title: "IEEEXtreme campaign",
      category: "Event Graphics",
      context: "Countdowns, rules and event-day communication design.",
      year: "2026",
    },
    {
      slug: "ai-speaker-reveal",
      title: "AI speaker reveals",
      category: "Social Design",
      context: "Speaker announcements, event teasers and social visuals.",
      year: "2026",
    },
    {
      slug: "ieee-day-visuals",
      title: "IEEE Day visuals",
      category: "Brand Communication",
      context: "Publicity materials supporting student volunteering.",
      year: "2026",
    },
    {
      slug: "divido-identity",
      title: "Divido identity",
      category: "UI & Branding",
      context: "Finance-inspired brand exploration and interface visuals.",
      year: "2026",
    },
    {
      slug: "charu-digital",
      title: "Charu Design Studio",
      category: "Web & Identity",
      context: "Website and brand explorations across independent projects.",
      year: "2026",
    },
  ],
  journey: [
    {
      when: "2026",
      what: "Building useful student tools",
      where: "Independent web projects",
      detail: "PDF, GPA and lab-support web ideas.",
    },
    {
      when: "2026",
      what: "IEEE organizing and creative leadership",
      where: "IEEE Student Branch — WUSL",
      detail: "Publicity, volunteer coordination and design.",
    },
    {
      when: "2025–2026",
      what: "Volunteering and community projects",
      where: "University societies",
      detail: "Student-led events and community service.",
    },
    {
      when: "Currently",
      what: "Undergraduate — Department of Electronics",
      where: "Wayamba University of Sri Lanka",
      detail: "Electronics, software and applied problem-solving.",
    },
  ],
  certificates: [
    {
      slug: "web-design-fundamentals",
      title: "Web Design & Frontend Development",
      issuer: "University of Moratuwa / Open Learning",
      year: "2026",
      image: "https://res.cloudinary.com/zeotuhzt/image/upload/v1794213634/portfolio/media/nvoozpzk19ar1ckagpxr.png",
      description:
        "Comprehensive certification verifying core principles of user interface design, modern web typography, responsiveness, and frontend architecture.",
      details:
        "Completed coursework and applied practical assessments covering HTML5 semantic structure, modern CSS responsive frameworks, interactive clientside JavaScript, and user-centric design principles.",
      skills: ["UI/UX Design", "Responsive Layouts", "HTML5 & CSS3", "Frontend Architecture", "Web Standards"],
      highlights: [
        "Practical design assessments in responsive web applications",
        "Comprehensive coverage of UX heuristics and modern design systems",
        "Demonstrated proficiency in frontend best practices and accessibility",
      ],
      credentialId: "UOM-WEB-2026-BC",
    },
    {
      slug: "ieee-leadership-volunteering",
      title: "IEEE Volunteer Leadership & Community Service",
      issuer: "IEEE Sri Lanka Section",
      year: "2026",
      description:
        "Recognition for outstanding commitment and proactive leadership across student branch activities, publicity campaigns, and technical event coordination.",
      details:
        "Awarded in recognition of dedicated service and leadership within the IEEE Student Branch and organizing committees, driving successful community initiatives and visual communication campaigns.",
      skills: ["Community Leadership", "Event Coordination", "Publicity Strategy", "Team Collaboration"],
      highlights: [
        "Led publicity and visual communications for regional IEEE initiatives",
        "Coordinated technical sessions and student development workshops",
        "Demonstrated exemplary volunteer leadership and cross-branch collaboration",
      ],
      credentialId: "IEEE-SL-VOL-2026",
    },
    {
      slug: "applied-electronics-computing",
      title: "Applied Electronics & Computing",
      issuer: "Wayamba University of Sri Lanka",
      year: "2025",
      description:
        "Academic milestone verifying core competency in electronic circuits, microcontroller interfacing, embedded systems, and algorithmic problem-solving.",
      details:
        "Recognized for academic achievement and laboratory project work combining hardware electronics with software computational analysis.",
      skills: ["Circuit Design", "Embedded Systems", "Hardware-Software Interfacing", "Technical Problem Solving"],
      highlights: [
        "Laboratory experimentation and hardware circuit validation",
        "Interfacing sensors, controllers, and computational software",
        "Applied project execution with documented technical reports",
      ],
      credentialId: "WUSL-ELEC-2025",
    },
  ],
  cvSettings: defaultCvSettings,
};

export const allProjectCategories = [
  "All",
  "Web Tool",
  "Education",
  "IEEE",
  "Portfolio",
  "OOP",
  "Electronics",
];

/** Detailed validation that returns a list of structural error descriptions */
export function getPortfolioValidationErrors(value: unknown): string[] {
  const errors: string[] = [];
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return ["Payload must be a non-null object."];
  }
  const root = value as Record<string, unknown>;

  // 1. Profile validation
  if (!root["profile"] || typeof root["profile"] !== "object" || Array.isArray(root["profile"])) {
    errors.push("Missing or invalid 'profile' object.");
  } else {
    const p = root["profile"] as Record<string, unknown>;
    const requiredProfileKeys = [
      "name",
      "shortName",
      "headline",
      "intro",
      "bio",
      "location",
      "university",
      "focus",
      "availability",
      "email",
      "github",
      "linkedin",
      "website",
      "portrait",
    ];
    for (const key of requiredProfileKeys) {
      if (typeof p[key] !== "string") {
        errors.push(`profile.${key} must be a string.`);
      }
    }
  }

  const isStringOrNil = (v: unknown): boolean =>
    v === undefined || v === null || typeof v === "string";

  const isStringListOrNil = (v: unknown): boolean =>
    v === undefined || v === null || (Array.isArray(v) && v.every((x) => typeof x === "string"));

  // 2. Education validation (optional)
  if (root["education"] !== undefined && root["education"] !== null) {
    if (!Array.isArray(root["education"])) {
      errors.push("'education' must be an array.");
    } else {
      root["education"].forEach((item, idx) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          errors.push(`education[${idx}] must be an object.`);
          return;
        }
        const row = item as Record<string, unknown>;
        if (typeof row["institution"] !== "string") errors.push(`education[${idx}].institution must be a string.`);
        if (typeof row["degree"] !== "string") errors.push(`education[${idx}].degree must be a string.`);
        if (typeof row["period"] !== "string") errors.push(`education[${idx}].period must be a string.`);
        if (!isStringOrNil(row["field"])) errors.push(`education[${idx}].field must be a string if provided.`);
        if (!isStringOrNil(row["description"])) errors.push(`education[${idx}].description must be a string if provided.`);
        if (!isStringOrNil(row["logo"])) errors.push(`education[${idx}].logo must be a string if provided.`);
        if (!isStringListOrNil(row["highlights"])) errors.push(`education[${idx}].highlights must be a string array if provided.`);
      });
    }
  }

  // 3. Projects validation (optional array or empty)
  if (root["projects"] !== undefined && root["projects"] !== null) {
    if (!Array.isArray(root["projects"])) {
      errors.push("'projects' must be an array.");
    } else {
      root["projects"].forEach((item, idx) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          errors.push(`projects[${idx}] must be an object.`);
          return;
        }
        const row = item as Record<string, unknown>;
        if (typeof row["slug"] !== "string") errors.push(`projects[${idx}].slug must be a string.`);
        if (typeof row["name"] !== "string") errors.push(`projects[${idx}].name must be a string.`);
        if (!isStringOrNil(row["tagline"])) errors.push(`projects[${idx}].tagline must be a string if provided.`);
        if (!isStringOrNil(row["description"])) errors.push(`projects[${idx}].description must be a string if provided.`);
        if (!isStringOrNil(row["year"])) errors.push(`projects[${idx}].year must be a string if provided.`);
        if (!isStringListOrNil(row["categories"])) errors.push(`projects[${idx}].categories must be a string array.`);
        if (!isStringListOrNil(row["highlights"])) errors.push(`projects[${idx}].highlights must be a string array.`);
        if (!isStringOrNil(row["liveUrl"])) errors.push(`projects[${idx}].liveUrl must be a string if provided.`);
        if (!isStringOrNil(row["sourceUrl"])) errors.push(`projects[${idx}].sourceUrl must be a string if provided.`);
        if (row["featured"] !== undefined && row["featured"] !== null && typeof row["featured"] !== "boolean") {
          errors.push(`projects[${idx}].featured must be a boolean if provided.`);
        }
        if (!isStringListOrNil(row["images"])) {
          errors.push(`projects[${idx}].images must be a string array if provided.`);
        }
      });
    }
  }

  // 4. Events validation
  if (root["events"] !== undefined && root["events"] !== null) {
    if (!Array.isArray(root["events"])) {
      errors.push("'events' must be an array.");
    } else {
      root["events"].forEach((item, idx) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          errors.push(`events[${idx}] must be an object.`);
          return;
        }
        const row = item as Record<string, unknown>;
        if (typeof row["slug"] !== "string") errors.push(`events[${idx}].slug must be a string.`);
        if (typeof row["title"] !== "string") errors.push(`events[${idx}].title must be a string.`);
        if (typeof row["group"] !== "string") errors.push(`events[${idx}].group must be a string.`);
        if (typeof row["role"] !== "string") errors.push(`events[${idx}].role must be a string.`);
        if (typeof row["year"] !== "string") errors.push(`events[${idx}].year must be a string.`);
        if (typeof row["summary"] !== "string") errors.push(`events[${idx}].summary must be a string.`);
        if (!isStringListOrNil(row["highlights"])) errors.push(`events[${idx}].highlights must be a string array.`);
        if (!isStringListOrNil(row["images"])) errors.push(`events[${idx}].images must be a string array if provided.`);
      });
    }
  }

  // 5. Creative works validation
  if (root["creative"] !== undefined && root["creative"] !== null) {
    if (!Array.isArray(root["creative"])) {
      errors.push("'creative' must be an array.");
    } else {
      root["creative"].forEach((item, idx) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          errors.push(`creative[${idx}] must be an object.`);
          return;
        }
        const row = item as Record<string, unknown>;
        if (typeof row["slug"] !== "string") errors.push(`creative[${idx}].slug must be a string.`);
        if (typeof row["title"] !== "string") errors.push(`creative[${idx}].title must be a string.`);
        if (typeof row["category"] !== "string") errors.push(`creative[${idx}].category must be a string.`);
        if (typeof row["context"] !== "string" && typeof row["description"] !== "string") {
          errors.push(`creative[${idx}].context must be a string.`);
        }
        if (typeof row["year"] !== "string") errors.push(`creative[${idx}].year must be a string.`);
        if (!isStringOrNil(row["image"])) errors.push(`creative[${idx}].image must be a string if provided.`);
        if (!isStringListOrNil(row["images"])) errors.push(`creative[${idx}].images must be a string array if provided.`);
      });
    }
  }

  // 6. Certificates validation (optional)
  if (root["certificates"] !== undefined && root["certificates"] !== null) {
    if (!Array.isArray(root["certificates"])) {
      errors.push("'certificates' must be an array.");
    } else {
      root["certificates"].forEach((item, idx) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          errors.push(`certificates[${idx}] must be an object.`);
          return;
        }
        const row = item as Record<string, unknown>;
        if (typeof row["title"] !== "string") errors.push(`certificates[${idx}].title must be a string.`);
        if (typeof row["issuer"] !== "string") errors.push(`certificates[${idx}].issuer must be a string.`);
        if (typeof row["year"] !== "string") errors.push(`certificates[${idx}].year must be a string.`);
        if (!isStringOrNil(row["slug"])) errors.push(`certificates[${idx}].slug must be a string if provided.`);
        if (!isStringOrNil(row["description"])) errors.push(`certificates[${idx}].description must be a string if provided.`);
        if (!isStringOrNil(row["details"])) errors.push(`certificates[${idx}].details must be a string if provided.`);
        if (!isStringListOrNil(row["skills"])) errors.push(`certificates[${idx}].skills must be a string array if provided.`);
        if (!isStringListOrNil(row["highlights"])) errors.push(`certificates[${idx}].highlights must be a string array if provided.`);
        if (!isStringOrNil(row["url"])) errors.push(`certificates[${idx}].url must be a string if provided.`);
        if (!isStringOrNil(row["image"])) errors.push(`certificates[${idx}].image must be a string if provided.`);
        if (!isStringOrNil(row["credentialId"])) errors.push(`certificates[${idx}].credentialId must be a string if provided.`);
        if (!isStringOrNil(row["url"])) errors.push(`certificates[${idx}].url must be a string if provided.`);
        if (!isStringOrNil(row["image"])) errors.push(`certificates[${idx}].image must be a string if provided.`);
      });
    }
  }

  // 7. Skills validation
  if (root["skills"] !== undefined && root["skills"] !== null) {
    if (!Array.isArray(root["skills"])) {
      errors.push("'skills' must be an array.");
    } else {
      root["skills"].forEach((item, idx) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          errors.push(`skills[${idx}] must be an object.`);
          return;
        }
        const row = item as Record<string, unknown>;
        if (typeof row["group"] !== "string") errors.push(`skills[${idx}].group must be a string.`);
        if (!isStringListOrNil(row["items"])) errors.push(`skills[${idx}].items must be a string array.`);
      });
    }
  }

  // 8. Roles validation
  if (root["roles"] !== undefined && root["roles"] !== null) {
    if (!Array.isArray(root["roles"])) {
      errors.push("'roles' must be an array.");
    } else {
      root["roles"].forEach((item, idx) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          errors.push(`roles[${idx}] must be an object.`);
          return;
        }
        const row = item as Record<string, unknown>;
        if (typeof row["title"] !== "string") errors.push(`roles[${idx}].title must be a string.`);
        if (typeof row["group"] !== "string") errors.push(`roles[${idx}].group must be a string.`);
        if (typeof row["description"] !== "string") errors.push(`roles[${idx}].description must be a string.`);
        if (typeof row["year"] !== "string") errors.push(`roles[${idx}].year must be a string.`);
        if (!isStringOrNil(row["slug"])) errors.push(`roles[${idx}].slug must be a string if provided.`);
        if (!isStringOrNil(row["details"])) errors.push(`roles[${idx}].details must be a string if provided.`);
        if (!isStringListOrNil(row["highlights"])) errors.push(`roles[${idx}].highlights must be a string array if provided.`);
        if (!isStringOrNil(row["organization"])) errors.push(`roles[${idx}].organization must be a string if provided.`);
        if (!isStringOrNil(row["link"])) errors.push(`roles[${idx}].link must be a string if provided.`);
        if (!isStringListOrNil(row["images"])) errors.push(`roles[${idx}].images must be a string array if provided.`);
      });
    }
  }

  // 9. Journey validation
  if (root["journey"] !== undefined && root["journey"] !== null) {
    if (!Array.isArray(root["journey"])) {
      errors.push("'journey' must be an array.");
    } else {
      root["journey"].forEach((item, idx) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          errors.push(`journey[${idx}] must be an object.`);
          return;
        }
        const row = item as Record<string, unknown>;
        if (typeof row["when"] !== "string") errors.push(`journey[${idx}].when must be a string.`);
        if (typeof row["what"] !== "string") errors.push(`journey[${idx}].what must be a string.`);
        if (typeof row["where"] !== "string") errors.push(`journey[${idx}].where must be a string.`);
        if (!isStringOrNil(row["detail"])) errors.push(`journey[${idx}].detail must be a string if provided.`);
      });
    }
  }

  // 10. CV settings validation (optional object for backward compatibility with older records)
  if (root["cvSettings"] !== undefined && root["cvSettings"] !== null) {
    if (typeof root["cvSettings"] !== "object" || Array.isArray(root["cvSettings"])) {
      errors.push("'cvSettings' must be an object.");
    } else {
      const cv = root["cvSettings"] as Record<string, unknown>;
      const boolKeys = [
        "enabled",
        "briefMode",
        "compactMode",
        "includeLinks",
        "includeProjectLinks",
        "includeProjectHighlights",
        "includeCertificatesDetails",
        "featuredProjectsOnly",
      ];
      for (const k of boolKeys) {
        if (cv[k] !== undefined && cv[k] !== null && typeof cv[k] !== "boolean") {
          errors.push(`cvSettings.${k} must be a boolean.`);
        }
      }
      const strKeys = ["buttonLabel", "fileName", "headlineOverride", "summaryOverride", "phone"];
      for (const k of strKeys) {
        if (!isStringOrNil(cv[k])) {
          errors.push(`cvSettings.${k} must be a string if provided.`);
        }
      }
      if (
        cv["paperSize"] !== undefined &&
        cv["paperSize"] !== null &&
        cv["paperSize"] !== "a4" &&
        cv["paperSize"] !== "letter"
      ) {
        errors.push("cvSettings.paperSize must be 'a4' or 'letter'.");
      }
      if (
        cv["fontStyle"] !== undefined &&
        cv["fontStyle"] !== null &&
        cv["fontStyle"] !== "sans" &&
        cv["fontStyle"] !== "serif"
      ) {
        errors.push("cvSettings.fontStyle must be 'sans' or 'serif'.");
      }
      if (cv["languages"] !== undefined && cv["languages"] !== null) {
        if (!Array.isArray(cv["languages"])) {
          errors.push("cvSettings.languages must be an array.");
        } else {
          cv["languages"].forEach((item, idx) => {
            if (!item || typeof item !== "object" || Array.isArray(item)) {
              errors.push(`cvSettings.languages[${idx}] must be an object.`);
              return;
            }
            const lang = item as Record<string, unknown>;
            if (typeof lang["name"] !== "string") {
              errors.push(`cvSettings.languages[${idx}].name must be a string.`);
            }
            if (!isStringOrNil(lang["proficiency"])) {
              errors.push(`cvSettings.languages[${idx}].proficiency must be a string.`);
            }
          });
        }
      }
      if (!isStringListOrNil(cv["sectionOrder"])) {
        errors.push("cvSettings.sectionOrder must be a string array.");
      }
      if (cv["sections"] !== undefined && cv["sections"] !== null) {
        if (typeof cv["sections"] !== "object" || Array.isArray(cv["sections"])) {
          errors.push("cvSettings.sections must be an object.");
        } else {
          const secs = cv["sections"] as Record<string, unknown>;
          for (const key of CV_SECTION_KEYS) {
            if (secs[key] !== undefined && secs[key] !== null && typeof secs[key] !== "boolean") {
              errors.push(`cvSettings.sections.${key} must be a boolean.`);
            }
          }
        }
      }
      if (cv["limits"] !== undefined && cv["limits"] !== null) {
        if (typeof cv["limits"] !== "object" || Array.isArray(cv["limits"])) {
          errors.push("cvSettings.limits must be an object.");
        } else {
          const lim = cv["limits"] as Record<string, unknown>;
          for (const key of ["projects", "roles", "events", "creative", "certificates", "journey"]) {
            if (
              lim[key] !== undefined &&
              lim[key] !== null &&
              (typeof lim[key] !== "number" || !Number.isFinite(lim[key]) || lim[key] < 0)
            ) {
              errors.push(`cvSettings.limits.${key} must be a non-negative number.`);
            }
          }
        }
      }
    }
  }

  return errors;
}

/** Resolve any partial or omitted CV settings object into a complete configuration. */
export function resolveCvSettings(value?: unknown): CvSettings {
  const raw =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  const str = (key: keyof CvSettings, fallback: string) =>
    typeof raw[key] === "string" ? (raw[key] as string) : fallback;
  const bool = (key: keyof CvSettings, fallback: boolean) =>
    typeof raw[key] === "boolean" ? (raw[key] as boolean) : fallback;

  const rawPaper = raw["paperSize"];
  const paperSize: CvSettings["paperSize"] = rawPaper === "letter" ? "letter" : "a4";
  const rawFont = raw["fontStyle"];
  const fontStyle: CvSettings["fontStyle"] = rawFont === "serif" ? "serif" : "sans";

  const rawLanguages = Array.isArray(raw["languages"])
    ? raw["languages"]
        .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
        .map((item) => ({
          name: typeof item["name"] === "string" ? item["name"] : "",
          proficiency: typeof item["proficiency"] === "string" ? item["proficiency"] : "",
        }))
    : defaultCvSettings.languages.map((entry) => ({ ...entry }));

  const validKeys = new Set<string>(CV_SECTION_KEYS);
  const incomingOrder = Array.isArray(raw["sectionOrder"])
    ? raw["sectionOrder"].filter((k): k is CvSectionKey => typeof k === "string" && validKeys.has(k))
    : [];
  const sectionOrder: CvSectionKey[] = [];
  for (const key of incomingOrder) {
    if (!sectionOrder.includes(key)) sectionOrder.push(key);
  }
  for (const key of CV_SECTION_KEYS) {
    if (!sectionOrder.includes(key)) sectionOrder.push(key);
  }

  const rawSections =
    raw["sections"] && typeof raw["sections"] === "object" && !Array.isArray(raw["sections"])
      ? (raw["sections"] as Record<string, unknown>)
      : {};
  const sections: Record<CvSectionKey, boolean> = { ...defaultCvSettings.sections };
  for (const key of CV_SECTION_KEYS) {
    if (typeof rawSections[key] === "boolean") {
      sections[key] = rawSections[key] as boolean;
    }
  }

  const rawLimits =
    raw["limits"] && typeof raw["limits"] === "object" && !Array.isArray(raw["limits"])
      ? (raw["limits"] as Record<string, unknown>)
      : {};
  const clampLimit = (v: unknown, fallback: number): number =>
    typeof v === "number" && Number.isFinite(v) ? Math.max(0, Math.min(50, Math.round(v))) : fallback;

  return {
    enabled: bool("enabled", defaultCvSettings.enabled),
    buttonLabel: str("buttonLabel", defaultCvSettings.buttonLabel),
    fileName: str("fileName", defaultCvSettings.fileName),
    paperSize,
    fontStyle,
    briefMode: bool("briefMode", defaultCvSettings.briefMode),
    compactMode: bool("compactMode", defaultCvSettings.compactMode),
    includeLinks: bool("includeLinks", defaultCvSettings.includeLinks),
    includeProjectLinks: bool("includeProjectLinks", defaultCvSettings.includeProjectLinks),
    includeProjectHighlights: bool(
      "includeProjectHighlights",
      defaultCvSettings.includeProjectHighlights,
    ),
    includeCertificatesDetails: bool(
      "includeCertificatesDetails",
      defaultCvSettings.includeCertificatesDetails,
    ),
    headlineOverride: str("headlineOverride", defaultCvSettings.headlineOverride),
    summaryOverride: str("summaryOverride", defaultCvSettings.summaryOverride),
    phone: str("phone", defaultCvSettings.phone),
    languages: rawLanguages,
    sectionOrder,
    sections,
    limits: {
      projects: clampLimit(rawLimits["projects"], defaultCvSettings.limits.projects),
      roles: clampLimit(rawLimits["roles"], defaultCvSettings.limits.roles),
      events: clampLimit(rawLimits["events"], defaultCvSettings.limits.events),
      creative: clampLimit(rawLimits["creative"], defaultCvSettings.limits.creative),
      certificates: clampLimit(rawLimits["certificates"], defaultCvSettings.limits.certificates),
      journey: clampLimit(rawLimits["journey"], defaultCvSettings.limits.journey),
    },
    featuredProjectsOnly: bool("featuredProjectsOnly", defaultCvSettings.featuredProjectsOnly),
  };
}

/**
 * Normalizes any partial, legacy, or loosely structured portfolio payload
 * into a complete and strictly valid PortfolioContent object.
 * Guarantees zero validation errors while preserving all user edits.
 */
export function normalizePortfolio(value: unknown): PortfolioContent {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return defaultPortfolio;
  }
  const root = value as Record<string, unknown>;
  const rawProfile =
    root["profile"] && typeof root["profile"] === "object" && !Array.isArray(root["profile"])
      ? (root["profile"] as Record<string, unknown>)
      : {};

  const cleanString = (v: unknown, fallback = ""): string =>
    typeof v === "string" ? v : fallback;

  const cleanStringList = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

  const profile: PortfolioContent["profile"] = {
    name: cleanString(rawProfile["name"], defaultPortfolio.profile.name),
    shortName: cleanString(rawProfile["shortName"], defaultPortfolio.profile.shortName),
    headline: cleanString(rawProfile["headline"], defaultPortfolio.profile.headline),
    intro: cleanString(rawProfile["intro"], defaultPortfolio.profile.intro),
    bio: cleanString(rawProfile["bio"], defaultPortfolio.profile.bio),
    location: cleanString(rawProfile["location"], defaultPortfolio.profile.location),
    university: cleanString(rawProfile["university"], defaultPortfolio.profile.university),
    focus: cleanString(rawProfile["focus"], defaultPortfolio.profile.focus),
    availability: cleanString(rawProfile["availability"], defaultPortfolio.profile.availability),
    email: cleanString(rawProfile["email"], defaultPortfolio.profile.email),
    github: cleanString(rawProfile["github"], defaultPortfolio.profile.github),
    linkedin: cleanString(rawProfile["linkedin"], defaultPortfolio.profile.linkedin),
    website: cleanString(rawProfile["website"], defaultPortfolio.profile.website),
    portrait: cleanString(rawProfile["portrait"], defaultPortfolio.profile.portrait),
  };

  const education: EducationEntry[] = Array.isArray(root["education"])
    ? root["education"].map((item) => {
        const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        const entry: EducationEntry = {
          institution: cleanString(row["institution"], "Institution"),
          degree: cleanString(row["degree"], "Degree"),
          period: cleanString(row["period"], "2024 – Present"),
          highlights: cleanStringList(row["highlights"]),
          ...(typeof row["field"] === "string" ? { field: row["field"] } : {}),
          ...(typeof row["description"] === "string" ? { description: row["description"] } : {}),
          ...(typeof row["logo"] === "string" ? { logo: row["logo"] } : {}),
        };
        return entry;
      })
    : (defaultPortfolio.education ?? []);

  const projects: Project[] = Array.isArray(root["projects"])
    ? root["projects"].map((item) => {
        const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        const imagesRaw = cleanStringList(row["images"]);
        const p: Project = {
          slug: cleanString(row["slug"], "project"),
          name: cleanString(row["name"], "Project"),
          tagline: cleanString(row["tagline"], ""),
          description: cleanString(row["description"], ""),
          categories: cleanStringList(row["categories"]),
          year: cleanString(row["year"], "2026"),
          status: (["Live", "In progress", "Concept"].includes(String(row["status"]))
            ? row["status"]
            : "Live") as Project["status"],
          highlights: cleanStringList(row["highlights"]),
          ...(typeof row["liveUrl"] === "string" ? { liveUrl: row["liveUrl"] } : {}),
          ...(typeof row["sourceUrl"] === "string" ? { sourceUrl: row["sourceUrl"] } : {}),
          ...(typeof row["featured"] === "boolean" ? { featured: row["featured"] } : { featured: true }),
          ...(imagesRaw.length >= 2 && typeof imagesRaw[0] === "string" && typeof imagesRaw[1] === "string"
            ? { images: [imagesRaw[0], imagesRaw[1]] as [string, string] }
            : imagesRaw.length === 1 && typeof imagesRaw[0] === "string"
            ? { images: [imagesRaw[0], imagesRaw[0]] as [string, string] }
            : {}),
        };
        return p;
      })
    : defaultPortfolio.projects;

  const events: EventEntry[] = Array.isArray(root["events"])
    ? root["events"].map((item) => {
        const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        const ev: EventEntry = {
          slug: cleanString(row["slug"], "event"),
          title: cleanString(row["title"], "Event"),
          group: cleanString(row["group"], "Community"),
          role: cleanString(row["role"], "Role"),
          year: cleanString(row["year"], "2026"),
          summary: cleanString(row["summary"], ""),
          highlights: cleanStringList(row["highlights"]),
          images: cleanStringList(row["images"]),
        };
        return ev;
      })
    : defaultPortfolio.events;

  const creative: CreativeWork[] = Array.isArray(root["creative"])
    ? root["creative"].map((item) => {
        const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        const contextText = cleanString(row["context"] ?? row["description"], "");
        const cw: CreativeWork = {
          slug: cleanString(row["slug"], "creative-work"),
          title: cleanString(row["title"], "Work"),
          category: cleanString(row["category"], "Design"),
          context: contextText,
          year: cleanString(row["year"], "2026"),
          images: cleanStringList(row["images"]),
          ...(typeof row["image"] === "string" ? { image: row["image"] } : {}),
        };
        return cw;
      })
    : defaultPortfolio.creative;

  const certificates: Certificate[] = Array.isArray(root["certificates"])
    ? root["certificates"].map((item) => {
        const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        const title = cleanString(row["title"], "Certificate");
        const autoSlug =
          title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "certificate";
        const cert: Certificate = {
          slug: cleanString(row["slug"], autoSlug),
          title,
          issuer: cleanString(row["issuer"], "Verified Institution"),
          year: cleanString(row["year"], "2026"),
        };
        if (typeof row["description"] === "string") cert.description = row["description"];
        if (typeof row["details"] === "string") cert.details = row["details"];
        if (Array.isArray(row["skills"])) cert.skills = cleanStringList(row["skills"]);
        if (Array.isArray(row["highlights"])) cert.highlights = cleanStringList(row["highlights"]);
        if (typeof row["url"] === "string") cert.url = row["url"];
        if (typeof row["image"] === "string") cert.image = row["image"];
        if (typeof row["credentialId"] === "string") cert.credentialId = row["credentialId"];
        return cert;
      })
    : defaultPortfolio.certificates;

  const skills = Array.isArray(root["skills"])
    ? root["skills"].map((item) => {
        const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        return {
          group: cleanString(row["group"], "Skill Group"),
          items: cleanStringList(row["items"]),
        };
      })
    : defaultPortfolio.skills;

  const roles: Role[] = Array.isArray(root["roles"])
    ? root["roles"].map((item) => {
        const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        const group = cleanString(row["group"], "Group");
        const title = cleanString(row["title"], "Role");
        const autoSlug =
          group.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "role";
        const roleObj: Role = {
          slug: cleanString(row["slug"], autoSlug),
          title,
          group,
          description: cleanString(row["description"], ""),
          year: cleanString(row["year"], "2026"),
        };
        if (typeof row["details"] === "string") roleObj.details = row["details"];
        if (Array.isArray(row["highlights"])) roleObj.highlights = cleanStringList(row["highlights"]);
        if (typeof row["organization"] === "string") roleObj.organization = row["organization"];
        if (typeof row["link"] === "string") roleObj.link = row["link"];
        if (Array.isArray(row["images"])) roleObj.images = cleanStringList(row["images"]);
        return roleObj;
      })
    : defaultPortfolio.roles;

  const journey: Milestone[] = Array.isArray(root["journey"])
    ? root["journey"].map((item) => {
        const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        const m: Milestone = {
          when: cleanString(row["when"], "2026"),
          what: cleanString(row["what"], "Milestone"),
          where: cleanString(row["where"], "Place"),
          ...(typeof row["detail"] === "string" ? { detail: row["detail"] } : {}),
        };
        return m;
      })
    : defaultPortfolio.journey;

  const cvSettings = resolveCvSettings(root["cvSettings"]);

  return {
    profile,
    education,
    skills,
    projects,
    roles,
    events,
    creative,
    journey,
    certificates,
    cvSettings,
  };
}

/** Validate imported content before it becomes renderable. */
export function isPortfolioContent(value: unknown): value is PortfolioContent {
  return getPortfolioValidationErrors(value).length === 0;
}
