import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import Message from "@/models/Message";
import Package from "@/models/Package";
import { FolderKanban, Mail, ShieldCheck, MailOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Always fetch fresh data

export default async function AdminDashboardPage() {
  await connectToDatabase();
  
  const totalProjects = await Project.countDocuments();
  const totalPackages = await Package.countDocuments();
  const totalMessages = await Message.countDocuments();
  const unreadMessages = await Message.countDocuments({ read: false });

  const recentMessages = await Message.find({}).sort({ createdAt: -1 }).limit(5);

  const stats = [
    { label: "Total Projects", val: totalProjects, icon: FolderKanban, href: "/admin/projects", color: "text-[#aaff00] bg-[#aaff00]/10" },
    { label: "Unread Messages", val: unreadMessages, icon: Mail, href: "/admin/messages", color: "text-amber-400 bg-amber-400/10" },
    { label: "Total Packages", val: totalPackages, icon: ShieldCheck, href: "/admin/packages", color: "text-blue-400 bg-blue-400/10" },
    { label: "Total Submissions", val: totalMessages, icon: MailOpen, href: "/admin/messages", color: "text-purple-400 bg-purple-400/10" },
  ];

  return (
    <div className="p-8 max-w-[1280px] w-full">
      <div className="mb-10">
        <h1 className="font-sans text-3xl font-extrabold text-white tracking-tight m-0">Dashboard</h1>
        <p className="font-sans text-[13.5px] text-[#555] mt-1">Overview of your design studio platform activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href} className="group block">
              <div className="bg-[#161616] border border-white/5 group-hover:border-white/15 rounded-2xl p-6 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                    <Icon size={18} />
                  </div>
                  <ArrowRight size={14} className="text-[#333] group-hover:text-white transition-colors" />
                </div>
                <p className="font-sans text-[32px] font-black text-white m-0 tracking-tight">{s.val}</p>
                <p className="font-sans text-xs text-[#555] mt-1.5">{s.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Messages */}
        <div className="lg:col-span-2 bg-[#161616] border border-white/5 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-sans text-[16px] font-bold text-white m-0">Recent Messages</h3>
              <p className="font-sans text-[12px] text-[#555] mt-0.5">Submissions from contact page</p>
            </div>
            <Link href="/admin/messages" className="text-xs text-[#aaff00] font-sans hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3.5">
            {recentMessages.length === 0 ? (
              <div className="text-center py-10">
                <p className="font-sans text-sm text-[#444]">No messages received yet</p>
              </div>
            ) : (
              recentMessages.map((m) => (
                <div key={m._id.toString()} className={`p-4 rounded-xl border transition-all ${m.read ? "bg-[#111111]/40 border-white/5" : "bg-[#aaff00]/5 border-[#aaff00]/10"}`}>
                  <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                    <div>
                      <span className="font-sans text-[13.5px] font-bold text-white">{m.name}</span>
                      <span className="font-sans text-[12px] text-[#555] ml-2">({m.email})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[9px] text-[#888] uppercase tracking-wide">
                      {m.type}
                    </span>
                  </div>
                  <p className="font-sans text-[12.5px] text-[#777] line-clamp-2 leading-relaxed m-0">{m.message}</p>
                  <div className="mt-2 text-[10px] text-[#444] font-mono">
                    {new Date(m.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })} · {new Date(m.createdAt).toLocaleTimeString("en-US", { timeStyle: "short" })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#161616] border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-sans text-[16px] font-bold text-white mb-1.5">Quick Actions</h3>
            <p className="font-sans text-[12px] text-[#555] mb-6">Common site management tasks</p>
            <div className="space-y-2.5">
              <Link href="/admin/projects?add=true" className="block text-center p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#aaff00]/30 hover:bg-[#aaff00]/10 text-white hover:text-[#aaff00] font-sans text-[13px] font-semibold transition-all">
                Add New Project
              </Link>
              <Link href="/admin/packages" className="block text-center p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-[#888] hover:text-white font-sans text-[13px] font-semibold transition-all">
                Manage Packages
              </Link>
            </div>
          </div>
          <div className="border-t border-white/5 pt-5 mt-6 text-center">
            <p className="font-mono text-[9.5px] text-[#333] tracking-[0.1em] uppercase">SYSTEM VERSION 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
