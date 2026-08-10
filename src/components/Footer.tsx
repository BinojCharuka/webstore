"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Linkedin, Github, Youtube } from "@/components/Icons";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="border-t border-white/5 bg-[#0c0c0c] pt-20 px-8 pb-10">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 hover:opacity-80 transition-opacity w-max">
              <div className="w-[34px] h-[34px] rounded-lg overflow-hidden flex items-center justify-center bg-black">
                <img src="/logo.jpg" alt="Charu Design Studio Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-sans text-sm font-semibold text-white">Charu Design Studio</span>
            </Link>
            <p className="text-[#555] text-[13.5px] leading-relaxed max-w-[280px] font-sans">
              Premium digital design studio crafting high-conversion portfolio, LMS, and front-end experiences. Remote worldwide.
            </p>
            <div className="flex gap-2.5 mt-6">
              {[Linkedin, Github, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-[#555] hover:text-white hover:border-white/25 transition-all">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
          {[
            { title: "Navigation", links: [{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }, { label: "Store", href: "/store" }, { label: "Contact", href: "/contact" }] },
            { title: "Services", links: [{ label: "Portfolio Design", href: "/store" }, { label: "LMS Platforms", href: "/store" }, { label: "Front-End Websites", href: "/store" }, { label: "Design Systems", href: "/store" }] },
          ].map(({ title, links }) => (
            <div key={title}>
              <p className="font-mono text-[10px] font-semibold text-[#aaff00] tracking-[0.12em] uppercase mb-4">{title}</p>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-[#555] hover:text-white text-[13.5px] font-sans transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-wrap gap-4 justify-between items-center">
          <p className="text-[#333] text-[12.5px] font-sans">© {new Date().getFullYear()} Charu Design Studio · Crafted by Binoj Charuka</p>
          <p className="text-[#333] text-[12px] font-mono">Available for projects · hello@charudesign.studio</p>
        </div>
      </div>
    </footer>
  );
}
