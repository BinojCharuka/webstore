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
};
export type EventEntry = {
  slug: string;
  title: string;
  group: string;
  role: string;
  year: string;
  summary: string;
  highlights: string[];
};
export type CreativeWork = {
  slug: string;
  title: string;
  category: string;
  context: string;
  year: string;
  image?: string; // Add your own image file under public/ and use its /path here.
};
export type Certificate = {
  title: string;
  issuer: string;
  year: string;
  url?: string;
  image?: string;
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
    portrait: "/portrait-placeholder.svg",
  },
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

/** Validate imported content before it becomes renderable. */
export function isPortfolioContent(value: unknown): value is PortfolioContent {
  const record = (v: unknown): v is Record<string, unknown> =>
    v !== null && typeof v === "object" && !Array.isArray(v);
  const strings = (v: Record<string, unknown>, keys: readonly string[]) =>
    keys.every((k) => typeof v[k] === "string");
  const optionalStrings = (v: Record<string, unknown>, keys: readonly string[]) =>
    keys.every((k) => v[k] === undefined || typeof v[k] === "string");
  const listOfStrings = (v: unknown): v is string[] =>
    Array.isArray(v) && v.every((x) => typeof x === "string");
  const arrayOf = (v: unknown, check: (x: Record<string, unknown>) => boolean) =>
    Array.isArray(v) && v.every((item) => record(item) && check(item));
  if (!record(value) || !record(value["profile"])) return false;
  const p = value["profile"];
  if (
    !strings(p, [
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
    ])
  )
    return false;
  return (
    arrayOf(
      value["projects"],
      (v) =>
        strings(v, ["slug", "name", "tagline", "description", "year", "status"]) &&
        ["Live", "In progress", "Concept"].includes(String(v["status"])) &&
        listOfStrings(v["categories"]) &&
        listOfStrings(v["highlights"]) &&
        optionalStrings(v, ["liveUrl", "sourceUrl"]) &&
        (v["featured"] === undefined || typeof v["featured"] === "boolean"),
    ) &&
    arrayOf(
      value["events"],
      (v) =>
        strings(v, ["slug", "title", "group", "role", "year", "summary"]) &&
        listOfStrings(v["highlights"]),
    ) &&
    arrayOf(
      value["creative"],
      (v) =>
        strings(v, ["slug", "title", "category", "context", "year"]) &&
        optionalStrings(v, ["image"]),
    ) &&
    arrayOf(
      value["certificates"],
      (v) => strings(v, ["title", "issuer", "year"]) && optionalStrings(v, ["url", "image"]),
    ) &&
    arrayOf(value["skills"], (v) => strings(v, ["group"]) && listOfStrings(v["items"])) &&
    arrayOf(value["roles"], (v) => strings(v, ["title", "group", "description", "year"])) &&
    arrayOf(
      value["journey"],
      (v) => strings(v, ["when", "what", "where"]) && optionalStrings(v, ["detail"]),
    )
  );
}
