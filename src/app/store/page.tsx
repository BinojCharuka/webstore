"use client";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { HoverButton } from "@/components/HoverButton";
import { packages as fallbackPackages } from "@/data";
import Link from "next/link";
import { useState, useEffect } from "react";

function PricingCard({ pkg, index }: { pkg: any; index: number }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={index * 80}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className={`relative rounded-[22px] p-8 pb-7 border flex flex-col h-full transition-all duration-300 ${
          pkg.popular 
            ? "border-[#aaff00]/45 bg-gradient-to-br from-[#1a1a2e] to-[#161626] shadow-[0_0_60px_rgba(170,255,0,0.12)]" 
            : hov ? "border-white/15 bg-[#161616] shadow-[0_20px_60px_rgba(0,0,0,0.4)]" : "border-white/10 bg-[#161616]"
        }`}
      >
        {pkg.popular && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#aaff00] text-[#111] text-[11px] font-bold font-sans shadow-[0_4px_20px_rgba(170,255,0,0.4)]">
              Most Popular
            </span>
          </div>
        )}
        <div className="mb-6">
          <p className="font-mono text-[10px] text-[#aaff00] tracking-[0.12em] uppercase mb-2">{pkg.period}</p>
          <h3 className="font-sans text-[19px] font-extrabold text-white mb-2 tracking-[-0.02em]">{pkg.name}</h3>
          <p className="font-sans text-[13px] text-[#555] m-0 leading-[1.6]">{pkg.desc}</p>
        </div>
        <div className="mb-6">
          <span className="font-sans text-[44px] font-black text-white tracking-[-0.04em]">{pkg.price}</span>
        </div>
        <ul className="list-none p-0 m-0 mb-7 flex-1">
          {pkg.features.map((f: string, i: number) => (
            <li key={i} className="flex items-start gap-2.5 mb-3">
              <div className="w-[18px] h-[18px] rounded-full bg-[#aaff00]/15 flex items-center justify-center shrink-0 mt-px">
                <Check size={9} className="text-[#aaff00]" />
              </div>
              <span className="font-sans text-[13px] text-[#777] leading-[1.5]">{f}</span>
            </li>
          ))}
        </ul>
        <Link href="/contact"
          className={`block text-center w-full p-3.5 rounded-xl text-[13.5px] font-bold font-sans transition-all duration-200 border ${
            pkg.popular
              ? `bg-[#aaff00] text-[#111] border-transparent ${hov ? "shadow-[0_8px_30px_rgba(170,255,0,0.4)]" : "shadow-[0_4px_20px_rgba(170,255,0,0.25)]"}`
              : `bg-transparent ${hov ? "text-white border-white/25" : "text-[#777] border-white/10"}`
          }`}>
          Order Now
        </Link>
      </div>
    </Reveal>
  );
}

export default function StorePage() {
  const [packagesList, setPackagesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/packages?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPackagesList(data);
        } else {
          setPackagesList(fallbackPackages);
        }
      })
      .catch((err) => {
        console.error(err);
        setPackagesList(fallbackPackages);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#111] min-h-screen pt-[120px] pb-[100px]">
      <div className="max-w-[1280px] mx-auto px-8">
        <Reveal>
          <div className="text-center mb-[72px]">
            <p className="font-mono text-[10.5px] font-semibold text-[#aaff00] tracking-[0.14em] uppercase mb-3.5">Packages & Pricing</p>
            <h1 className="font-sans text-[clamp(44px,6vw,80px)] font-black text-white m-0 mb-4 leading-[0.96] tracking-[-0.04em]">
              Premium Services.
            </h1>
            <p className="font-sans text-[17px] text-[#555] max-w-[500px] mx-auto leading-[1.65]">
              Transparent pricing, exceptional outcomes. Choose your package — or reach out for a custom scope.
            </p>
          </div>
        </Reveal>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-[60px]">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#aaff00]"></div>
            </div>
          ) : (
            packagesList.map((pkg, i) => <PricingCard key={i} pkg={pkg} index={i} />)
          )}
        </div>

        {/* Custom CTA */}
        <Reveal>
          <div className="rounded-[22px] border border-white/10 bg-[#161616] py-12 px-10 md:px-14 flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="font-mono text-[10.5px] text-[#aaff00] tracking-[0.12em] uppercase mb-2">Custom Scope</p>
              <h3 className="font-sans text-[26px] font-extrabold text-white mb-2 tracking-[-0.02em]">Need something bespoke?</h3>
              <p className="font-sans text-[14px] text-[#555] m-0 max-w-[400px]">Complex scope, enterprise requirements, or a unique vision — let's scope it together with full transparency.</p>
            </div>
            <HoverButton primary href="/contact">
              <span>Get a Custom Quote</span> <ArrowRight size={15} />
            </HoverButton>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
