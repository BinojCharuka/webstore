"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, FolderKanban, ShieldCheck, Mail, LogOut, ArrowLeft, User } from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  // If we are on the login page, don't show the sidebar
  if (pathname === "/admin/login") return null;

  const links = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Projects", href: "/admin/projects", icon: FolderKanban },
    { label: "Journey & Skills", href: "/admin/profile", icon: User },
    { label: "Store Packages", href: "/admin/packages", icon: ShieldCheck },
    { label: "Messages", href: "/admin/messages", icon: Mail },
  ];

  return (
    <aside className="w-64 bg-[#0c0c0c] border-r border-white/5 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Logo / Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-[30px] h-[30px] rounded-lg overflow-hidden flex items-center justify-center bg-black">
            <img src="/logo.jpg" alt="Studio Admin Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-sans text-xs font-bold text-white tracking-wider uppercase">Studio Admin</span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13.5px] font-medium font-sans transition-all duration-200 ${
                active
                  ? "bg-[#aaff00]/10 text-[#aaff00] border border-[#aaff00]/20"
                  : "bg-transparent text-[#555] hover:text-[#ccc] border border-transparent"
              }`}
            >
              <Icon size={17} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Actions */}
      <div className="p-4 border-t border-white/5 space-y-1.5">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium font-sans text-[#444] hover:text-[#aaa] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Site</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13.5px] font-medium font-sans text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
