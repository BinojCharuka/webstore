import React, { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Download, ExternalLink, X } from "lucide-react";

export interface FlyerLightboxProps {
  images: string[];
  initialIndex?: number;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export function FlyerLightbox({
  images,
  initialIndex = 0,
  title,
  isOpen,
  onClose,
}: FlyerLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", onKeyDown);
    // Prevent body scrolling while modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} gallery`}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-xl p-4 sm:p-6 transition-all duration-300 animate-in fade-in"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-primary font-bold">
            {String(currentIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </span>
          <span className="hidden sm:inline font-mono text-xs text-muted-foreground/60">·</span>
          <h4 className="font-serif text-sm sm:text-base text-white truncate max-w-md">
            {title}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {currentImage && (
            <a
              href={currentImage}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              title="Open full resolution in new tab"
              data-cursor-label="Open"
            >
              <ExternalLink size={16} />
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            className="cursor-target rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            title="Close viewer (Esc)"
            data-cursor-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="cursor-target absolute left-2 sm:left-6 z-20 rounded-full bg-black/60 border border-white/20 p-2.5 sm:p-3 text-white/90 hover:bg-primary hover:border-primary hover:text-black transition-all"
            aria-label="Previous flyer"
            data-cursor-label="Prev"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        <div className="relative max-h-full max-w-full flex items-center justify-center p-2">
          <img
            key={currentImage}
            src={currentImage}
            alt={`${title} flyer ${currentIndex + 1}`}
            className="max-h-[75vh] sm:max-h-[80vh] w-auto max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95"
          />
        </div>

        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="cursor-target absolute right-2 sm:right-6 z-20 rounded-full bg-black/60 border border-white/20 p-2.5 sm:p-3 text-white/90 hover:bg-primary hover:border-primary hover:text-black transition-all"
            aria-label="Next flyer"
            data-cursor-label="Next"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip (if multiple flyers) */}
      {images.length > 1 && (
        <div className="z-10 flex items-center justify-center gap-2 overflow-x-auto py-2 px-4 max-w-3xl mx-auto">
          {images.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`cursor-target relative h-12 w-12 sm:h-14 sm:w-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                idx === currentIndex
                  ? "border-primary scale-105 shadow-md"
                  : "border-white/20 opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt={`Thumb ${idx + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default FlyerLightbox;
