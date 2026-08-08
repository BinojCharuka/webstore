"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import GooeyNav from "./ui/GooeyNav";
import SpecularButton from "./ui/SpecularButton";

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin")) {
    return null;
  }
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
        <div className="hidden md:flex items-center gap-4">
          <GooeyNav 
            items={links} 
            initialActiveIndex={Math.max(0, links.findIndex(l => l.href === pathname))}
            particleCount={15}
            particleDistances={[90, 10]}
            particleR={100}
            animationTime={600}
            timeVariance={300}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
          />
          <SpecularButton
            href="/store"
            size="md"
            baseColor="#88cc00"
            lineColor="#ffffff"
            tint="#aaff00"
            tintOpacity={1}
            textColor="#111"
            className="ml-3 font-sans font-bold"
          >
            Start a Project
          </SpecularButton>
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
