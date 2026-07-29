"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight, Monitor, BookOpen, Code2, Star, TrendingUp, Award, ChevronDown, Sparkles, ChevronRight } from "lucide-react";
import { HoverButton } from "@/components/HoverButton";
import { Reveal } from "@/components/Reveal";
import { DeviceFrame } from "@/components/DeviceFrame";
import { ProjectCard } from "@/components/ProjectCard";
import { projects as fallbackProjects } from "@/data";
import Link from "next/link";

export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const heroRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const services = [
    { icon: Monitor, num: "01", title: "Premium Portfolio Designs", desc: "Bespoke, conversion-focused portfolios that command attention and communicate undeniable authority.", stat: "80+ built" },
    { icon: BookOpen, num: "02", title: "Advanced LMS Platforms", desc: "Scalable learning ecosystems — student dashboards, adaptive course builders, and certification engines.", stat: "30+ platforms" },
    { icon: Code2, num: "03", title: "Custom Front-End Websites", desc: "Pixel-perfect, performant front-ends built for speed, SEO, and measurable conversion uplift.", stat: "40+ websites" },
  ];

  const testimonials = [
    { name: "Sophia Laurent", role: "Creative Director, Atelier Nord", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format", text: "Binoj delivered something beyond imagination. My portfolio tripled inbound inquiries within 30 days.", stars: 5 },
    { name: "Marcus Reid", role: "Founder, Apex Academy", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format", text: "The LMS Binoj built handles 4,000+ students without a single hiccup. Extraordinary craftsmanship.", stars: 5 },
    { name: "Yuki Tanaka", role: "Head of Product, Orion SaaS", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format", text: "Professional, precise, and the final site outperformed every benchmark we set. Highly recommend.", stars: 5 },
  ];

  return (
    <div>
      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-[100px] pb-20 overflow-hidden">
        {/* Animated grid */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
        {/* Parallax glow */}
        <div className="absolute w-[800px] h-[600px] rounded-full bg-[radial-gradient(ellipse,rgba(170,255,0,0.12)_0%,transparent_70%)] top-[40%] left-[55%] pointer-events-none transition-transform duration-700 ease-out"
             style={{ transform: `translate(calc(-50% + ${(mousePos.x - 0.5) * 60}px), calc(-50% + ${(mousePos.y - 0.5) * 40}px))` }} />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(140,100,255,0.06)_0%,transparent_70%)] top-[20%] left-[20%] pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-8 w-full relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left */}
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#aaff00]/30 bg-[#aaff00]/10 mb-7">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#aaff00] block animate-pulse" />
                  <span className="font-mono text-[11px] text-[#bbff33] tracking-[0.1em] uppercase">Available for Projects · {new Date().getFullYear()}</span>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <h1 className="font-sans text-[clamp(48px,6vw,88px)] font-black text-white leading-[0.92] tracking-[-0.035em] m-0 mb-6">
                  Elevate<br />
                  <span className="bg-gradient-to-br from-[#aaff00] via-[#ccff55] to-[#ddff99] bg-clip-text text-transparent">
                    Your
                  </span>
                  <br />Presence.
                </h1>
              </Reveal>
              <Reveal delay={200}>
                <p className="font-sans text-lg text-[#777] leading-relaxed max-w-[440px] m-0 mb-9">
                  Elite web design by <span className="text-[#ccc]">Binoj Charuka</span> — specializing in High-Conversion Portfolio, LMS, and Front-End Website Design.
                </p>
              </Reveal>
              <Reveal delay={300}>
                <div className="flex gap-3 flex-wrap">
                  <HoverButton primary href="/projects">
                    <span>View Our Work</span>
                    <ArrowRight size={15} />
                  </HoverButton>
                  <HoverButton href="/store">
                    <span>Start a Project</span>
                    <ArrowUpRight size={15} />
                  </HoverButton>
                </div>
              </Reveal>
              <Reveal delay={400}>
                <div className="flex gap-8 mt-12 pt-10 border-t border-white/5">
                  {[{ val: "120+", label: "Projects Delivered" }, { val: "98%", label: "Client Satisfaction" }, { val: "4yr+", label: "Experience" }].map(({ val, label }) => (
                    <div key={label}>
                      <p className="font-sans text-[28px] font-extrabold text-white m-0 tracking-[-0.03em]">{val}</p>
                      <p className="font-sans text-xs text-[#444] mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right — Floating device mockup */}
            <Reveal delay={150} className="hidden lg:block">
              <div className="relative">
                <div className="animate-float">
                  <DeviceFrame img="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=560&fit=crop&auto=format" alt="Dashboard preview" />
                </div>
                {/* Floating badges */}
                <div className="absolute -bottom-5 -left-5 bg-[#1a1a1a] border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                  <div className="w-9 h-9 rounded-lg bg-[#aaff00]/15 flex items-center justify-center">
                    <TrendingUp size={18} className="text-[#aaff00]" />
                  </div>
                  <div>
                    <p className="font-sans text-[13px] font-bold text-white m-0">+38% Conversions</p>
                    <p className="font-sans text-[11px] text-[#555] mt-0.5">Avg. uplift on launch</p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-[#1a1a1a] border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                  <div className="w-9 h-9 rounded-lg bg-[#10b981]/15 flex items-center justify-center">
                    <Award size={18} className="text-[#10b981]" />
                  </div>
                  <div>
                    <p className="font-sans text-[13px] font-bold text-white m-0">98 Lighthouse</p>
                    <p className="font-sans text-[11px] text-[#555] mt-0.5">Performance score</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Scroll hint */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce">
            <ChevronDown size={18} className="text-[#333]" />
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="bg-[#0c0c0c] border-y border-white/5 py-4 overflow-hidden flex">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(4).fill(0).map((_, outer) => (
            <div key={outer} className="flex items-center">
              {["Portfolio Design", "LMS Platforms", "Front-End Dev", "Design Systems", "Conversion Rate Optimization", "Brand Identity", "UI/UX Strategy"].map((t, i) => (
                <span key={i} className="inline-flex items-center gap-6 px-8 font-mono text-[11.5px] text-[#333] tracking-[0.08em] uppercase">
                  <span className="w-1 h-1 rounded-full bg-[#aaff00] inline-block" />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Services ── */}
      <section className="py-[120px] px-8 border-b border-white/5">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex justify-between items-end mb-16 flex-wrap gap-6">
            <Reveal>
              <div>
                <p className="font-mono text-[10.5px] font-semibold text-[#aaff00] tracking-[0.14em] uppercase mb-3">Our Expertise</p>
                <h2 className="font-sans text-[clamp(36px,4vw,56px)] font-black text-white m-0 leading-[1.05] tracking-[-0.03em]">
                  Three disciplines.<br />One studio.
                </h2>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <Link href="/store" className="flex items-center gap-1.5 text-[#555] hover:text-white text-[13.5px] font-sans transition-colors">
                Browse packages <ArrowRight size={14} />
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="group relative p-9 rounded-2xl border border-white/5 hover:border-[#aaff00]/30 bg-[#161616] hover:bg-[#1a1a1a] overflow-hidden transition-all duration-300">
                  <div className="absolute -top-10 -right-10 w-[180px] h-[180px] rounded-full bg-[#aaff00]/5 blur-[40px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <p className="font-mono text-[10px] text-[#333] mb-5 tracking-[0.08em]">{s.num}</p>
                    <div className="w-[52px] h-[52px] rounded-xl bg-white/5 group-hover:bg-[#aaff00]/15 border border-white/5 group-hover:border-[#aaff00]/30 flex items-center justify-center mb-6 transition-all duration-300">
                      <s.icon size={22} className="text-[#555] group-hover:text-[#aaff00] transition-colors duration-300" />
                    </div>
                    <h3 className="font-sans text-[19px] font-bold text-white mb-3 tracking-[-0.02em]">{s.title}</h3>
                    <p className="font-sans text-[13.5px] text-[#555] leading-[1.7] mb-7">{s.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-[#aaff00] tracking-[0.06em]">{s.stat}</span>
                      <Link href="/store" className="flex items-center gap-1 text-[#333] group-hover:text-[#aaff00] text-[12.5px] font-sans font-semibold transition-colors">
                        Explore <ChevronRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Work ── */}
      <section className="py-[120px] px-8 border-b border-white/5">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex justify-between items-end mb-14 flex-wrap gap-6">
            <Reveal>
              <div>
                <p className="font-mono text-[10.5px] font-semibold text-[#aaff00] tracking-[0.14em] uppercase mb-3">Selected Work</p>
                <h2 className="font-sans text-[clamp(36px,4vw,56px)] font-black text-white m-0 leading-[1.05] tracking-[-0.03em]">Recent projects</h2>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <Link href="/projects" className="flex items-center gap-1.5 text-[#555] hover:text-white text-[13.5px] font-sans transition-colors">
                View all <ArrowRight size={14} />
              </Link>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#aaff00]"></div>
              </div>
            ) : (
              projectsList.slice(0, 3).map((p, i) => <ProjectCard key={p._id || p.id} project={p} index={i} />)
            )}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-[120px] px-8 bg-[#0c0c0c] border-b border-white/5">
        <div className="max-w-[1280px] mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <p className="font-mono text-[10.5px] font-semibold text-[#aaff00] tracking-[0.14em] uppercase mb-3">Social Proof</p>
              <h2 className="font-sans text-[clamp(36px,4vw,56px)] font-black text-white m-0 tracking-[-0.03em]">What clients say</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-[#161616] border border-white/5 rounded-2xl p-7">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.stars }).map((_, j) => <Star key={j} size={13} className="text-[#aaff00] fill-[#aaff00]" />)}
                  </div>
                  <p className="font-sans text-sm text-[#aaa] leading-[1.75] mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-white/10" />
                    <div>
                      <p className="font-sans text-[13.5px] font-semibold text-white m-0">{t.name}</p>
                      <p className="font-sans text-xs text-[#444] mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Band ── */}
      <section className="py-20 px-8">
        <div className="max-w-[1280px] mx-auto">
          <Reveal>
            <div className="relative rounded-[28px] bg-gradient-to-br from-[#88cc00] via-[#aaff00] to-[#99ee00] py-[72px] px-14 overflow-hidden text-center">
              <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
              <div className="relative z-10 flex flex-col items-center">
                <Sparkles size={24} className="text-black/40 mb-4" />
                <h2 className="font-sans text-[clamp(36px,5vw,68px)] font-black text-[#111] mb-4 tracking-[-0.035em] leading-none">
                  Ready to build<br />something exceptional?
                </h2>
                <p className="font-sans text-[17px] text-black/55 mb-9 max-w-[400px] leading-[1.6]">
                  Let's turn your vision into a digital experience that performs and converts.
                </p>
                <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#111] text-[#aaff00] font-sans text-[14.5px] font-bold hover:scale-105 transition-transform duration-200">
                  Let's Build Together <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
