"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, Monitor, BookOpen, Code2, Star, TrendingUp, Award, ChevronDown, Sparkles, ChevronRight, Briefcase, GraduationCap } from "lucide-react";
import { HoverButton } from "@/components/HoverButton";
import { Reveal } from "@/components/Reveal";
import { ProjectCard } from "@/components/ProjectCard";
import { projects as fallbackProjects } from "@/data";
import Link from "next/link";
import { MinimalistHero } from "@/components/ui/minimalist-hero";
import { Mail, Globe } from "lucide-react";
import { Github, Linkedin, Youtube } from "@/components/Icons";
import SpecularButton from "@/components/ui/SpecularButton";

import { GradientCard } from "@/components/ui/gradient-card";
import { ReviewSection } from "@/components/ui/review-scroller";
import GradientWaves from "@/components/ui/GradientWaves";
import DepthCarousel from "@/components/ui/DepthCarousel";


const getSkillIconSlug = (skill: string) => {
  const s = skill.toLowerCase();
  if (s.includes('html')) return 'html5';
  if (s.includes('css') && !s.includes('tailwind')) return 'css3';
  if (s.includes('javascript') || s === 'js') return 'javascript';
  if (s.includes('typescript') || s === 'ts') return 'typescript';
  if (s.includes('python')) return 'python';
  if (s.includes('php')) return 'php';
  if (s.includes('sql') || s.includes('mysql')) return 'mysql';
  if (s === 'c') return 'c';
  if (s === 'c++') return 'cplusplus';
  if (s === 'c#') return 'csharp';
  if (s.includes('react')) return 'react';
  if (s.includes('node')) return 'nodedotjs';
  if (s.includes('express')) return 'express';
  if (s.includes('mongo')) return 'mongodb';
  if (s.includes('next')) return 'nextdotjs';
  if (s.includes('tailwind')) return 'tailwindcss';
  if (s.includes('gsap')) return 'greensock';
  if (s.includes('framer')) return 'framer';
  if (s.includes('figma')) return 'figma';
  if (s.includes('ui/ux')) return 'figma'; 
  if (s.includes('three')) return 'threedotjs';
  if (s.includes('webgl')) return 'webgl';
  if (s.includes('firebase')) return 'firebase';
  if (s.includes('supabase')) return 'supabase';
  if (s.includes('aws')) return 'amazonaws';
  if (s.includes('docker')) return 'docker';
  if (s.includes('git')) return 'git';
  return null;
};

export default function HomePage() {
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP", "Framer Motion", "Three.js", "WebGL", "Node.js", "MongoDB", "Figma", "UI/UX Design"],
    education: [
      { degree: "BSc (Hons) Software Engineering", institution: "University of Plymouth", year: "2020 - 2024", desc: "Specialized in scalable web architectures, UI/UX design, and full-stack development." },
      { degree: "Advanced Diploma in Software Engineering", institution: "NSBM Green University", year: "2018 - 2020", desc: "Foundation in algorithms, data structures, and modern web frameworks." }
    ],
    experience: [
      { role: "Senior UI/UX Developer", company: "Freelance", year: "2022 - Present", desc: "Leading frontend architecture and premium web experiences for international clients." },
      { role: "Frontend Engineer", company: "TechNova Solutions", year: "2020 - 2022", desc: "Developed responsive dashboards and LMS platforms using React and Next.js." }
    ]
  });

  const [progress, setProgress] = useState(0);
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/projects?t=${Date.now()}`, { cache: "no-store" }).then((res) => res.json()),
      fetch(`/api/profile?t=${Date.now()}`, { cache: "no-store" }).then((res) => res.json())
    ])
      .then(([projectsData, profile]) => {
        if (Array.isArray(projectsData) && projectsData.length > 0) {
          setProjectsList(projectsData);
        } else {
          setProjectsList(fallbackProjects);
        }
        
        if (profile && (profile.skills?.length > 0 || profile.experience?.length > 0 || profile.education?.length > 0)) {
          setProfileData({
            skills: profile.skills || [],
            education: profile.education || [],
            experience: profile.experience || []
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setProjectsList(fallbackProjects);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress(p => (p < 85 ? p + Math.random() * 12 : p));
      }, 150);
      return () => clearInterval(interval);
    } else {
      setProgress(100);
      setTimeout(() => setShowPreloader(false), 500); // Wait for progress bar to hit 100%
    }
  }, [loading]);



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

  const reviewRows = [
    {
      id: 'row1',
      speed: '50s',
      direction: 'left' as const,
      reviews: [...testimonials, ...testimonials].map((t, i) => ({ ...t, id: `row1-${i}` }))
    },
    {
      id: 'row2',
      speed: '65s',
      direction: 'right' as const,
      reviews: [...[...testimonials].reverse(), ...[...testimonials].reverse()].map((t, i) => ({ ...t, id: `row2-${i}` }))
    }
  ];

  return (
    <>
      <AnimatePresence>
        {showPreloader && (
          <motion.div 
            key="preloader"
            initial={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            className="fixed inset-0 z-[99999] bg-[#0c0c0c] flex flex-col items-center justify-center"
          >
            <div className="mb-8 overflow-hidden">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                className="font-sans font-black text-white text-[32px] tracking-[-0.04em]"
              >
                Charu<span className="text-[#aaff00]">.</span>
              </motion.div>
            </div>
            
            <div className="w-[200px] h-[3px] bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#88cc00] to-[#aaff00] rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              />
            </div>
            <div className="mt-5 font-mono text-[10px] text-[#555] uppercase tracking-[0.2em]">
              {Math.min(100, Math.round(progress))}% · Loading Experience
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
      {/* ── Hero ── */}
      <MinimalistHero
        logoText="binoj."
        navLinks={[
          { label: 'HOME', href: '#' },
          { label: 'WORK', href: '#work' },
          { label: 'SERVICES', href: '#services' },
          { label: 'CONTACT', href: '/contact' },
        ]}
        mainText={"Web &\nUI/UX\nDeveloper"}
        readMoreLink="/contact"
        imageSrc="/profile.png"
        imageAlt="Binoj Charuka portrait"
        overlayText={{
          part1: 'I design.',
          part2: 'I build.',
          part3: 'I elevate.',
        }}
        socialLinks={[
          { icon: Github, href: '#' },
          { icon: Linkedin, href: '#' },
          { icon: Youtube, href: '#' },
          { icon: Mail, href: '/contact' },
        ]}
        locationText="Sri Lanka"
        className="mb-0"
      />

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

      {/* ── Dynamic Background Wrapper ── */}
      <div className="relative bg-[#0c0c0c]">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="sticky top-0 h-screen w-full opacity-60 overflow-hidden transform-gpu">
            <GradientWaves
              horizonColor="#000000"
              waveColor="#111111"
              crestColor="#aaff00"
              speed={0.2}
              amplitude={1.5}
              zoom={1.3}
              height={6.0}
              fogDepth={12}
              tilt={1.2}
              detail="low"
            />
          </div>
        </div>

        <div className="relative z-10">
          {/* ── Services ── */}
          <section className="py-16 md:py-[120px] px-4 md:px-8 border-b border-white/5">
            <div className="max-w-[1280px] mx-auto">
          <div className="flex justify-between items-end mb-10 md:mb-16 flex-wrap gap-4 md:gap-6">
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
            {services.map((s, i) => {
              const abstractImages = [
                "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80"
              ];
              return (
                <Reveal key={i} delay={i * 100} className="h-full">
                  <GradientCard
                    badgeText={s.num}
                    title={s.title}
                    description={s.desc}
                    bottomStat={s.stat}
                    ctaText="Explore"
                    ctaHref="/store"
                    icon={<s.icon size={20} />}
                    imageUrl={abstractImages[i % 3]}
                    gradient="dark"
                  />
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Journey & Skills ── */}
      <section className="py-16 md:py-[120px] px-4 md:px-8 border-b border-white/5">
        <div className="max-w-[1280px] mx-auto">
          <Reveal>
            <div className="mb-10 md:mb-16">
              <p className="font-mono text-[10.5px] font-semibold text-[#aaff00] tracking-[0.14em] uppercase mb-3">My Journey</p>
              <h2 className="font-sans text-[clamp(36px,4vw,56px)] font-black text-white m-0 leading-[1.05] tracking-[-0.03em]">Experience & Education</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
            {/* Experience */}
            <div>
              <h3 className="font-sans text-xl font-bold text-white mb-8 flex items-center gap-3">
                <Briefcase size={20} className="text-[#aaff00]" /> Experience
              </h3>
              <div className="space-y-8">
                {profileData.experience.map((item, i) => (
                  <Reveal key={i} delay={i * 100}>
                    <div className="relative pl-6 border-l border-white/10">
                      <div className="absolute w-3 h-3 bg-[#aaff00] rounded-full -left-[6.5px] top-1.5 shadow-[0_0_10px_rgba(170,255,0,0.5)]"></div>
                      <span className="font-mono text-[11px] text-[#aaff00] tracking-wider mb-2 block">{item.year}</span>
                      <h4 className="font-sans text-lg font-bold text-white m-0">{item.role}</h4>
                      <p className="font-sans text-[13.5px] text-white/50 mt-1 mb-3">{item.company}</p>
                      <p className="font-sans text-[14px] text-[#888] leading-relaxed m-0">{item.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="font-sans text-xl font-bold text-white mb-8 flex items-center gap-3">
                <GraduationCap size={20} className="text-[#aaff00]" /> Education
              </h3>
              <div className="space-y-8">
                {profileData.education.map((item, i) => (
                  <Reveal key={i} delay={i * 100}>
                    <div className="relative pl-6 border-l border-white/10">
                      <div className="absolute w-3 h-3 bg-[#aaff00] rounded-full -left-[6.5px] top-1.5 shadow-[0_0_10px_rgba(170,255,0,0.5)]"></div>
                      <span className="font-mono text-[11px] text-[#aaff00] tracking-wider mb-2 block">{item.year}</span>
                      <h4 className="font-sans text-lg font-bold text-white m-0">{item.degree}</h4>
                      <p className="font-sans text-[13.5px] text-white/50 mt-1 mb-3">{item.institution}</p>
                      <p className="font-sans text-[14px] text-[#888] leading-relaxed m-0">{item.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mt-16 md:mt-24">
            <Reveal>
              <h3 className="font-sans text-xl font-bold text-white mb-8 text-center">Core Arsenal</h3>
            </Reveal>
            <div className="flex flex-wrap justify-center gap-3 max-w-[900px] mx-auto">
              {profileData.skills.map((skill, i) => {
                const slug = getSkillIconSlug(skill);
                return (
                  <Reveal key={skill} delay={i * 50}>
                    <div className="px-5 py-3 flex items-center gap-2.5 rounded-xl bg-[#111] border border-white/10 hover:border-[#aaff00]/50 hover:bg-[#aaff00]/10 text-[#bbb] hover:text-[#aaff00] font-sans text-[14px] font-medium transition-all duration-300 cursor-default shadow-sm hover:shadow-[0_0_15px_rgba(170,255,0,0.15)] hover:-translate-y-1">
                      {slug && (
                        <span 
                          className="w-[18px] h-[18px] inline-block bg-current transition-colors duration-300" 
                          style={{
                            WebkitMaskImage: `url(https://cdn.simpleicons.org/${slug})`,
                            WebkitMaskSize: 'contain',
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                            maskImage: `url(https://cdn.simpleicons.org/${slug})`,
                            maskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                          }} 
                        />
                      )}
                      {skill}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Recent Work ── */}
      <section className="py-16 md:py-[120px] px-4 md:px-8 border-b border-white/5">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex justify-between items-end mb-10 md:mb-14 flex-wrap gap-4 md:gap-6">
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
          <div className="w-full mt-8 md:mt-12 h-[500px] md:h-[650px] relative overflow-hidden">
            <DepthCarousel 
              items={projectsList.slice(0, 5)}
              cardWidth={500}
              cardHeight={480}
              depth={250}
              spread={160}
              tilt={18}
              tiltDirection="left"
              perspective={1100}
              visibleCards={4}
              falloff={0.4}
              blur={12}
              autoplay={true}
              loop={true}
              showControls={false}
              onChange={() => {}}
              renderItem={(project: any, index: number) => (
                <div className="w-[500px] pointer-events-auto h-full">
                  <ProjectCard project={project} index={index} />
                </div>
              )}
            />
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 md:py-[120px] px-4 md:px-8 border-b border-white/5">
        <div className="max-w-[1280px] mx-auto">
          <Reveal>
            <div className="text-center mb-10 md:mb-16">
              <p className="font-mono text-[10.5px] font-semibold text-[#aaff00] tracking-[0.14em] uppercase mb-3">Social Proof</p>
              <h2 className="font-sans text-[clamp(36px,4vw,56px)] font-black text-white m-0 tracking-[-0.03em]">What clients say</h2>
            </div>
          </Reveal>
          <div className="w-[100vw] relative left-1/2 -translate-x-1/2">
            <ReviewSection rows={reviewRows} />
          </div>
        </div>
      </section>

      {/* ── CTA Band ── */}
      <section className="py-10 md:py-20 px-4 md:px-8">
        <div className="max-w-[1280px] mx-auto">
          <Reveal>
            <div className="relative rounded-[28px] bg-gradient-to-br from-[#88cc00] via-[#aaff00] to-[#99ee00] py-12 md:py-[72px] px-6 md:px-14 overflow-hidden text-center">
              <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
              <div className="relative z-10 flex flex-col items-center">
                <Sparkles size={24} className="text-black/40 mb-4" />
                <h2 className="font-sans text-[clamp(36px,5vw,68px)] font-black text-[#111] mb-4 tracking-[-0.035em] leading-none">
                  Ready to build<br />something exceptional?
                </h2>
                <p className="font-sans text-[17px] text-black/55 mb-9 max-w-[400px] leading-[1.6]">
                  Let's turn your vision into a digital experience that performs and converts.
                </p>
                <SpecularButton
                  href="/contact"
                  size="lg"
                  baseColor="#111111"
                  lineColor="#aaff00"
                  tint="#111111"
                  tintOpacity={1}
                  textColor="#aaff00"
                  className="font-sans font-bold"
                >
                  Let's Build Together
                </SpecularButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
        </div>
      </div>
      </div>
    </>
  );
}
