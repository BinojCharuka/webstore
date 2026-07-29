"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check, Loader2, Sparkles } from "lucide-react";

interface PackageData {
  _id?: string;
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  popular: boolean;
}

const emptyPackage: PackageData = {
  name: "",
  price: "$0",
  period: "One-Time",
  desc: "",
  features: [],
  popular: false,
};

export default function PackagesManager() {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPkg, setEditingPkg] = useState<PackageData | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [featuresStr, setFeaturesStr] = useState("");

  const fetchPackages = async () => {
    try {
      const res = await fetch(`/api/packages?t=${Date.now()}`, { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) {
        setPackages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleAddNew = () => {
    setEditingPkg({ ...emptyPackage });
    setFeaturesStr("");
    setIsFormOpen(true);
  };

  const handleEdit = (pkg: PackageData) => {
    setEditingPkg({ ...pkg });
    setFeaturesStr(pkg.features.join("\n"));
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      const res = await fetch(`/api/packages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPackages(packages.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg) return;

    setSubmitting(true);
    const payload = {
      ...editingPkg,
      features: featuresStr.split("\n").map((f) => f.trim()).filter(Boolean),
    };

    try {
      const url = editingPkg._id ? `/api/packages/${editingPkg._id}` : "/api/packages";
      const method = editingPkg._id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchPackages();
        setIsFormOpen(false);
        setEditingPkg(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const labelStyle = "block font-mono text-[10px] text-[#555] tracking-[0.12em] uppercase mb-1.5";
  const inputStyle = "w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white outline-none focus:border-[#aaff00]/50 focus:shadow-[0_0_0_3px_rgba(170,255,0,0.05)] transition-all font-sans text-sm";

  return (
    <div className="p-8 max-w-[1280px] w-full">
      <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
        <div>
          <h1 className="font-sans text-3xl font-extrabold text-white tracking-tight m-0">Store Manager</h1>
          <p className="font-sans text-[13.5px] text-[#555] mt-1">Configure the packages and pricing tiers displayed on the Web Store page</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#aaff00] text-[#111] font-sans text-sm font-bold shadow-[0_4px_25px_rgba(170,255,0,0.2)] hover:bg-[#88cc00] hover:shadow-[0_8px_30px_rgba(170,255,0,0.35)] transition-all"
        >
          <Plus size={16} />
          <span>Add Package</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#aaff00]" size={36} />
        </div>
      ) : packages.length === 0 ? (
        <div className="bg-[#161616] border border-white/5 rounded-3xl py-20 text-center">
          <p className="font-sans text-[#555] text-sm mb-4">No pricing packages found in the database.</p>
          <button onClick={handleAddNew} className="text-sm font-sans font-bold text-[#aaff00] underline">Add your first package</button>
        </div>
      ) : (
        /* Package Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((pkg) => (
            <div key={pkg._id} className={`relative rounded-3xl p-8 border flex flex-col justify-between ${pkg.popular ? "border-[#aaff00]/30 bg-gradient-to-br from-[#1a1a2e] to-[#161626]" : "border-white/5 bg-[#161616]"}`}>
              {pkg.popular && (
                <div className="absolute -top-3 left-6">
                  <span className="px-3 py-1 rounded-full bg-[#aaff00] text-[#111] text-[10px] font-bold font-sans">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="font-mono text-[9px] text-[#aaff00] uppercase tracking-wider">{pkg.period}</span>
                    <h3 className="font-sans text-xl font-bold text-white mt-1 mb-0">{pkg.name}</h3>
                  </div>
                  <span className="font-sans text-[28px] font-black text-white tracking-tight">{pkg.price}</span>
                </div>
                <p className="font-sans text-[13px] text-[#555] leading-relaxed mb-6">{pkg.desc}</p>
                
                <ul className="space-y-2 mb-8">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12.5px] text-[#777]">
                      <span className="text-[#aaff00] mt-0.5 shrink-0">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-white/5 pt-5 flex gap-2">
                <button onClick={() => handleEdit(pkg)} className="flex-1 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-[#888] hover:text-white font-sans text-[12.5px] font-bold transition-all">
                  Edit
                </button>
                <button onClick={() => handleDelete(pkg._id!)} className="px-3 rounded-xl border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-[#555] hover:text-red-400 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-out Form Overlay */}
      {isFormOpen && editingPkg && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-[500px] bg-[#161616] border-l border-white/10 h-full flex flex-col shadow-2xl">
            {/* Form Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-sans text-[17px] font-bold text-white m-0">
                  {editingPkg._id ? "Edit Package" : "Add New Package"}
                </h3>
                <p className="font-sans text-[12px] text-[#555] mt-0.5">Configure package details and feature lists</p>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="p-2 rounded-lg hover:bg-white/5 text-[#555] hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Form Fields Scroll */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className={labelStyle}>Package Name</label>
                  <input type="text" required placeholder="Startup Portfolio" value={editingPkg.name} onChange={e => setEditingPkg({ ...editingPkg, name: e.target.value })} className={inputStyle} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Price</label>
                    <input type="text" required placeholder="$1,499" value={editingPkg.price} onChange={e => setEditingPkg({ ...editingPkg, price: e.target.value })} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Period</label>
                    <input type="text" required placeholder="One-Time" value={editingPkg.period} onChange={e => setEditingPkg({ ...editingPkg, period: e.target.value })} className={inputStyle} />
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Description</label>
                  <textarea rows={3} required placeholder="Perfect for startups needing a stunning landing page..." value={editingPkg.desc} onChange={e => setEditingPkg({ ...editingPkg, desc: e.target.value })} className={`${inputStyle} resize-none`} />
                </div>

                <div>
                  <label className={labelStyle}>Features (One per line)</label>
                  <textarea rows={8} required placeholder="5 core page layouts&#10;Framer Motion animations&#10;Mobile responsiveness&#10;Lighthouse optimization" value={featuresStr} onChange={e => setFeaturesStr(e.target.value)} className={`${inputStyle} font-mono text-[12.5px]`} />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input type="checkbox" id="popular" checked={editingPkg.popular} onChange={e => setEditingPkg({ ...editingPkg, popular: e.target.checked })} className="w-4 h-4 accent-[#aaff00]" />
                  <label htmlFor="popular" className="font-sans text-[13.5px] text-[#aaa] cursor-pointer selection:bg-transparent">Highlight as 'Most Popular' package</label>
                </div>
              </div>
            </form>

            {/* Form Footer */}
            <div className="p-6 border-t border-white/5 bg-[#0c0c0c] flex gap-3">
              <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 p-3.5 rounded-xl border border-white/10 hover:border-white/20 text-[#888] hover:text-white font-sans text-sm font-bold transition-all">
                Cancel
              </button>
              <button type="button" onClick={handleSave} disabled={submitting} className="flex-1 p-3.5 rounded-xl bg-[#aaff00] text-[#111] font-sans text-sm font-bold shadow-[0_4px_20px_rgba(170,255,0,0.2)] hover:bg-[#88cc00] hover:shadow-[0_8px_30px_rgba(170,255,0,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {submitting ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                <span>{editingPkg._id ? "Update Package" : "Publish Package"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
