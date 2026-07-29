"use client";
import { useState, useEffect } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { projects as fallbackProjects } from "@/data";

type ProjectFilter = "all" | "portfolio" | "lms" | "frontend";

const filterTabs: { label: string; value: ProjectFilter }[] = [
  { label: "All Works", value: "all" },
  { label: "Portfolio Website Designs", value: "portfolio" },
  { label: "LMS Platforms", value: "lms" },
  { label: "Front-End Website Designs", value: "frontend" },
];

export default function ProjectsPage() {
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [animating, setAnimating] = useState(false);
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjectsList(data);
        } else {
          setProjectsList(fallbackProjects);
        }
      })
      .catch((err) => {
        console.error(err);
        setProjectsList(fallbackProjects);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleFilter = (f: ProjectFilter) => {
    if (f === filter) return;
    setAnimating(true);
    setTimeout(() => { setFilter(f); setAnimating(false); }, 250);
  };

  const filtered = filter === "all" ? projectsList : projectsList.filter(p => p.category === filter);

  return (
    <div className="bg-[#111] min-h-screen pt-[120px] pb-[100px]">
      <div className="max-w-[1280px] mx-auto px-8">
        <Reveal>
          <div className="mb-16">
            <p className="font-mono text-[10.5px] font-semibold text-[#aaff00] tracking-[0.14em] uppercase mb-4">Our Work</p>
            <h1 className="font-sans text-[clamp(44px,6vw,84px)] font-black text-white m-0 mb-4 leading-[0.94] tracking-[-0.04em]">
              A Gallery of<br />
              <span className="bg-gradient-to-br from-[#aaff00] to-[#ccff55] bg-clip-text text-transparent">
                Exceptional Design.
              </span>
            </h1>
            <p className="font-sans text-[17px] text-[#555] max-w-[500px] leading-[1.65] m-0">
              Every project built with intention — from architecture to interaction, pixel to performance.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mb-10">
            <div className="inline-flex gap-1 p-1.5 rounded-2xl bg-[#161616] border border-white/5 flex-wrap">
              {filterTabs.map(tab => (
                <button 
                  key={tab.value} 
                  onClick={() => handleFilter(tab.value)}
                  className={`px-5 py-2.5 rounded-xl text-[13px] font-semibold font-sans whitespace-nowrap transition-all duration-250 ${
                    filter === tab.value 
                      ? "bg-[#aaff00] text-[#111] shadow-[0_4px_20px_rgba(170,255,0,0.3)]" 
                      : "bg-transparent text-[#555] hover:text-[#ccc]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <p className="font-mono text-[11px] text-[#333] mt-3.5 tracking-[0.04em]">
              {filtered.length} project{filtered.length !== 1 ? "s" : ""} · {filter === "all" ? "all categories" : filterTabs.find(t => t.value === filter)?.label}
            </p>
          </div>
        </Reveal>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-250 ${animating ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`}>
          {filtered.map((p, i) => <ProjectCard key={`${filter}-${p._id || p.id}`} project={p} index={i} />)}
        </div>
      </div>
    </div>
  );
}
