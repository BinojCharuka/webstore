"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Check } from "lucide-react";
import { Linkedin, Github, Youtube } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", type: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ name: "", email: "", type: "", message: "" });
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (field: string) => {
    const isFocused = focused === field;
    return `w-full px-4 py-3.5 rounded-xl font-sans text-sm outline-none transition-all duration-200 border box-border ${
      isFocused
        ? "bg-white/5 border-[#aaff00]/50 shadow-[0_0_0_3px_rgba(170,255,0,0.1)]"
        : "bg-white/[0.03] border-white/10"
    } ${form[field as keyof typeof form] ? "text-white" : "text-[#fff]"}`;
  };

  const labelStyle = "block font-mono text-[10px] text-[#555] tracking-[0.12em] uppercase mb-2";

  return (
    <div className="bg-[#111] min-h-screen pt-[120px] pb-[100px]">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left */}
          <div>
            <Reveal>
              <p className="font-mono text-[10.5px] font-semibold text-[#aaff00] tracking-[0.14em] uppercase mb-4">Get In Touch</p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-sans text-[clamp(52px,7vw,96px)] font-black text-white m-0 mb-6 leading-[0.9] tracking-[-0.05em]">
                Let's<br />
                <span className="bg-gradient-to-br from-[#aaff00] to-[#ccff55] bg-clip-text text-transparent">Build.</span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="font-sans text-[16.5px] text-[#555] leading-[1.75] mb-12 max-w-[360px]">
                Have a project in mind? Whether it's a portfolio, an LMS, or a full front-end — let's talk scope, timeline, and vision.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <div className="flex flex-col gap-4 mb-12">
                {[
                  { icon: Mail, val: "hello@charudesign.studio" },
                  { icon: Phone, val: "+94 71 234 5678" },
                  { icon: MapPin, val: "Colombo, Sri Lanka · Remote Worldwide" },
                ].map(({ icon: Icon, val }) => (
                  <div key={val} className="flex items-center gap-3.5">
                    <div className="w-[38px] h-[38px] rounded-[11px] border border-white/10 flex items-center justify-center">
                      <Icon size={16} className="text-[#aaff00]" />
                    </div>
                    <span className="font-sans text-[13.5px] text-[#777]">{val}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={220}>
              <p className="font-mono text-[10.5px] text-[#aaff00] tracking-[0.12em] uppercase mb-4">Find Me Online</p>
              <div className="flex gap-2.5">
                {[{ icon: Linkedin, label: "LinkedIn", href: "#" }, { icon: Github, label: "GitHub", href: "#" }, { icon: Youtube, label: "YouTube", href: "#" }].map(({ icon: Icon, label, href }) => (
                  <a key={label} href={href}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[11px] border border-white/10 text-[#555] text-[13px] font-sans no-underline transition-all duration-200 hover:text-white hover:border-white/20">
                    <Icon size={14} />{label}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right — Form */}
          <Reveal delay={100}>
            <div className="bg-[#161616] border border-white/10 rounded-3xl p-10 md:p-11">
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-[72px] h-[72px] rounded-full bg-[#aaff00]/15 flex items-center justify-center mx-auto mb-6">
                    <Check size={30} className="text-[#aaff00]" />
                  </div>
                  <h3 className="font-sans text-2xl font-extrabold text-white mb-3">Message sent!</h3>
                  <p className="font-sans text-sm text-[#555] mb-7">Binoj will get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="bg-transparent border-none text-[#aaff00] text-[13.5px] font-sans cursor-pointer underline">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 className="font-sans text-[22px] font-extrabold text-white mb-7 tracking-[-0.02em]">Send an Inquiry</h2>
                  <div className="flex flex-col gap-5">
                    <div>
                      <label className={labelStyle}>Full Name</label>
                      <input type="text" required placeholder="Binoj Charuka" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                        className={getInputStyle("name")} />
                    </div>
                    <div>
                      <label className={labelStyle}>Email Address</label>
                      <input type="email" required placeholder="you@studio.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                        className={getInputStyle("email")} />
                    </div>
                    <div>
                      <label className={labelStyle}>Project Type</label>
                      <select required value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                        onFocus={() => setFocused("type")} onBlur={() => setFocused(null)}
                        className={`${getInputStyle("type")} appearance-none ${!form.type ? "text-[#555]" : ""}`}>
                        <option value="" disabled className="bg-[#1a1a1a]">Select a project type</option>
                        {["Portfolio Website", "LMS Platform", "Custom Front-End", "Brand Identity", "Other"].map(t => (
                          <option key={t} value={t} className="bg-[#1a1a1a] text-white">{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelStyle}>Your Message</label>
                      <textarea required rows={5} placeholder="Tell me about your project, timeline, and budget..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                        onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                        className={`${getInputStyle("message")} resize-none`} />
                    </div>
                     <button type="submit" disabled={loading}
                      className="w-full p-3.5 rounded-xl bg-[#aaff00] text-[#111] text-[14.5px] font-bold font-sans border-none cursor-pointer transition-all duration-200 shadow-[0_8px_30px_rgba(170,255,0,0.25)] hover:bg-[#88cc00] hover:shadow-[0_12px_40px_rgba(170,255,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed">
                      {loading ? "Sending..." : "Send Inquiry"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
