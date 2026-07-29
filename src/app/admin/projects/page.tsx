"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check, Loader2, Sparkles, Eye } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/ImageUpload";

interface Feature {
  title: string;
  desc: string;
  img: string;
}

interface ProjectData {
  _id?: string;
  title: string;
  subtitle: string;
  desc: string;
  category: "portfolio" | "lms" | "frontend";
  tags: string[];
  img: string;
  year: string;
  techStack: string[];
  caseStudyDetails: {
    timeline: string;
    users: string;
    completionRate: string;
    lighthouse: string;
    problem: string;
    approach: string;
    features: Feature[];
  };
}

const emptyProject: ProjectData = {
  title: "",
  subtitle: "",
  desc: "",
  category: "portfolio",
  tags: [],
  img: "",
  year: new Date().getFullYear().toString(),
  techStack: [],
  caseStudyDetails: {
    timeline: "",
    users: "",
    completionRate: "",
    lighthouse: "",
    problem: "",
    approach: "",
    features: [
      { title: "Main Module", desc: "Core module feature", img: "" }
    ],
  },
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  
  // Tag string inputs (comma-separated helper state)
  const [tagsStr, setTagsStr] = useState("");
  const [techStr, setTechStr] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await fetch(`/api/projects?t=${Date.now()}`, { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Quick check for URL parameter to open form immediately
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("add") === "true") {
        handleAddNew();
      }
    }
  }, [projects]);

  const handleAddNew = () => {
    setEditingProject({ ...emptyProject });
    setTagsStr("");
    setTechStr("");
    setIsFormOpen(true);
  };

  const handleEdit = (p: ProjectData) => {
    setEditingProject({ ...p });
    setTagsStr(p.tags.join(", "));
    setTechStr(p.techStack.join(", "));
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setSubmitting(true);
    const payload = {
      ...editingProject,
      tags: tagsStr.split(",").map((t) => t.trim()).filter(Boolean),
      techStack: techStr.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      const url = editingProject._id ? `/api/projects/${editingProject._id}` : "/api/projects";
      const method = editingProject._id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchProjects();
        setIsFormOpen(false);
        setEditingProject(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const updateCaseStudy = (field: string, val: any) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      caseStudyDetails: {
        ...editingProject.caseStudyDetails,
        [field]: val,
      },
    });
  };

  const updateFeature = (idx: number, field: keyof Feature, val: string) => {
    if (!editingProject) return;
    const newFeatures = [...editingProject.caseStudyDetails.features];
    newFeatures[idx] = { ...newFeatures[idx], [field]: val };
    updateCaseStudy("features", newFeatures);
  };

  const addFeatureInput = () => {
    if (!editingProject) return;
    const newFeatures = [...editingProject.caseStudyDetails.features, { title: "", desc: "", img: "" }];
    updateCaseStudy("features", newFeatures);
  };

  const removeFeatureInput = (idx: number) => {
    if (!editingProject) return;
    const newFeatures = editingProject.caseStudyDetails.features.filter((_, i) => i !== idx);
    updateCaseStudy("features", newFeatures);
  };

  const labelStyle = "block font-mono text-[10px] text-[#555] tracking-[0.12em] uppercase mb-1.5";
  const inputStyle = "w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white outline-none focus:border-[#aaff00]/50 focus:shadow-[0_0_0_3px_rgba(170,255,0,0.05)] transition-all font-sans text-sm";

  return (
    <div className="p-8 max-w-[1280px] w-full">
      <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
        <div>
          <h1 className="font-sans text-3xl font-extrabold text-white tracking-tight m-0">Projects Manager</h1>
          <p className="font-sans text-[13.5px] text-[#555] mt-1">Add, edit, or remove entries from your portfolio gallery</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#aaff00] text-[#111] font-sans text-sm font-bold shadow-[0_4px_25px_rgba(170,255,0,0.2)] hover:bg-[#88cc00] hover:shadow-[0_8px_30px_rgba(170,255,0,0.35)] transition-all"
        >
          <Plus size={16} />
          <span>Add Project</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#aaff00]" size={36} />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-[#161616] border border-white/5 rounded-3xl py-20 text-center">
          <p className="font-sans text-[#555] text-sm mb-4">No projects found in the database.</p>
          <button onClick={handleAddNew} className="text-sm font-sans font-bold text-[#aaff00] underline">Add your first project</button>
        </div>
      ) : (
        /* Data Table */
        <div className="bg-[#161616] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-[#0c0c0c]/50">
                  <th className="p-5 font-mono text-[10px] text-[#555] tracking-wider uppercase">Project</th>
                  <th className="p-5 font-mono text-[10px] text-[#555] tracking-wider uppercase">Category</th>
                  <th className="p-5 font-mono text-[10px] text-[#555] tracking-wider uppercase">Year</th>
                  <th className="p-5 font-mono text-[10px] text-[#555] tracking-wider uppercase">Tech Stack</th>
                  <th className="p-5 font-mono text-[10px] text-[#555] tracking-wider uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {projects.map((p) => (
                  <tr key={p._id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <img src={p.img} alt={p.title} className="w-16 h-10 object-cover rounded-lg border border-white/10 shrink-0" />
                        <div>
                          <p className="font-sans text-[14.5px] font-bold text-white m-0 leading-tight">{p.title}</p>
                          <p className="font-sans text-[12px] text-[#555] mt-1 m-0 max-w-[240px] truncate">{p.subtitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="px-2.5 py-1 rounded bg-[#aaff00]/10 border border-[#aaff00]/20 text-[#aaff00] text-[10.5px] font-mono uppercase tracking-wide">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-5 font-mono text-sm text-[#777]">{p.year}</td>
                    <td className="p-5">
                      <div className="flex flex-wrap gap-1.5 max-w-[280px]">
                        {p.techStack.slice(0, 3).map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/50 text-[10px] font-mono">
                            {t}
                          </span>
                        ))}
                        {p.techStack.length > 3 && (
                          <span className="text-[10px] text-[#444] font-mono pl-1">+{p.techStack.length - 3} more</span>
                        )}
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/projects/${p._id}`} target="_blank" className="p-2 rounded-lg border border-white/5 bg-[#111] hover:border-white/20 text-[#555] hover:text-white transition-all">
                          <Eye size={14} />
                        </Link>
                        <button onClick={() => handleEdit(p)} className="p-2 rounded-lg border border-white/5 bg-[#111] hover:border-white/20 text-[#555] hover:text-white transition-all">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(p._id!)} className="p-2 rounded-lg border border-white/5 bg-[#111] hover:border-red-500/30 hover:bg-red-500/10 text-[#555] hover:text-red-400 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-out Form Overlay */}
      {isFormOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-[700px] bg-[#161616] border-l border-white/10 h-full flex flex-col shadow-2xl">
            {/* Form Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-sans text-[17px] font-bold text-white m-0">
                  {editingProject._id ? "Edit Project" : "Add New Project"}
                </h3>
                <p className="font-sans text-[12px] text-[#555] mt-0.5">Configure details, tags, and case study parameters</p>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="p-2 rounded-lg hover:bg-white/5 text-[#555] hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Form Fields Scroll */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Basic Fields */}
              <div className="space-y-4">
                <h4 className="font-mono text-[10px] text-[#aaff00] tracking-[0.14em] uppercase border-b border-white/5 pb-2">Basic Info</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Project Title</label>
                    <input type="text" required placeholder="Lumina" value={editingProject.title} onChange={e => setEditingProject({ ...editingProject, title: e.target.value })} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Category</label>
                    <select value={editingProject.category} onChange={e => setEditingProject({ ...editingProject, category: e.target.value as any })} className={inputStyle}>
                      <option value="portfolio">Portfolio Website</option>
                      <option value="lms">LMS Platform</option>
                      <option value="frontend">Custom Front-End</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Subtitle</label>
                  <input type="text" required placeholder="A comprehensive learning system" value={editingProject.subtitle} onChange={e => setEditingProject({ ...editingProject, subtitle: e.target.value })} className={inputStyle} />
                </div>

                <div>
                  <label className={labelStyle}>Brief Description</label>
                  <textarea rows={3} required placeholder="Brief summary of the work..." value={editingProject.desc} onChange={e => setEditingProject({ ...editingProject, desc: e.target.value })} className={`${inputStyle} resize-none`} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Year</label>
                    <input type="text" required value={editingProject.year} onChange={e => setEditingProject({ ...editingProject, year: e.target.value })} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Main Image</label>
                    <div className="mt-1">
                      <ImageUpload 
                        onUploadSuccess={(url) => setEditingProject({...editingProject, img: url})}
                        currentImage={editingProject.img}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Tags (comma separated)</label>
                    <input type="text" placeholder="Branding, UI/UX, Web Design" value={tagsStr} onChange={e => setTagsStr(e.target.value)} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Tech Stack (comma separated)</label>
                    <input type="text" placeholder="Next.js, Tailwind, MongoDB" value={techStr} onChange={e => setTechStr(e.target.value)} className={inputStyle} />
                  </div>
                </div>
              </div>

              {/* Case Study Details */}
              <div className="space-y-4 pt-4">
                <h4 className="font-mono text-[10px] text-[#aaff00] tracking-[0.14em] uppercase border-b border-white/5 pb-2">Case Study Specs & Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Timeline Timeline</label>
                    <input type="text" placeholder="8 weeks" value={editingProject.caseStudyDetails.timeline} onChange={e => updateCaseStudy("timeline", e.target.value)} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Total Users</label>
                    <input type="text" placeholder="4,200+" value={editingProject.caseStudyDetails.users} onChange={e => updateCaseStudy("users", e.target.value)} className={inputStyle} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Completion Rate</label>
                    <input type="text" placeholder="89%" value={editingProject.caseStudyDetails.completionRate} onChange={e => updateCaseStudy("completionRate", e.target.value)} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Lighthouse Score</label>
                    <input type="text" placeholder="98/100" value={editingProject.caseStudyDetails.lighthouse} onChange={e => updateCaseStudy("lighthouse", e.target.value)} className={inputStyle} />
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>The Challenge (Problem)</label>
                  <textarea rows={4} placeholder="What was the challenge..." value={editingProject.caseStudyDetails.problem} onChange={e => updateCaseStudy("problem", e.target.value)} className={`${inputStyle} resize-none`} />
                </div>

                <div>
                  <label className={labelStyle}>Our Solution (Approach)</label>
                  <textarea rows={4} placeholder="How did we solve it..." value={editingProject.caseStudyDetails.approach} onChange={e => updateCaseStudy("approach", e.target.value)} className={`${inputStyle} resize-none`} />
                </div>
              </div>

              {/* Dynamic Feature Sub-elements */}
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h4 className="font-mono text-[10px] text-[#aaff00] tracking-[0.14em] uppercase">Core Interactive Features</h4>
                  <button type="button" onClick={addFeatureInput} className="text-xs font-mono text-[#aaff00] hover:underline">+ Add Feature Module</button>
                </div>

                {editingProject.caseStudyDetails.features.map((feature, idx) => (
                  <div key={idx} className="bg-[#111] p-5 rounded-2xl border border-white/5 space-y-4 relative">
                    {editingProject.caseStudyDetails.features.length > 1 && (
                      <button type="button" onClick={() => removeFeatureInput(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-300">
                        <Trash2 size={13} />
                      </button>
                    )}
                    <p className="font-mono text-[9px] text-[#444] uppercase tracking-wide">Feature #{idx + 1}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelStyle}>Feature Title</label>
                        <input type="text" placeholder="Student Dashboard" value={feature.title} onChange={e => updateFeature(idx, "title", e.target.value)} className={inputStyle} />
                      </div>
                      <div>
                        <label className={labelStyle}>Feature Mockup Image</label>
                        <div className="mt-1">
                          <ImageUpload 
                            onUploadSuccess={(url) => updateFeature(idx, "img", url)}
                            currentImage={feature.img}
                            className="scale-95 origin-top-left w-[105%]"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className={labelStyle}>Feature Description</label>
                      <textarea rows={2} placeholder="Explain what makes this module unique..." value={feature.desc} onChange={e => updateFeature(idx, "desc", e.target.value)} className={`${inputStyle} resize-none`} />
                    </div>
                  </div>
                ))}
              </div>
            </form>

            {/* Form Footer */}
            <div className="p-6 border-t border-white/5 bg-[#0c0c0c] flex gap-3">
              <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 p-3.5 rounded-xl border border-white/10 hover:border-white/20 text-[#888] hover:text-white font-sans text-sm font-bold transition-all">
                Cancel
              </button>
              <button type="button" onClick={handleSave} disabled={submitting} className="flex-1 p-3.5 rounded-xl bg-[#aaff00] text-[#111] font-sans text-sm font-bold shadow-[0_4px_20px_rgba(170,255,0,0.2)] hover:bg-[#88cc00] hover:shadow-[0_8px_30px_rgba(170,255,0,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {submitting ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                <span>{editingProject._id ? "Update Project" : "Publish Project"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
