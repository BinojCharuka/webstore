"use client";
import { useState } from "react";
import Link from "next/link";

export function HoverButton({
  children,
  primary = false,
  href,
}: {
  children: React.ReactNode;
  primary?: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-sans text-sm font-bold transition-all duration-200 border ${
        primary
          ? "bg-[#aaff00] hover:bg-[#c2ff33] text-[#111] border-transparent shadow-[0_4px_20px_rgba(170,255,0,0.2)] hover:shadow-[0_8px_30px_rgba(170,255,0,0.35)]"
          : "bg-transparent hover:bg-white/5 text-[#777] hover:text-white border-white/10 hover:border-white/20"
      }`}
    >
      {children}
    </Link>
  );
}
