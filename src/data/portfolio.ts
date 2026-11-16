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
  title: string;
  issuer: string;
  year: string;
  url?: string;
  image?: string;
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
  roles: { title: string; group: string; description: string; year: string }[];
  events: EventEntry[];
  creative: CreativeWork[];
  journey: Milestone[];
  certificates: Certificate[];
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
      title: "PV Lead OC",
      group: "IEEE Day 2026",
      description: "Leading publicity and visual communications work for the organizing committee.",
      year: "2026",
    },
    {
      title: "PC OC Member",
      group: "IEEE Student Branch — WUSL",
      description: "Contributing to student branch activities and coordination.",
      year: "2026",
    },
    {
      title: "PV OC",
      group: "FutureQuest — SL Inspire",
      description: "Supporting event publicity and organizing work.",
      year: "2026",
    },
    {
      title: "PV OC",
      group: "SGD Sprint",
      description: "Contributing to promotional and creative event work.",
      year: "2026",
    },
    {
      title: "PV OC",
      group: "JAMBORIEEE",
      description: "Supporting event communications as an organizing committee member.",
      year: "2025",
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
  // Add confirmed certificates through the content file or local Content Studio.
  certificates: [],
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

  return errors;
}

/** Validate imported content before it becomes renderable. */
export function isPortfolioContent(value: unknown): value is PortfolioContent {
  return getPortfolioValidationErrors(value).length === 0;
}
