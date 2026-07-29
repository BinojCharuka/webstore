"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Store", href: "/store" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled ? "bg-[#111111]/90 backdrop-blur-xl border-b border-white/5" : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-[1280px] mx-auto px-8 h-[68px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] rounded-lg bg-[#aaff00] flex items-center justify-center">
            <span className="font-mono text-[13px] font-bold text-[#111] tracking-tighter">C</span>
          </div>
          <span className="font-sans text-sm font-semibold text-white tracking-tight">
            Charu Design Studio
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-lg text-[13.5px] font-medium font-sans transition-all duration-200 ${
                  active ? "bg-white/10 text-white" : "bg-transparent text-[#777] hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/store"
            className="ml-3 px-[22px] py-2.5 rounded-xl text-[13.5px] font-bold font-sans bg-[#aaff00] text-[#111] hover:bg-[#88cc00] transition-all duration-200 hover:shadow-[0_8px_30px_rgba(170,255,0,0.35)] shadow-none"
          >
            Start a Project
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="bg-[#161616] border-t border-white/5 px-6 py-3 pb-5">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium font-sans mb-1 transition-colors ${
                  active ? "text-white bg-white/5" : "text-[#777]"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
