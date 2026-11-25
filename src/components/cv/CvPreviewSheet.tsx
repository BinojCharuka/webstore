import type { CvContactLink, CvDocumentModel, CvDocumentSection } from "@/lib/cv-model";
import { cn } from "@/lib/utils";

function ContactLine({ items }: { items: CvContactLink[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[10.5px] text-neutral-700">
      {items.map((item, idx) => (
        <span key={`${item.label}-${idx}`} className="inline-flex items-center gap-2">
          {idx > 0 && (
            <span aria-hidden="true" className="text-neutral-400">
              |
            </span>
          )}
          <span>
            {item.prefix ? <span className="text-neutral-800">{item.prefix}: </span> : null}
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-800 underline decoration-blue-800/50 underline-offset-2 break-all"
              >
                {item.displayText}
              </a>
            ) : (
              <span>{item.displayText}</span>
            )}
          </span>
        </span>
      ))}
    </div>
  );
}

function PreviewSection({
  section,
  compact,
  brief,
}: {
  section: CvDocumentSection;
  compact: boolean;
  brief: boolean;
}) {
  const itemGap = compact ? "space-y-2" : "space-y-2.5";

  return (
    <section className={compact ? "mt-3.5" : "mt-4"}>
      <h4 className="border-b border-slate-400 pb-0.5 text-[11px] font-bold tracking-[0.04em] text-blue-950 uppercase">
        {section.heading}
      </h4>

      <div className={compact ? "mt-1.5" : "mt-2"}>
        {section.key === "summary" && (
          <p className="text-[10.5px] leading-[1.4] text-neutral-800 whitespace-pre-line">
            {section.text}
          </p>
        )}

        {section.key === "skills" && (
          <ul className="space-y-0.5 text-[10.5px] leading-[1.35] text-neutral-800">
            {section.groups.map((g) => (
              <li key={g.group}>
                <strong className="font-bold text-neutral-900">{g.group}:</strong>{" "}
                <span>{g.items.join(", ")}</span>
              </li>
            ))}
          </ul>
        )}

        {section.key === "education" && (
          <div className={itemGap}>
            {section.items.map((edu, idx) => (
              <div key={`${edu.institution}-${idx}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[11px] font-bold text-neutral-950">
                    {edu.field ? `${edu.degree}, ${edu.field}` : edu.degree}
                  </p>
                  <span className="text-[10px] text-neutral-700">{edu.period}</span>
                </div>
                <p className="text-[10.5px] text-neutral-800">{edu.institution}</p>
                {brief ? (
                  edu.focusSummary && (
                    <p className="text-[10px] leading-[1.35] text-neutral-700">
                      <strong className="font-semibold text-neutral-900">Focus:</strong>{" "}
                      {edu.focusSummary}
                    </p>
                  )
                ) : (
                  <>
                    {edu.description && (
                      <p className="mt-0.5 text-[10.5px] leading-[1.35] text-neutral-800">
                        {edu.description}
                      </p>
                    )}
                    {edu.highlights.length > 0 && (
                      <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[10px] leading-[1.3] text-neutral-800">
                        {edu.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {section.key === "projects" && (
          <div className={itemGap}>
            {section.items.map((proj, idx) => (
              <div key={`${proj.name}-${idx}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[11px] font-bold text-neutral-950">
                    {brief && proj.tagline ? `${proj.name} — ${proj.tagline}` : proj.name}
                  </p>
                  <span className="text-[10px] text-neutral-700">{proj.year}</span>
                </div>
                {!brief && proj.subtitle && (
                  <p className="text-[10px] italic text-neutral-600">{proj.subtitle}</p>
                )}
                {proj.links.length > 0 && (
                  <p className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-neutral-700">
                    {proj.links.map((lnk) => (
                      <span key={lnk.label}>
                        <strong className="font-semibold">{lnk.label}:</strong>{" "}
                        <a
                          href={lnk.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-800 underline decoration-blue-800/40 underline-offset-2"
                        >
                          {lnk.display}
                        </a>
                      </span>
                    ))}
                  </p>
                )}
                {proj.summaryBullet && (
                  <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[10.5px] leading-[1.35] text-neutral-800">
                    <li>{proj.summaryBullet}</li>
                    {proj.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                )}
                {proj.techStack && (
                  <p className="mt-0.5 text-[10px] text-neutral-800">
                    <strong className="font-bold text-neutral-900">Tech Stack:</strong>{" "}
                    {proj.techStack}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {section.key === "leadership" && (
          <div className={itemGap}>
            {section.items.map((role, idx) => (
              <div key={`${role.title}-${idx}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[11px] font-bold text-neutral-950">
                    {role.group ? `${role.title} — ${role.group}` : role.title}
                  </p>
                  <span className="text-[10px] text-neutral-700">{role.year}</span>
                </div>
                {brief ? (
                  <p className="text-[10.5px] leading-[1.35] text-neutral-800">
                    {[role.organization, role.description].filter(Boolean).join(" — ")}
                  </p>
                ) : (
                  <>
                    {role.organization && (
                      <p className="text-[10px] italic text-neutral-700">{role.organization}</p>
                    )}
                    {role.description && (
                      <p className="mt-0.5 text-[10.5px] leading-[1.35] text-neutral-800">
                        {role.description}
                      </p>
                    )}
                    {role.highlights.length > 0 && (
                      <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[10px] leading-[1.3] text-neutral-800">
                        {role.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {section.key === "events" && (
          <div className={itemGap}>
            {section.items.map((ev, idx) => (
              <div key={`${ev.title}-${idx}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[11px] font-bold text-neutral-950">{ev.title}</p>
                  <span className="text-[10px] text-neutral-700">{ev.year}</span>
                </div>
                <p className="text-[10px] text-neutral-700">
                  {[ev.role, ev.group].filter(Boolean).join(" | ")}
                </p>
                {!brief && ev.summary && (
                  <p className="mt-0.5 text-[10.5px] leading-[1.35] text-neutral-800">
                    {ev.summary}
                  </p>
                )}
                {ev.highlights.length > 0 && (
                  <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[10px] leading-[1.3] text-neutral-800">
                    {ev.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {section.key === "creative" &&
          (brief ? (
            <ul className="list-disc space-y-0.5 pl-4 text-[10.5px] leading-[1.35] text-neutral-800">
              {section.items.map((cw, idx) => (
                <li key={`${cw.title}-${idx}`}>
                  <strong className="font-semibold text-neutral-900">{cw.title}</strong>{" "}
                  <span>
                    ({cw.category ? `${cw.category}, ` : ""}
                    {cw.year})
                  </span>
                  {cw.context ? ` — ${cw.context}` : ""}
                </li>
              ))}
            </ul>
          ) : (
            <div className={itemGap}>
              {section.items.map((cw, idx) => (
                <div key={`${cw.title}-${idx}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-[11px] font-bold text-neutral-950">{cw.title}</p>
                    <span className="text-[10px] text-neutral-700">{cw.year}</span>
                  </div>
                  {cw.category && <p className="text-[10px] text-neutral-700">{cw.category}</p>}
                  {cw.context && (
                    <p className="mt-0.5 text-[10.5px] leading-[1.35] text-neutral-800">
                      {cw.context}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}

        {section.key === "certificates" && (
          <ul className="list-disc space-y-0.5 pl-4 text-[10.5px] leading-[1.35] text-neutral-800">
            {section.items.map((cert, idx) => (
              <li key={`${cert.title}-${idx}`}>
                <strong className="font-semibold text-neutral-900">{cert.title}</strong> —{" "}
                {cert.issuer} ({cert.year})
                {cert.description && (
                  <p className="text-[10px] text-neutral-700">{cert.description}</p>
                )}
                {cert.url && cert.displayUrl && (
                  <span>
                    {" "}
                    Verify:{" "}
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-800 underline"
                    >
                      {cert.displayUrl}
                    </a>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        {section.key === "journey" && (
          <div className={itemGap}>
            {section.items.map((m, idx) => (
              <div key={`${m.what}-${idx}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[11px] font-bold text-neutral-950">{m.what}</p>
                  <span className="text-[10px] text-neutral-700">{m.when}</span>
                </div>
                {m.where && <p className="text-[10px] text-neutral-700">{m.where}</p>}
                {!brief && m.detail && (
                  <p className="mt-0.5 text-[10.5px] leading-[1.35] text-neutral-800">{m.detail}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {section.key === "languages" && (
          <p className="text-[10.5px] leading-[1.4] text-neutral-800">
            {section.items
              .map((lang) => (lang.proficiency ? `${lang.name} (${lang.proficiency})` : lang.name))
              .join("   |   ")}
          </p>
        )}
      </div>
    </section>
  );
}

/** Light paper-style preview sheet mirroring the exported plain ATS PDF structure. */
export function CvPreviewSheet({ model }: { model: CvDocumentModel }) {
  const { header, sections, settings } = model;
  const isSerif = settings.fontStyle === "serif";
  const compact = settings.compactMode;

  return (
    <div
      className={cn(
        "mx-auto w-full rounded-xl border border-neutral-300 bg-white text-neutral-900 shadow-lg",
        compact ? "p-5 sm:p-7" : "p-6 sm:p-9",
      )}
      style={{
        fontFamily: isSerif
          ? "Georgia, 'Times New Roman', Times, serif"
          : "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Centered Header */}
      <header className="pb-1 text-center">
        <h3 className="text-lg sm:text-xl font-bold tracking-wide text-neutral-950 uppercase break-words">
          {header.name}
        </h3>
        {header.headline && (
          <p className="mt-0.5 text-xs font-semibold text-neutral-900 leading-snug">
            {header.headline}
          </p>
        )}
        <ContactLine items={header.primaryContacts} />
        <ContactLine items={header.linkContacts} />
      </header>

      {/* Sections */}
      {sections.length > 0 ? (
        sections.map((sec) => (
          <PreviewSection
            key={sec.key}
            section={sec}
            compact={compact}
            brief={settings.briefMode}
          />
        ))
      ) : (
        <p className="py-10 text-center text-xs text-neutral-500">
          No CV sections are currently enabled or populated. Enable sections above to preview your
          CV.
        </p>
      )}
    </div>
  );
}
