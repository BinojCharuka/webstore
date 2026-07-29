"use client";
import { Globe, Layout, Database, Cpu, Zap, Layers, Clock, Users, TrendingUp, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
import { DeviceFrame } from "@/components/DeviceFrame";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/data";
import { useParams } from "next/navigation";

import { useState, useEffect } from "react";

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    
    // Find static fallback first to render instantly
    const fallback = projects.find(p => p.id.toString() === params.id);
    setProject(fallback || null);

    // Fetch fresh from DB
    fetch(`/api/projects/${params.id}?t=${Date.now()}`, { cache: "no-store" })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (data && data._id) {
          setProject(data);
        }
      })
      .catch(() => {
        if (!fallback) setProject(projects[0]);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#aaff00]"></div>
      </div>
    );
  }

  const stack = project.techStack?.map((name: string) => {
    return { icon: Globe, label: name };
  }) || [
    { icon: Globe, label: "Next.js" },
    { icon: Layout, label: "Tailwind CSS" },
    { icon: Database, label: "MongoDB" },
    { icon: Cpu, label: "TypeScript" },
  ];

  const features = project.caseStudyDetails?.features || [
    { title: "Student Dashboard", desc: "Personalized learning paths, progress tracking, streaks, and achievement badges.", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=700&h=420&fit=crop&auto=format" }
  ];

  const metrics = [
    { icon: Clock, label: "Timeline", val: project.caseStudyDetails?.timeline || "8 weeks" },
    { icon: Users, label: "Users", val: project.caseStudyDetails?.users || "4,200+" },
    { icon: TrendingUp, label: "Completion Rate", val: project.caseStudyDetails?.completionRate || "89%" },
    { icon: Award, label: "Lighthouse", val: project.caseStudyDetails?.lighthouse || "98/100" }
  ];

  const problemBody = project.caseStudyDetails?.problem || "No problem statement defined yet.";
  const approachBody = project.caseStudyDetails?.approach || "No solution approach defined yet.";


  return (
    <div className="bg-[#111] min-h-screen">
      {/* Hero */}
      <div className="relative h-[65vh] min-h-[440px] overflow-hidden">
        <img src={project.img} alt={project.title} className="w-full h-full object-cover block" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/70 to-[#111]/30" />
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-16 max-w-[1280px] mx-auto">
          <Link href="/projects"
            className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3.5 py-1.5 text-[#888] hover:text-white text-[12.5px] font-sans transition-all duration-200 backdrop-blur-md mb-6">
            ← Back to Projects
          </Link>
          <div className="flex gap-2 flex-wrap mb-4">
            {(project.tags || []).map((t: string) => (
              <span key={t} className="px-3 py-1 rounded-md bg-[#aaff00]/15 text-[#bbff33] text-[11.5px] font-mono border border-[#aaff00]/25">
                {t}
              </span>
            ))}
          </div>
          <h1 className="font-sans text-[clamp(36px,5vw,68px)] font-black text-white m-0 leading-[1.02] tracking-[-0.04em] max-w-[720px]">
            {project.title}: {project.desc.split('.')[0]}.
          </h1>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-8 py-16 pb-[100px]">
        {/* Overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {metrics.map(({ icon: Icon, label, val }: { icon: any; label: string; val: string }) => (
            <Reveal key={label}>
              <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
                <Icon size={18} className="text-[#aaff00] mb-3" />
                <p className="font-sans text-[26px] font-extrabold text-white m-0 mb-1 tracking-[-0.03em]">{val}</p>
                <p className="font-sans text-xs text-[#444] m-0">{label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Problem + Approach */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-16">
          {[
            { label: "Problem Statement", title: "The challenge", body: problemBody },
            { label: "Design Approach", title: "The solution", body: approachBody },
          ].map(({ label, title, body }) => (
            <Reveal key={label}>
              <div className="bg-[#161616] border border-white/5 rounded-3xl p-8 lg:p-9">
                <p className="font-mono text-[10.5px] text-[#aaff00] tracking-[0.12em] uppercase mb-4">{label}</p>
                <h3 className="font-sans text-xl font-bold text-white mb-3.5 tracking-[-0.02em]">{title}</h3>
                <p className="font-sans text-sm text-[#666] leading-[1.75] m-0">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Stack */}
        <Reveal>
          <div className="mb-16">
            <p className="font-mono text-[10.5px] text-[#aaff00] tracking-[0.12em] uppercase mb-5">Technical Stack</p>
            <div className="flex flex-wrap gap-2.5">
              {stack.map(({ icon: Icon, label }: { icon: any; label: string }) => (
                <div key={label} className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/10 bg-[#161616] transition-all duration-200 hover:border-[#aaff00]/30">
                  <Icon size={15} className="text-[#aaff00]" />
                  <span className="font-mono text-[13px] text-[#ccc]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Features */}
        <div className="mb-16">
          <Reveal>
            <p className="font-mono text-[10.5px] text-[#aaff00] tracking-[0.12em] uppercase mb-5">Key Features</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f: any, i: number) => (
              <Reveal key={f.title} delay={i * 100}>
                <div className="rounded-[18px] border border-white/5 bg-[#161616] overflow-hidden">
                  <DeviceFrame img={f.img} alt={f.title} />
                  <div className="p-5 pt-4">
                    <h4 className="font-sans text-[15px] font-bold text-white mb-2">{f.title}</h4>
                    <p className="font-sans text-[13px] text-[#555] leading-[1.65] m-0">{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal>
          <Link href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#aaff00] hover:bg-[#88cc00] text-[#111] text-sm font-bold font-sans transition-all duration-200 shadow-[0_8px_30px_rgba(170,255,0,0.3)] hover:shadow-[0_12px_40px_rgba(170,255,0,0.4)]">
            Build Something Like This <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
