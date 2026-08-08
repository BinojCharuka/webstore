import React from 'react';
import { Star } from 'lucide-react';

export interface Review {
  id: string;
  name: string;
  role: string;
  avatar: string;
  text: string;
  stars: number;
}

export const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="bg-[#161616] border border-white/5 rounded-2xl p-7 w-[380px] flex-shrink-0 hover:border-[#aaff00]/20 transition-colors duration-300">
      <div className="flex gap-0.5 mb-5">
        {Array.from({ length: review.stars }).map((_, j) => (
          <Star key={j} size={14} className="text-[#aaff00] fill-[#aaff00]" />
        ))}
      </div>
      <p className="font-sans text-[14.5px] text-[#aaa] leading-[1.8] mb-8 min-h-[85px]">"{review.text}"</p>
      <div className="flex items-center gap-3 mt-auto">
        <img src={review.avatar} alt={review.name} className="w-11 h-11 rounded-full object-cover border border-white/10" />
        <div>
          <p className="font-sans text-[14px] font-semibold text-white m-0 tracking-tight">{review.name}</p>
          <p className="font-sans text-[12.5px] text-[#555] mt-0.5">{review.role}</p>
        </div>
      </div>
    </div>
  );
};

export const HorizontalScroller = ({ 
  children, 
  speed = '40s', 
  direction = 'left' 
}: { 
  children: React.ReactNode, 
  speed?: string, 
  direction?: 'left' | 'right' 
}) => {
  const animationClass =
    direction === 'right' ? 'animate-scroll-horizontal-reverse' : 'animate-scroll-horizontal';

  const style = { '--scroll-duration': speed } as React.CSSProperties;

  return (
    <div className="w-full overflow-hidden relative group">
      {/* Optional edge masks for a fade out effect at the edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0c0c0c] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0c0c0c] to-transparent z-10 pointer-events-none" />
      
      <div className={`flex ${animationClass} group-hover:[animation-play-state:paused]`} style={style}>
        <div className="flex items-stretch justify-center flex-shrink-0 gap-5 px-2.5">
          {children}
        </div>
        {/* Duplicate for seamless loop */}
        <div className="flex items-stretch justify-center flex-shrink-0 gap-5 px-2.5" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

export const ReviewSection = ({ 
  rows 
}: { 
  rows: { id: string, speed: string, direction: 'left' | 'right', reviews: Review[] }[] 
}) => {
  return (
    <div className="flex flex-col gap-5 z-10 w-full py-4">
      {rows.map((row) => (
        <HorizontalScroller key={row.id} speed={row.speed} direction={row.direction}>
          {row.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </HorizontalScroller>
      ))}
    </div>
  );
};
