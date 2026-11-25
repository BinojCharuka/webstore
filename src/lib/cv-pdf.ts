import { jsPDF } from "jspdf";
import { type CvSettings, type PortfolioContent } from "@/data/portfolio";
import {
  buildCvDocumentModel,
  type CvContactLink,
  type CvDocumentModel,
  type CvDocumentSection,
} from "@/lib/cv-model";

const COLOR_HEADING: [number, number, number] = [17, 24, 39];
const COLOR_SECTION_NAVY: [number, number, number] = [24, 58, 128];
const COLOR_BODY: [number, number, number] = [31, 41, 55];
const COLOR_MUTED: [number, number, number] = [75, 85, 99];
const COLOR_LINK: [number, number, number] = [29, 78, 216];
const COLOR_RULE: [number, number, number] = [148, 163, 184];

/**
 * Normalizes text so standard built-in PDF fonts (WinAnsi / Latin-1) never render
 * corrupted glyphs for unsupported Unicode symbols or emojis.
 */
export function sanitizePdfText(input: string): string {
  const replaced = input
    .replace(/\u2194|\u21C4/g, "<->")
    .replace(/\u2192|\u21B3|\u279C/g, "->")
    .replace(/\u2190/g, "<-")
    .replace(/\u2733/g, "*")
    .replace(/\u2713|\u2714/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ");

  let out = "";
  for (const ch of replaced) {
    const code = ch.codePointAt(0) ?? 0;
    const isAsciiPrintable = code >= 0x20 && code <= 0x7e;
    const isLineBreak = code === 0x0a;
    const isSafeLatin1 = code >= 0xa0 && code <= 0xff;
    const isSafeWinAnsiPunct = code === 0x2013 || code === 0x2014 || code === 0x2022;
    if (isAsciiPrintable || isLineBreak || isSafeLatin1 || isSafeWinAnsiPunct) {
      out += ch;
    }
  }
  return out.replace(/[ \t]{2,}/g, " ").trim();
}

type LayoutConfig = {
  fontFamily: "helvetica" | "times";
  briefMode: boolean;
  compactMode: boolean;
  marginX: number;
  marginTop: number;
  marginBottom: number;
  pageWidth: number;
  pageHeight: number;
  contentWidth: number;
  bodySize: number;
  smallSize: number;
  sectionSize: number;
  lineHeight: number;
  compactLineHeight: number;
  sectionGap: number;
  itemGap: number;
};

class PdfCursor {
  public y: number;
  public readonly doc: jsPDF;
  public readonly cfg: LayoutConfig;

  constructor(doc: jsPDF, cfg: LayoutConfig) {
    this.doc = doc;
    this.cfg = cfg;
    this.y = cfg.marginTop;
  }

  get bottomLimit(): number {
    return this.cfg.pageHeight - this.cfg.marginBottom;
  }

  ensureSpace(requiredHeight: number): void {
    if (this.y + requiredHeight > this.bottomLimit && this.y > this.cfg.marginTop + 4) {
      this.doc.addPage();
      this.y = this.cfg.marginTop;
    }
  }

  advance(delta: number): void {
    this.y += delta;
  }

  drawWrappedText(
    rawText: string,
    options?: {
      x?: number;
      maxWidth?: number;
      fontSize?: number;
      fontStyle?: "normal" | "bold" | "italic" | "bolditalic";
      color?: [number, number, number];
      lineGap?: number;
    },
  ): void {
    const text = sanitizePdfText(rawText);
    if (!text) return;

    const x = options?.x ?? this.cfg.marginX;
    const maxWidth = options?.maxWidth ?? this.cfg.pageWidth - this.cfg.marginX - x;
    const fontSize = options?.fontSize ?? this.cfg.bodySize;
    const fontStyle = options?.fontStyle ?? "normal";
    const color = options?.color ?? COLOR_BODY;
    const lineGap = options?.lineGap ?? fontSize * this.cfg.lineHeight;

    this.doc.setFont(this.cfg.fontFamily, fontStyle);
    this.doc.setFontSize(fontSize);
    this.doc.setTextColor(...color);

    const lines = this.doc.splitTextToSize(text, Math.max(40, maxWidth)) as string[];
    for (const line of lines) {
      this.ensureSpace(lineGap);
      this.doc.text(line, x, this.y);
      this.y += lineGap;
    }
  }

  drawInlineLabeledRow(rawLabel: string, rawValue: string, fontSize?: number): void {
    const label = `${sanitizePdfText(rawLabel)}: `;
    const value = sanitizePdfText(rawValue);
    if (!value) return;

    const size = fontSize ?? this.cfg.bodySize;
    const lineGap = size * this.cfg.compactLineHeight;

    this.doc.setFont(this.cfg.fontFamily, "bold");
    this.doc.setFontSize(size);
    const labelWidth = this.doc.getTextWidth(label);

    this.doc.setFont(this.cfg.fontFamily, "normal");
    const firstLineMax = Math.max(80, this.cfg.contentWidth - labelWidth);
    const firstSplit = this.doc.splitTextToSize(value, firstLineMax) as string[];
    const firstLine = firstSplit[0] ?? "";
    const remaining = value.slice(firstLine.length).trim();

    this.ensureSpace(lineGap);
    this.doc.setFont(this.cfg.fontFamily, "bold");
    this.doc.setTextColor(...COLOR_HEADING);
    this.doc.text(label, this.cfg.marginX, this.y);

    this.doc.setFont(this.cfg.fontFamily, "normal");
    this.doc.setTextColor(...COLOR_BODY);
    if (firstLine) {
      this.doc.text(firstLine, this.cfg.marginX + labelWidth, this.y);
    }
    this.advance(lineGap);

    if (remaining) {
      this.drawWrappedText(remaining, {
        x: this.cfg.marginX + 10,
        fontSize: size,
        lineGap,
      });
    }
  }

  drawBullet(rawText: string, fontSize?: number): void {
    const text = sanitizePdfText(rawText);
    if (!text) return;

    const size = fontSize ?? this.cfg.bodySize;
    const bulletX = this.cfg.marginX + 8;
    const textX = this.cfg.marginX + 17;
    const maxWidth = this.cfg.contentWidth - 17;
    const lineGap = size * this.cfg.compactLineHeight;

    this.doc.setFont(this.cfg.fontFamily, "normal");
    this.doc.setFontSize(size);
    this.doc.setTextColor(...COLOR_BODY);

    const lines = this.doc.splitTextToSize(text, Math.max(40, maxWidth)) as string[];
    lines.forEach((line, index) => {
      this.ensureSpace(lineGap);
      if (index === 0) {
        this.doc.text("\u2022", bulletX, this.y);
      }
      this.doc.text(line, textX, this.y);
      this.y += lineGap;
    });
  }

  drawTitleWithRightDate(
    rawTitle: string,
    rawRightDate: string,
    fontSize?: number,
    subtitle?: string,
    subtitleItalic = false,
  ): void {
    const title = sanitizePdfText(rawTitle);
    const rightDate = sanitizePdfText(rawRightDate);
    const size = fontSize ?? this.cfg.bodySize + 0.3;
    const lineGap = size * 1.24;

    this.doc.setFont(this.cfg.fontFamily, "normal");
    this.doc.setFontSize(this.cfg.smallSize);
    const dateWidth = rightDate ? this.doc.getTextWidth(rightDate) + 12 : 0;

    this.doc.setFont(this.cfg.fontFamily, "bold");
    this.doc.setFontSize(size);
    const titleMaxWidth = Math.max(120, this.cfg.contentWidth - dateWidth);
    const titleLines = this.doc.splitTextToSize(title, titleMaxWidth) as string[];

    const estimatedMinHeight =
      titleLines.length * lineGap + (subtitle ? this.cfg.smallSize * 1.25 : 0) + lineGap;
    this.ensureSpace(estimatedMinHeight);

    titleLines.forEach((line, idx) => {
      if (idx > 0) this.ensureSpace(lineGap);
      this.doc.setFont(this.cfg.fontFamily, "bold");
      this.doc.setFontSize(size);
      this.doc.setTextColor(...COLOR_HEADING);
      this.doc.text(line, this.cfg.marginX, this.y);

      if (idx === 0 && rightDate) {
        this.doc.setFont(this.cfg.fontFamily, "normal");
        this.doc.setFontSize(this.cfg.smallSize);
        this.doc.setTextColor(...COLOR_BODY);
        this.doc.text(rightDate, this.cfg.pageWidth - this.cfg.marginX, this.y, { align: "right" });
      }
      this.y += lineGap;
    });

    if (subtitle) {
      this.drawWrappedText(subtitle, {
        fontSize: this.cfg.bodySize,
        fontStyle: subtitleItalic ? "italic" : "normal",
        color: COLOR_BODY,
        lineGap: this.cfg.bodySize * 1.24,
      });
    }
  }

  drawSectionHeader(heading: string): void {
    const title = sanitizePdfText(heading);
    const headingHeight = this.cfg.sectionSize * 1.2 + 8;
    this.ensureSpace(headingHeight + 42);
    if (this.y > this.cfg.marginTop + 4) {
      this.advance(this.cfg.sectionGap);
    }

    this.doc.setFont(this.cfg.fontFamily, "bold");
    this.doc.setFontSize(this.cfg.sectionSize);
    this.doc.setTextColor(...COLOR_SECTION_NAVY);
    this.doc.text(title, this.cfg.marginX, this.y);

    this.y += 3.5;
    this.doc.setDrawColor(...COLOR_RULE);
    this.doc.setLineWidth(0.55);
    this.doc.line(this.cfg.marginX, this.y, this.cfg.pageWidth - this.cfg.marginX, this.y);
    this.y += this.cfg.bodySize * 1.28;
  }
}

function drawCenteredContactLine(cursor: PdfCursor, contacts: CvContactLink[]): void {
  if (contacts.length === 0) return;
  const { doc, cfg } = cursor;
  const fontSize = cfg.smallSize;
  const lineGap = fontSize * 1.38;
  const separator = "  |  ";

  doc.setFont(cfg.fontFamily, "normal");
  doc.setFontSize(fontSize);

  type Segment = { prefix: string; display: string; url?: string | undefined; width: number };
  const sepWidth = doc.getTextWidth(separator);

  const items: Segment[] = contacts
    .map((c) => {
      const prefix = c.prefix ? `${sanitizePdfText(c.prefix)}: ` : "";
      const display = sanitizePdfText(c.displayText);
      const width = doc.getTextWidth(prefix) + doc.getTextWidth(display);
      return { prefix, display, url: c.url, width };
    })
    .filter((s) => s.display);

  if (items.length === 0) return;

  // Group segments into lines that fit cleanly within contentWidth
  const rows: Segment[][] = [];
  let currentRow: Segment[] = [];
  let rowWidth = 0;

  for (const item of items) {
    const nextWidth = currentRow.length === 0 ? item.width : rowWidth + sepWidth + item.width;
    if (currentRow.length > 0 && nextWidth > cfg.contentWidth) {
      rows.push(currentRow);
      currentRow = [item];
      rowWidth = item.width;
    } else {
      currentRow.push(item);
      rowWidth = nextWidth;
    }
  }
  if (currentRow.length > 0) rows.push(currentRow);

  for (const row of rows) {
    const totalRowWidth =
      row.reduce((sum, s) => sum + s.width, 0) + Math.max(0, row.length - 1) * sepWidth;
    let x = cfg.marginX + Math.max(0, (cfg.contentWidth - totalRowWidth) / 2);

    row.forEach((seg, idx) => {
      if (idx > 0) {
        doc.setTextColor(...COLOR_MUTED);
        doc.text(separator, x, cursor.y);
        x += sepWidth;
      }
      if (seg.prefix) {
        doc.setTextColor(...COLOR_BODY);
        doc.text(seg.prefix, x, cursor.y);
        x += doc.getTextWidth(seg.prefix);
      }
      const displayW = doc.getTextWidth(seg.display);
      if (seg.url) {
        doc.setTextColor(...COLOR_LINK);
        doc.textWithLink(seg.display, x, cursor.y, { url: seg.url });
        doc.setDrawColor(...COLOR_LINK);
        doc.setLineWidth(0.35);
        doc.line(x, cursor.y + 1.3, x + displayW, cursor.y + 1.3);
      } else {
        doc.setTextColor(...COLOR_BODY);
        doc.text(seg.display, x, cursor.y);
      }
      x += displayW;
    });

    cursor.advance(lineGap);
  }
}

function drawHeader(cursor: PdfCursor, model: CvDocumentModel): void {
  const { doc, cfg } = cursor;
  const { name, headline, primaryContacts, linkContacts } = model.header;
  const centerX = cfg.pageWidth / 2;

  doc.setFont(cfg.fontFamily, "bold");
  doc.setFontSize(cfg.compactMode ? 16 : 17.5);
  doc.setTextColor(...COLOR_HEADING);
  const nameText = sanitizePdfText(name).toUpperCase();
  const nameLines = doc.splitTextToSize(nameText, cfg.contentWidth) as string[];
  for (const line of nameLines) {
    doc.text(line, centerX, cursor.y, { align: "center" });
    cursor.advance(cfg.compactMode ? 17 : 18.5);
  }

  if (headline) {
    doc.setFont(cfg.fontFamily, "bold");
    doc.setFontSize(cfg.bodySize + 0.3);
    doc.setTextColor(...COLOR_HEADING);
    const hLines = doc.splitTextToSize(sanitizePdfText(headline), cfg.contentWidth) as string[];
    for (const line of hLines) {
      doc.text(line, centerX, cursor.y, { align: "center" });
      cursor.advance((cfg.bodySize + 0.3) * 1.28);
    }
  }

  cursor.advance(1.5);
  drawCenteredContactLine(cursor, primaryContacts);
  drawCenteredContactLine(cursor, linkContacts);
  cursor.advance(2);
}

function drawLinkList(
  cursor: PdfCursor,
  links: { label: string; display: string; url: string }[],
): void {
  if (links.length === 0) return;
  const { doc, cfg } = cursor;
  const size = cfg.smallSize;
  const lineGap = size * 1.3;

  doc.setFontSize(size);
  let x = cfg.marginX;
  const maxX = cfg.pageWidth - cfg.marginX;

  links.forEach((lnk, idx) => {
    const prefix = `${sanitizePdfText(lnk.label)}: `;
    const display = sanitizePdfText(lnk.display);
    const sep = idx > 0 && x > cfg.marginX ? "   |   " : "";

    doc.setFont(cfg.fontFamily, "bold");
    const prefixWidth = doc.getTextWidth(prefix);
    doc.setFont(cfg.fontFamily, "normal");
    const sepWidth = sep ? doc.getTextWidth(sep) : 0;
    const displayWidth = doc.getTextWidth(display);
    const chunkWidth = sepWidth + prefixWidth + displayWidth;

    if (x > cfg.marginX && x + chunkWidth > maxX) {
      cursor.advance(lineGap);
      x = cfg.marginX;
    } else if (sep) {
      doc.setTextColor(...COLOR_MUTED);
      doc.text(sep, x, cursor.y);
      x += sepWidth;
    }

    cursor.ensureSpace(lineGap);
    doc.setFont(cfg.fontFamily, "bold");
    doc.setTextColor(...COLOR_MUTED);
    doc.text(prefix, x, cursor.y);
    x += prefixWidth;

    doc.setFont(cfg.fontFamily, "normal");
    doc.setTextColor(...COLOR_LINK);
    doc.textWithLink(display, x, cursor.y, { url: lnk.url });
    doc.setDrawColor(...COLOR_LINK);
    doc.setLineWidth(0.35);
    doc.line(x, cursor.y + 1.3, x + displayWidth, cursor.y + 1.3);
    x += displayWidth;
  });

  cursor.advance(lineGap);
}

function renderSection(cursor: PdfCursor, section: CvDocumentSection): void {
  cursor.drawSectionHeader(section.heading);
  const { cfg } = cursor;

  switch (section.key) {
    case "summary": {
      cursor.drawWrappedText(section.text, {
        lineGap: cfg.bodySize * cfg.compactLineHeight,
      });
      break;
    }

    case "skills": {
      section.groups.forEach((g, idx) => {
        cursor.drawInlineLabeledRow(g.group, g.items.join(", "), cfg.bodySize);
        if (idx < section.groups.length - 1) cursor.advance(0.8);
      });
      break;
    }

    case "education": {
      section.items.forEach((edu, idx) => {
        const title = edu.field ? `${edu.degree}, ${edu.field}` : edu.degree;
        cursor.drawTitleWithRightDate(title, edu.period, cfg.bodySize + 0.3, edu.institution);
        if (cfg.briefMode) {
          if (edu.focusSummary) {
            cursor.drawInlineLabeledRow("Focus", edu.focusSummary, cfg.smallSize);
          }
        } else {
          if (edu.description) {
            cursor.drawWrappedText(edu.description, {
              lineGap: cfg.bodySize * cfg.compactLineHeight,
            });
          }
          edu.highlights.forEach((h) => cursor.drawBullet(h));
        }
        if (idx < section.items.length - 1) cursor.advance(cfg.itemGap * 0.8);
      });
      break;
    }

    case "projects": {
      section.items.forEach((proj, idx) => {
        const heading =
          proj.tagline && cfg.briefMode ? `${proj.name} — ${proj.tagline}` : proj.name;
        cursor.drawTitleWithRightDate(
          heading,
          proj.year,
          cfg.bodySize + 0.3,
          proj.subtitle || undefined,
          !cfg.briefMode,
        );
        if (proj.links.length > 0) {
          drawLinkList(cursor, proj.links);
        }
        if (proj.summaryBullet) {
          cursor.drawBullet(proj.summaryBullet);
        }
        proj.highlights.forEach((h) => cursor.drawBullet(h));
        if (proj.techStack) {
          cursor.drawInlineLabeledRow("Tech Stack", proj.techStack, cfg.smallSize);
        }
        if (idx < section.items.length - 1) cursor.advance(cfg.itemGap * 0.85);
      });
      break;
    }

    case "leadership": {
      section.items.forEach((role, idx) => {
        const heading = role.group ? `${role.title} — ${role.group}` : role.title;
        if (cfg.briefMode) {
          const detailLine = [role.organization, role.description].filter(Boolean).join(" — ");
          cursor.drawTitleWithRightDate(heading, role.year, cfg.bodySize + 0.3, detailLine);
        } else {
          cursor.drawTitleWithRightDate(heading, role.year, cfg.bodySize + 0.3, role.organization);
          if (role.description) {
            cursor.drawWrappedText(role.description, {
              lineGap: cfg.bodySize * cfg.compactLineHeight,
            });
          }
          role.highlights.forEach((h) => cursor.drawBullet(h));
        }
        if (idx < section.items.length - 1) cursor.advance(cfg.itemGap * 0.7);
      });
      break;
    }

    case "events": {
      section.items.forEach((ev, idx) => {
        const subtitle = [ev.role, ev.group].filter(Boolean).join(" | ");
        cursor.drawTitleWithRightDate(ev.title, ev.year, cfg.bodySize + 0.3, subtitle);
        if (!cfg.briefMode && ev.summary) {
          cursor.drawWrappedText(ev.summary, {
            lineGap: cfg.bodySize * cfg.compactLineHeight,
          });
        }
        ev.highlights.forEach((h) => cursor.drawBullet(h));
        if (idx < section.items.length - 1) cursor.advance(cfg.itemGap * 0.7);
      });
      break;
    }

    case "creative": {
      section.items.forEach((cw, idx) => {
        if (cfg.briefMode) {
          const meta = cw.category ? ` (${cw.category}, ${cw.year})` : ` (${cw.year})`;
          const text = cw.context ? `${cw.title}${meta} — ${cw.context}` : `${cw.title}${meta}`;
          cursor.drawBullet(text, cfg.bodySize);
        } else {
          cursor.drawTitleWithRightDate(cw.title, cw.year, cfg.bodySize + 0.3, cw.category);
          if (cw.context) {
            cursor.drawWrappedText(cw.context, {
              lineGap: cfg.bodySize * cfg.compactLineHeight,
            });
          }
          if (idx < section.items.length - 1) cursor.advance(cfg.itemGap * 0.65);
        }
      });
      break;
    }

    case "certificates": {
      section.items.forEach((cert, idx) => {
        const suffixParts = [cert.issuer, cert.year ? `(${cert.year})` : ""].filter(Boolean);
        const line = `${cert.title} — ${suffixParts.join(" ")}`;
        cursor.drawBullet(line, cfg.bodySize);
        if (cert.description) {
          cursor.drawWrappedText(cert.description, {
            x: cfg.marginX + 17,
            lineGap: cfg.bodySize * cfg.compactLineHeight,
          });
        }
        if (cert.url && cert.displayUrl) {
          drawLinkList(cursor, [{ label: "Verify", display: cert.displayUrl, url: cert.url }]);
        }
        if (idx < section.items.length - 1) cursor.advance(1);
      });
      break;
    }

    case "journey": {
      section.items.forEach((m, idx) => {
        cursor.drawTitleWithRightDate(m.what, m.when, cfg.bodySize + 0.3, m.where);
        if (!cfg.briefMode && m.detail) {
          cursor.drawWrappedText(m.detail, {
            lineGap: cfg.bodySize * cfg.compactLineHeight,
          });
        }
        if (idx < section.items.length - 1) cursor.advance(cfg.itemGap * 0.65);
      });
      break;
    }

    case "languages": {
      const formatted = section.items
        .map((lang) => (lang.proficiency ? `${lang.name} (${lang.proficiency})` : lang.name))
        .join("   |   ");
      cursor.drawWrappedText(formatted, {
        lineGap: cfg.bodySize * cfg.compactLineHeight,
      });
      break;
    }
  }
}

function addPageFooters(doc: jsPDF, cfg: LayoutConfig, name: string): void {
  const totalPages = doc.getNumberOfPages();
  if (totalPages <= 1) return;
  const cleanName = sanitizePdfText(name);
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont(cfg.fontFamily, "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(cleanName, cfg.marginX, cfg.pageHeight - 18);
    doc.text(`Page ${p} of ${totalPages}`, cfg.pageWidth - cfg.marginX, cfg.pageHeight - 18, {
      align: "right",
    });
  }
}

/** Builds a clean vector ATS PDF Blob from live portfolio content & settings. */
export async function generateCvPdfBlob(
  content: PortfolioContent,
  overrideSettings?: CvSettings,
): Promise<{ blob: Blob; fileName: string; pageCount: number }> {
  const model = buildCvDocumentModel(content, overrideSettings);
  const { settings } = model;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: settings.paperSize,
    compress: true,
  });

  doc.setProperties({
    title: `${sanitizePdfText(model.header.name)} - CV`,
    subject: sanitizePdfText(model.header.headline || "Curriculum Vitae"),
    author: sanitizePdfText(model.header.name),
    creator: "Portfolio CV Generator",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = settings.compactMode ? 34 : 40;
  const cfg: LayoutConfig = {
    fontFamily: settings.fontStyle === "serif" ? "times" : "helvetica",
    briefMode: settings.briefMode,
    compactMode: settings.compactMode,
    marginX,
    marginTop: settings.compactMode ? 30 : 36,
    marginBottom: settings.compactMode ? 30 : 34,
    pageWidth,
    pageHeight,
    contentWidth: pageWidth - marginX * 2,
    bodySize: settings.compactMode ? 8.6 : 9,
    smallSize: settings.compactMode ? 8 : 8.4,
    sectionSize: settings.compactMode ? 9.5 : 10,
    lineHeight: settings.compactMode ? 1.24 : 1.32,
    compactLineHeight: settings.compactMode ? 1.2 : 1.26,
    sectionGap: settings.compactMode ? 7 : 9.5,
    itemGap: settings.compactMode ? 4 : 5.5,
  };

  const cursor = new PdfCursor(doc, cfg);
  drawHeader(cursor, model);
  for (const section of model.sections) {
    renderSection(cursor, section);
  }
  addPageFooters(doc, cfg, model.header.name);

  const blob = doc.output("blob");
  return {
    blob,
    fileName: model.fileName,
    pageCount: doc.getNumberOfPages(),
  };
}

/** Generates the plain CV PDF and triggers an instant browser download. */
export async function downloadCvPdf(
  content: PortfolioContent,
  overrideSettings?: CvSettings,
): Promise<{ fileName: string; pageCount: number }> {
  const { blob, fileName, pageCount } = await generateCvPdfBlob(content, overrideSettings);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1500);
  return { fileName, pageCount };
}
