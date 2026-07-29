export function DeviceFrame({ img, alt, type = "browser" }: { img: string; alt: string; type?: "browser" | "mobile" }) {
  if (type === "mobile") {
    return (
      <div className="w-[220px] shrink-0 bg-[#1a1a1a] rounded-[28px] border-4 lg:border-8 border-[#2a2a2a] p-2 lg:px-2 lg:pt-6 lg:pb-4 shadow-2xl relative mx-auto">
        <div className="w-16 h-1.5 rounded-full bg-[#2a2a2a] mx-auto mb-3 hidden lg:block" />
        <div className="rounded-xl lg:rounded-2xl overflow-hidden aspect-[9/16] bg-[#111]">
          <img src={img} alt={alt} className="w-full h-full object-cover block" />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full bg-[#1e1e1e] rounded-xl lg:rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      <div className="h-9 bg-[#161616] flex items-center px-4 gap-1.5 border-b border-white/5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <div className="flex-1 mx-3 h-5 bg-white/5 rounded-md flex items-center justify-center">
          <span className="text-[10px] text-[#555] font-mono">charudesign.studio</span>
        </div>
      </div>
      <div className="aspect-[16/9] bg-[#111] overflow-hidden">
        <img src={img} alt={alt} className="w-full h-full object-cover block" />
      </div>
    </div>
  );
}
