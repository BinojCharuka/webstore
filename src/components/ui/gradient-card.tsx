import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "relative flex flex-col justify-between h-full w-full overflow-hidden rounded-2xl p-9 shadow-sm transition-all duration-300 border bg-[#161616] group",
  {
    variants: {
      gradient: {
        dark: "border-white/5 hover:border-[#aaff00]/30 hover:bg-[#1a1a1a]",
        green: "border-[#aaff00]/20 hover:border-[#aaff00]/50 shadow-[0_0_15px_rgba(170,255,0,0.05)]",
      },
    },
    defaultVariants: {
      gradient: "dark",
    },
  }
);

export interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  badgeText: string;
  badgeColor?: string; 
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  imageUrl: string;
  icon?: React.ReactNode;
  bottomStat?: string;
}

const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  ({ className, gradient, badgeText, badgeColor = "#aaff00", title, description, ctaText, ctaHref, imageUrl, icon, bottomStat, ...props }, ref) => {
    
    const cardAnimation = {
      rest: { scale: 1, y: 0 },
      hover: { scale: 1.02, y: -4 },
    };

    const imageAnimation = {
      rest: { scale: 1, rotate: 0, opacity: 0.08 },
      hover: { scale: 1.1, rotate: 3, opacity: 0.15 },
    };

    return (
      <motion.div
        variants={cardAnimation}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="h-full"
        ref={ref}
      >
        <div
          className={cn(cardVariants({ gradient }), className)}
          {...props}
        >
          {/* Subtle Glow */}
          <div className="absolute -top-10 -right-10 w-[180px] h-[180px] rounded-full bg-[#aaff00]/5 blur-[40px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Decorative background image with animation */}
          <motion.img
            src={imageUrl}
            alt={`${title} background graphic`}
            variants={imageAnimation}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="absolute -right-8 -bottom-8 w-[180px] pointer-events-none mix-blend-screen grayscale"
          />

          {/* Card Content */}
          <div className="z-10 flex flex-col h-full relative">
            {/* Top Row: Badge & Icon */}
            <div className="flex justify-between items-start mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1 text-[11px] font-mono tracking-[0.06em] text-white/70 backdrop-blur-sm w-fit transition-colors group-hover:border-[#aaff00]/20">
                <span 
                  className="h-1.5 w-1.5 rounded-full shadow-[0_0_8px_currentColor]" 
                  style={{ backgroundColor: badgeColor, color: badgeColor }}
                />
                {badgeText}
              </div>
              
              {icon && (
                <div className="w-[42px] h-[42px] rounded-xl bg-white/5 border border-white/5 flex items-center justify-center transition-all duration-300 group-hover:bg-[#aaff00]/10 group-hover:border-[#aaff00]/30 group-hover:text-[#aaff00] text-[#555]">
                  {icon}
                </div>
              )}
            </div>

            {/* Title and Description */}
            <div className="flex-grow">
              <h3 className="font-sans text-[20px] font-bold text-white mb-3 tracking-[-0.02em]">{title}</h3>
              <p className="font-sans text-[13.5px] text-[#777] leading-[1.7] max-w-[90%]">{description}</p>
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between mt-10 pt-4 border-t border-white/5">
              {bottomStat && (
                <span className="font-mono text-[11px] text-[#aaff00] tracking-[0.06em]">{bottomStat}</span>
              )}
              <a
                href={ctaHref}
                className="group/btn inline-flex items-center gap-1.5 text-[12.5px] font-sans font-semibold text-[#555] transition-colors hover:text-[#aaff00] ml-auto"
              >
                {ctaText}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);
GradientCard.displayName = "GradientCard";

export { GradientCard, cardVariants };
