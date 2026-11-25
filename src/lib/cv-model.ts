import {
  type CvLanguageEntry,
  type CvSectionKey,
  type CvSettings,
  type PortfolioContent,
  resolveCvSettings,
} from "@/data/portfolio";

export const CV_SECTION_META: Record<CvSectionKey, { label: string; description: string }> = {
  summary: {
    label: "Professional Summary",
    description: "Uses CV summary override or falls back to your Profile About bio.",
  },
  education: {
    label: "Education",
    description: "Academic degrees, institutions, periods, and concise focus points.",
  },
  skills: {
    label: "Technical Skills",
    description: "Grouped skill lists from your Skills section.",
  },
  projects: {
    label: "Projects",
    description: "Project titles, concise summaries, tech stacks, and optional links.",
  },
  leadership: {
    label: "Volunteering",
    description: "Organizing committee roles and student volunteering experience.",
  },
  creative: {
    label: "Creative & Media",
    description: "Selected design campaigns, visual branding, and media works.",
  },
  languages: {
    label: "Languages",
    description: "Spoken and written languages configured in CV Settings.",
  },
  events: {
    label: "Events & Participation",
    description: "Student events and community programs.",
  },
  journey: {
    label: "Milestones & Journey",
    description: "Key timeline milestones from your journey section.",
  },
  certificates: {
    label: "Certifications",
    description: "Optional verified certifications section (off by default).",
  },
};

export type CvContactLink = {
  prefix?: string | undefined;
  label: string;
  displayText: string;
  url?: string | undefined;
};

export type CvSummarySection = {
  key: "summary";
  heading: string;
  text: string;
};

export type CvSkillsSection = {
  key: "skills";
  heading: string;
  groups: { group: string; items: string[] }[];
};

export type CvEducationSection = {
  key: "education";
  heading: string;
  items: {
    institution: string;
    degree: string;
    field?: string | undefined;
    period: string;
    focusSummary?: string | undefined;
    description?: string | undefined;
    highlights: string[];
  }[];
};

export type CvProjectsSection = {
  key: "projects";
  heading: string;
  items: {
    name: string;
    tagline?: string | undefined;
    techStack: string;
    subtitle: string;
    year: string;
    summaryBullet: string;
    highlights: string[];
    links: { label: string; display: string; url: string }[];
  }[];
};

export type CvLeadershipSection = {
  key: "leadership";
  heading: string;
  items: {
    title: string;
    group: string;
    organization?: string | undefined;
    year: string;
    description: string;
    highlights: string[];
  }[];
};

export type CvEventsSection = {
  key: "events";
  heading: string;
  items: {
    title: string;
    role: string;
    group: string;
    year: string;
    summary: string;
    highlights: string[];
  }[];
};

export type CvCreativeSection = {
  key: "creative";
  heading: string;
  items: {
    title: string;
    category: string;
    year: string;
    context: string;
  }[];
};

export type CvCertificatesSection = {
  key: "certificates";
  heading: string;
  items: {
    title: string;
    issuer: string;
    year: string;
    credentialId?: string | undefined;
    description?: string | undefined;
    url?: string | undefined;
    displayUrl?: string | undefined;
  }[];
};

export type CvJourneySection = {
  key: "journey";
  heading: string;
  items: {
    what: string;
    where: string;
    when: string;
    detail?: string | undefined;
  }[];
};

export type CvLanguagesSection = {
  key: "languages";
  heading: string;
  items: CvLanguageEntry[];
};

export type CvDocumentSection =
  | CvSummarySection
  | CvSkillsSection
  | CvEducationSection
  | CvProjectsSection
  | CvLeadershipSection
  | CvEventsSection
  | CvCreativeSection
  | CvCertificatesSection
  | CvJourneySection
  | CvLanguagesSection;

export type CvDocumentModel = {
  settings: CvSettings;
  fileName: string;
  header: {
    name: string;
    headline: string;
    primaryContacts: CvContactLink[];
    linkContacts: CvContactLink[];
  };
  sections: CvDocumentSection[];
};

export function formatDisplayUrl(rawUrl: string): string {
  return rawUrl
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
}

export function normalizeHref(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function buildSafePdfFileName(baseName: string): string {
  const cleaned = baseName
    .trim()
    .replace(/\.pdf$/i, "")
    .replace(/[/\\:*?"<>|]+/g, "")
    .replace(/\s+/g, "_");
  return `${cleaned || "Binoj_Charuka_CV"}.pdf`;
}

function applyLimit<T>(items: T[], limit: number): T[] {
  return limit > 0 ? items.slice(0, limit) : items;
}

/** Extracts a concise summary (first sentence or concise text) for brief mode. */
function makeBriefText(text: string): string {
  const cleaned = text.trim().replace(/\s+/g, " ");
  if (!cleaned || cleaned.length <= 145) return cleaned;
  const firstPeriod = cleaned.search(/\.\s+/);
  if (firstPeriod > 25 && firstPeriod <= 165) {
    return cleaned.slice(0, firstPeriod + 1);
  }
  return cleaned;
}

/** Transforms live PortfolioContent + CvSettings into an ordered plain CV model. */
export function buildCvDocumentModel(
  content: PortfolioContent,
  overrideSettings?: CvSettings,
): CvDocumentModel {
  const settings = resolveCvSettings(overrideSettings ?? content.cvSettings);
  const { profile } = content;
  const isBrief = settings.briefMode;

  const primaryContacts: CvContactLink[] = [];
  if (profile.location.trim()) {
    primaryContacts.push({ label: "Location", displayText: profile.location.trim() });
  }
  if (settings.phone.trim()) {
    primaryContacts.push({
      label: "Phone",
      displayText: settings.phone.trim(),
      url: `tel:${settings.phone.trim().replace(/\s+/g, "")}`,
    });
  }
  if (profile.email.trim()) {
    primaryContacts.push({
      label: "Email",
      displayText: profile.email.trim(),
      url: `mailto:${profile.email.trim()}`,
    });
  }

  const linkContacts: CvContactLink[] = [];
  if (settings.includeLinks) {
    if (profile.linkedin.trim()) {
      linkContacts.push({
        prefix: "LinkedIn",
        label: "LinkedIn",
        displayText: formatDisplayUrl(profile.linkedin),
        url: normalizeHref(profile.linkedin),
      });
    }
    if (profile.github.trim()) {
      linkContacts.push({
        prefix: "GitHub",
        label: "GitHub",
        displayText: formatDisplayUrl(profile.github),
        url: normalizeHref(profile.github),
      });
    }
    if (profile.website.trim()) {
      linkContacts.push({
        prefix: "Portfolio",
        label: "Portfolio",
        displayText: formatDisplayUrl(profile.website),
        url: normalizeHref(profile.website),
      });
    }
  }

  const sections: CvDocumentSection[] = [];

  for (const key of settings.sectionOrder) {
    if (!settings.sections[key]) continue;

    switch (key) {
      case "summary": {
        const summaryText = settings.summaryOverride.trim() || profile.bio.trim();
        if (summaryText) {
          sections.push({
            key: "summary",
            heading: "PROFESSIONAL SUMMARY",
            text: summaryText,
          });
        }
        break;
      }

      case "skills": {
        const groups = content.skills
          .map((g) => ({
            group: g.group.trim(),
            items: g.items.map((item) => item.trim()).filter(Boolean),
          }))
          .filter((g) => g.group && g.items.length > 0);
        if (groups.length > 0) {
          sections.push({
            key: "skills",
            heading: "TECHNICAL SKILLS",
            groups,
          });
        }
        break;
      }

      case "education": {
        const eduList = content.education ?? [];
        const items = eduList
          .filter((e) => e.institution.trim() || e.degree.trim())
          .map((e) => {
            const cleanHighlights = (e.highlights ?? []).map((h) => h.trim()).filter(Boolean);
            return {
              institution: e.institution.trim(),
              degree: e.degree.trim(),
              field: e.field?.trim() || undefined,
              period: e.period.trim(),
              focusSummary: cleanHighlights.length > 0 ? cleanHighlights.join(" | ") : undefined,
              description: isBrief ? undefined : e.description?.trim() || undefined,
              highlights: isBrief ? [] : cleanHighlights,
            };
          });
        if (items.length > 0) {
          sections.push({
            key: "education",
            heading: "EDUCATION",
            items,
          });
        }
        break;
      }

      case "projects": {
        const pool = settings.featuredProjectsOnly
          ? content.projects.filter((p) => p.featured !== false)
          : content.projects;
        const selected = applyLimit(pool, settings.limits.projects);
        const items = selected
          .filter((p) => p.name.trim())
          .map((p) => {
            const links: { label: string; display: string; url: string }[] = [];
            if (settings.includeProjectLinks) {
              if (p.liveUrl?.trim()) {
                links.push({
                  label: "Live",
                  display: formatDisplayUrl(p.liveUrl),
                  url: normalizeHref(p.liveUrl),
                });
              }
              if (p.sourceUrl?.trim()) {
                links.push({
                  label: "Source",
                  display: formatDisplayUrl(p.sourceUrl),
                  url: normalizeHref(p.sourceUrl),
                });
              }
            }
            const cleanCategories = p.categories.map((c) => c.trim()).filter(Boolean);
            const metaParts = [p.status?.trim(), ...cleanCategories].filter(Boolean);
            const summaryBullet = isBrief
              ? makeBriefText(p.description.trim() || p.tagline.trim())
              : p.description.trim();

            return {
              name: p.name.trim(),
              tagline: p.tagline.trim() || undefined,
              techStack: cleanCategories.join(", "),
              subtitle: isBrief ? "" : metaParts.join(" | "),
              year: p.year.trim(),
              summaryBullet,
              highlights:
                !isBrief && settings.includeProjectHighlights
                  ? p.highlights.map((h) => h.trim()).filter(Boolean)
                  : [],
              links,
            };
          });
        if (items.length > 0) {
          sections.push({
            key: "projects",
            heading: "PROJECTS",
            items,
          });
        }
        break;
      }

      case "leadership": {
        const selected = applyLimit(content.roles, settings.limits.roles);
        const items = selected
          .filter((r) => r.title.trim() || r.group.trim())
          .map((r) => ({
            title: r.title.trim(),
            group: r.group.trim(),
            organization: r.organization?.trim() || undefined,
            year: r.year.trim(),
            description: isBrief ? makeBriefText(r.description.trim()) : r.description.trim(),
            highlights: isBrief ? [] : (r.highlights ?? []).map((h) => h.trim()).filter(Boolean),
          }));
        if (items.length > 0) {
          sections.push({
            key: "leadership",
            heading: "VOLUNTEERING",
            items,
          });
        }
        break;
      }

      case "events": {
        const selected = applyLimit(content.events, settings.limits.events);
        const items = selected
          .filter((ev) => ev.title.trim())
          .map((ev) => ({
            title: ev.title.trim(),
            role: ev.role.trim(),
            group: ev.group.trim(),
            year: ev.year.trim(),
            summary: isBrief ? makeBriefText(ev.summary.trim()) : ev.summary.trim(),
            highlights: isBrief ? [] : ev.highlights.map((h) => h.trim()).filter(Boolean),
          }));
        if (items.length > 0) {
          sections.push({
            key: "events",
            heading: "EVENTS & COMMUNITY",
            items,
          });
        }
        break;
      }

      case "creative": {
        const selected = applyLimit(content.creative, settings.limits.creative);
        const items = selected
          .filter((cw) => cw.title.trim())
          .map((cw) => ({
            title: cw.title.trim(),
            category: cw.category.trim(),
            year: cw.year.trim(),
            context: isBrief ? makeBriefText(cw.context.trim()) : cw.context.trim(),
          }));
        if (items.length > 0) {
          sections.push({
            key: "creative",
            heading: "CREATIVE & MEDIA",
            items,
          });
        }
        break;
      }

      case "certificates": {
        const selected = applyLimit(content.certificates, settings.limits.certificates);
        const items = selected
          .filter((cert) => cert.title.trim())
          .map((cert) => {
            const url =
              settings.includeLinks && cert.url?.trim() ? normalizeHref(cert.url) : undefined;
            return {
              title: cert.title.trim(),
              issuer: cert.issuer.trim(),
              year: cert.year.trim(),
              credentialId: cert.credentialId?.trim() || undefined,
              description:
                !isBrief && settings.includeCertificatesDetails
                  ? cert.description?.trim() || cert.details?.trim() || undefined
                  : undefined,
              url,
              displayUrl: url ? formatDisplayUrl(url) : undefined,
            };
          });
        if (items.length > 0) {
          sections.push({
            key: "certificates",
            heading: "CERTIFICATIONS",
            items,
          });
        }
        break;
      }

      case "journey": {
        const selected = applyLimit(content.journey, settings.limits.journey);
        const items = selected
          .filter((m) => m.what.trim())
          .map((m) => ({
            what: m.what.trim(),
            where: m.where.trim(),
            when: m.when.trim(),
            detail: m.detail?.trim() || undefined,
          }));
        if (items.length > 0) {
          sections.push({
            key: "journey",
            heading: "MILESTONES & JOURNEY",
            items,
          });
        }
        break;
      }

      case "languages": {
        const items = settings.languages
          .map((lang) => ({
            name: lang.name.trim(),
            proficiency: lang.proficiency.trim(),
          }))
          .filter((lang) => lang.name);
        if (items.length > 0) {
          sections.push({
            key: "languages",
            heading: "LANGUAGES",
            items,
          });
        }
        break;
      }
    }
  }

  return {
    settings,
    fileName: buildSafePdfFileName(settings.fileName),
    header: {
      name: profile.name.trim() || profile.shortName.trim() || "Portfolio CV",
      headline: settings.headlineOverride.trim() || profile.headline.trim(),
      primaryContacts,
      linkContacts,
    },
    sections,
  };
}
