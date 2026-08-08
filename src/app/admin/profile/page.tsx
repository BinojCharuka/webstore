"use client";
import { useState, useEffect } from "react";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";

interface IEducation {
  degree: string;
  institution: string;
  year: string;
  desc: string;
}

interface IExperience {
  role: string;
  company: string;
  year: string;
  desc: string;
}

export default function ProfileManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [education, setEducation] = useState<IEducation[]>([]);
  const [experience, setExperience] = useState<IExperience[]>([]);
  const [skillsStr, setSkillsStr] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile?t=${Date.now()}`, { cache: "no-store" });
      const data = await res.json();
      setEducation(data.education || []);
      setExperience(data.experience || []);
      setSkillsStr((data.skills || []).join(", "));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = {
      education,
      experience,
      skills: skillsStr.split(",").map(s => s.trim()).filter(Boolean)
    };

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Profile updated successfully!");
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.error || "Failed to update profile."}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = "w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white outline-none focus:border-[#aaff00]/50 focus:shadow-[0_0_0_3px_rgba(170,255,0,0.05)] transition-all font-sans text-sm";
  const labelStyle = "block font-mono text-[10px] text-[#555] tracking-[0.12em] uppercase mb-1.5";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-[#aaff00]" size={36} />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1000px] w-full mx-auto">
      <div className="mb-10">
        <h1 className="font-sans text-3xl font-extrabold text-white tracking-tight m-0">Journey & Skills</h1>
        <p className="font-sans text-[13.5px] text-[#555] mt-1">Manage your experience, education, and skill tags.</p>
      </div>

      <form id="profile-form" onSubmit={handleSave} className="space-y-12 pb-24">
        {/* Experience Section */}
        <section className="bg-[#161616] p-8 rounded-3xl border border-white/5 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-sans text-xl font-bold text-white m-0">Experience</h2>
            <button 
              type="button" 
              onClick={() => setExperience([...experience, { role: "", company: "", year: "", desc: "" }])}
              className="text-[#aaff00] font-mono text-xs uppercase tracking-wider hover:underline flex items-center gap-1"
            >
              <Plus size={14} /> Add Role
            </button>
          </div>
          
          <div className="space-y-6">
            {experience.map((exp, idx) => (
              <div key={idx} className="relative p-6 rounded-2xl bg-[#0c0c0c] border border-white/5">
                <button 
                  type="button" 
                  onClick={() => setExperience(experience.filter((_, i) => i !== idx))}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelStyle}>Role / Title</label>
                    <input required type="text" value={exp.role} onChange={(e) => {
                      const newExp = [...experience]; newExp[idx].role = e.target.value; setExperience(newExp);
                    }} className={inputStyle} placeholder="Senior Developer" />
                  </div>
                  <div>
                    <label className={labelStyle}>Company</label>
                    <input required type="text" value={exp.company} onChange={(e) => {
                      const newExp = [...experience]; newExp[idx].company = e.target.value; setExperience(newExp);
                    }} className={inputStyle} placeholder="TechNova" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Year / Duration</label>
                    <input required type="text" value={exp.year} onChange={(e) => {
                      const newExp = [...experience]; newExp[idx].year = e.target.value; setExperience(newExp);
                    }} className={inputStyle} placeholder="2022 - Present" />
                  </div>
                  <div>
                    <label className={labelStyle}>Brief Description</label>
                    <textarea required rows={2} value={exp.desc} onChange={(e) => {
                      const newExp = [...experience]; newExp[idx].desc = e.target.value; setExperience(newExp);
                    }} className={`${inputStyle} resize-none`} placeholder="Leading frontend architecture..." />
                  </div>
                </div>
              </div>
            ))}
            {experience.length === 0 && <p className="text-[#555] text-sm text-center py-4">No experience entries added yet.</p>}
          </div>
        </section>

        {/* Education Section */}
        <section className="bg-[#161616] p-8 rounded-3xl border border-white/5 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-sans text-xl font-bold text-white m-0">Education</h2>
            <button 
              type="button" 
              onClick={() => setEducation([...education, { degree: "", institution: "", year: "", desc: "" }])}
              className="text-[#aaff00] font-mono text-xs uppercase tracking-wider hover:underline flex items-center gap-1"
            >
              <Plus size={14} /> Add Degree
            </button>
          </div>
          
          <div className="space-y-6">
            {education.map((edu, idx) => (
              <div key={idx} className="relative p-6 rounded-2xl bg-[#0c0c0c] border border-white/5">
                <button 
                  type="button" 
                  onClick={() => setEducation(education.filter((_, i) => i !== idx))}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelStyle}>Degree / Certification</label>
                    <input required type="text" value={edu.degree} onChange={(e) => {
                      const newEdu = [...education]; newEdu[idx].degree = e.target.value; setEducation(newEdu);
                    }} className={inputStyle} placeholder="BSc Software Engineering" />
                  </div>
                  <div>
                    <label className={labelStyle}>Institution</label>
                    <input required type="text" value={edu.institution} onChange={(e) => {
                      const newEdu = [...education]; newEdu[idx].institution = e.target.value; setEducation(newEdu);
                    }} className={inputStyle} placeholder="University Name" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Year</label>
                    <input required type="text" value={edu.year} onChange={(e) => {
                      const newEdu = [...education]; newEdu[idx].year = e.target.value; setEducation(newEdu);
                    }} className={inputStyle} placeholder="2020 - 2024" />
                  </div>
                  <div>
                    <label className={labelStyle}>Brief Description</label>
                    <textarea required rows={2} value={edu.desc} onChange={(e) => {
                      const newEdu = [...education]; newEdu[idx].desc = e.target.value; setEducation(newEdu);
                    }} className={`${inputStyle} resize-none`} placeholder="Specialized in UI/UX..." />
                  </div>
                </div>
              </div>
            ))}
            {education.length === 0 && <p className="text-[#555] text-sm text-center py-4">No education entries added yet.</p>}
          </div>
        </section>

        {/* Skills Section */}
        <section className="bg-[#161616] p-8 rounded-3xl border border-white/5 shadow-xl">
          <h2 className="font-sans text-xl font-bold text-white mb-6">Core Skills</h2>
          <div>
            <label className={labelStyle}>Skills (Comma separated)</label>
            <textarea 
              rows={3} 
              value={skillsStr} 
              onChange={(e) => setSkillsStr(e.target.value)} 
              className={`${inputStyle} resize-none`} 
              placeholder="Next.js, React, Tailwind CSS, TypeScript..." 
            />
          </div>
        </section>
      </form>

      {/* Floating Save Button */}
      <div className="fixed bottom-0 left-64 right-0 p-6 bg-gradient-to-t from-[#111] via-[#111]/90 to-transparent flex justify-end pointer-events-none">
        <button 
          type="submit" 
          form="profile-form" 
          disabled={saving} 
          className="pointer-events-auto flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#aaff00] text-[#111] font-sans text-sm font-bold shadow-[0_4px_25px_rgba(170,255,0,0.2)] hover:bg-[#88cc00] hover:shadow-[0_8px_30px_rgba(170,255,0,0.35)] transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
          <span>Save Profile Changes</span>
        </button>
      </div>
    </div>
  );
}
