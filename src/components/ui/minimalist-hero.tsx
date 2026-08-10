import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import WarpText from './WarpText';

// Define the props interface for type safety and reusability
interface MinimalistHeroProps {
  logoText: string;
  navLinks: { label: string; href: string }[];
  mainText: string;
  readMoreLink: string;
  imageSrc: string;
  imageAlt: string;
  overlayText: {
    part1: string;
    part2: string;
    part3?: string;
  };
  socialLinks: { icon: React.ElementType; href: string }[];
  locationText: string;
  className?: string;
}

// Helper component for navigation links
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="text-sm font-medium tracking-widest text-foreground/60 transition-colors hover:text-foreground"
  >
    {children}
  </a>
);

// Helper component for social media icons
const SocialIcon = ({ href, icon: Icon }: { href: string; icon: React.ElementType }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-foreground/60 transition-colors hover:text-foreground">
    <Icon className="h-5 w-5" />
  </a>
);

// The main reusable Hero Section component
export const MinimalistHero = ({
  logoText,
  navLinks,
  mainText,
  readMoreLink,
  imageSrc,
  imageAlt,
  overlayText,
  socialLinks,
  locationText,
  className,
}: MinimalistHeroProps) => {
  return (
    <div
      className={cn(
        'relative flex min-h-screen md:h-screen w-full flex-col items-center justify-between overflow-hidden bg-[#111111] p-6 py-20 font-sans md:p-12',
        className
      )}
    >


      {/* Main Content Area */}
      <div className="relative grid w-full max-w-7xl flex-grow grid-cols-1 items-center gap-12 md:gap-0 mt-8 md:mt-0 md:grid-cols-3">
        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="z-20 order-1 md:order-1 text-center md:text-left text-white"
        >
          <div className="mx-auto max-w-[600px] md:mx-0 w-full text-center md:text-right h-[180px] md:h-[400px]">
            <WarpText
              text={mainText}
              color="rgba(255, 255, 255, 0.8)"
              warpStrength={0.08}
              warpScale={1.7}
              speed={0.55}
              pointerInfluence={0.42}
              pointerStrength={0.38}
              refraction={0.018}
              ripple={true}
              fontSize="clamp(3rem, 10vw, 9rem)"
              fontWeight={800}
              fontFamily="inherit"
              letterSpacing="-0.03em"
              lineHeight={0.9}
              style={{ height: '100%', width: '100%' }}
            />
          </div>
        </motion.div>

        {/* Center Image with Circle */}
        <div className="relative order-2 md:order-2 flex justify-center items-center h-full">
            <style>{`
              @keyframes glitch-shake {
                0%, 88% { transform: translate(0, 0) skew(0deg); filter: hue-rotate(0deg) saturate(1); }
                89% { transform: translate(-8px, 4px) skew(4deg); filter: hue-rotate(90deg) saturate(3) invert(0.1); }
                91% { transform: translate(8px, -4px) skew(-4deg); filter: hue-rotate(-90deg) saturate(3) invert(0.1); }
                93% { transform: translate(-4px, 0px) skew(2deg); filter: hue-rotate(45deg) saturate(2); }
                95%, 100% { transform: translate(0, 0) skew(0deg); filter: hue-rotate(0deg) saturate(1); }
              }
              .glitch-wrapper {
                animation: glitch-shake 6s infinite;
              }
            `}</style>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="absolute z-0 h-[250px] w-[250px] rounded-full bg-[#aaff00]/90 md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]"
            ></motion.div>
            
            <div className="glitch-wrapper relative z-10 flex justify-center items-center">
              <motion.img
                  src={imageSrc}
                  alt={imageAlt}
                  className="h-[350px] w-auto object-cover md:h-[600px] lg:h-[700px] scale-[1.2]"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                  onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `https://placehold.co/400x600/eab308/ffffff?text=Image+Not+Found`;
                  }}
              />
            </div>
        </div>

        {/* Right Text */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="z-0 order-3 flex items-center justify-center text-center md:justify-start w-full max-w-[600px] h-[180px] md:h-[400px] mx-auto md:mx-0"
        >
          <WarpText
            text={[overlayText.part1, overlayText.part2, overlayText.part3].filter(Boolean).join('\n')}
            color="#ffffff"
            warpStrength={0.08}
            warpScale={1.7}
            speed={0.55}
            pointerInfluence={0.42}
            pointerStrength={0.38}
            refraction={0.018}
            ripple={true}
            fontSize="clamp(3rem, 10vw, 9rem)"
            fontWeight={800}
            fontFamily="inherit"
            letterSpacing="-0.03em"
            lineHeight={0.9}
            style={{ height: '100%', width: '100%' }}
          />
        </motion.div>
      </div>

      {/* Footer Elements */}
      <footer className="z-30 flex w-full max-w-7xl flex-col md:flex-row gap-4 items-center justify-between text-white mt-12 md:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex items-center space-x-4"
        >
          {socialLinks.map((link, index) => (
            <SocialIcon key={index} href={link.href} icon={link.icon} />
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.3 }}
          className="text-sm font-medium text-white/80"
        >
          {locationText}
        </motion.div>
      </footer>
    </div>
  );
};
