"use client";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "./Reveal";

export function ProjectCard({ project, index = 0 }: { project: any; index?: number }) {
  return (
    <Reveal delay={index * 80}>
      <Link href={`/projects/${project._id || project.id}`} className="group block">
        <div className="rounded-[18px] border border-white/5 group-hover:border-white/15 bg-[#161616] group-hover:bg-[#1a1a1a] overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
          <div className="relative bg-[#111] overflow-hidden">
            <img 
              src={project.img} 
              alt={project.title}
              className="w-full aspect-[16/10] object-cover block transform group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161616]/85 to-transparent/60" />
            <div className="absolute top-3.5 right-3.5">
              <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[#888] text-[11px] font-mono">
                {project.year}
              </span>
            </div>
            <div className="absolute bottom-3.5 left-3.5 flex gap-1.5 flex-wrap">
              {project.tags.map((t: string) => (
                <span key={t} className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[#aaa] text-[10.5px] font-mono">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="p-5 pt-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-sans text-[15px] font-bold text-white m-0 leading-tight">{project.title}</h3>
                <p className="font-sans text-[12.5px] text-[#555] mt-0.5 mb-0">{project.subtitle}</p>
              </div>
              <div className="w-8 h-8 rounded-lg border border-white/10 group-hover:border-[#aaff00]/40 flex items-center justify-center shrink-0 transition-all duration-200 group-hover:bg-[#aaff00]/10">
                <ArrowUpRight size={14} className="text-[#444] group-hover:text-[#aaff00] transition-colors duration-200" />
              </div>
            </div>
            <p className="font-sans text-[12.5px] text-[#555] leading-relaxed mt-3 mb-0">{project.desc}</p>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
