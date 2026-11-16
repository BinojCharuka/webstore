'use client';

import { useEffect, useRef, useState, useCallback, type ReactNode, type CSSProperties } from 'react';
import './PixelSwap.css';

type PixelSwapProps = {
  firstContent: ReactNode;
  secondContent: ReactNode;
  pattern?: 'pointer' | 'random' | 'center' | 'edges' | 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top' | 'diagonal' | 'spiral';
  pixelSize?: number;
  gap?: number;
  pixelRadius?: number;
  pixelScale?: number;
  pixelSpin?: number;
  duration?: number;
  pixelDuration?: number;
  randomness?: number;
  bounce?: number;
  trigger?: 'hover' | 'click' | 'none';
  intro?: boolean;
  initialActive?: boolean;
  active?: boolean;
  onActive?: (active: boolean) => void;
  style?: CSSProperties;
  className?: string;
};

function getOrder(
  cols: number,
  rows: number,
  pattern: string,
  entryX?: number,
  entryY?: number,
) {
  const total = cols * rows;
  const indices = Array.from({ length: total }, (_, i) => i);

  const dist = (i: number, cx: number, cy: number) => {
    const x = i % cols;
    const y = Math.floor(i / cols);
    return Math.abs(x - cx) + Math.abs(y - cy);
  };

  switch (pattern) {
    case 'center':
      return indices.sort((a, b) => dist(a, cols / 2, rows / 2) - dist(b, cols / 2, rows / 2));
    case 'edges':
      return indices.sort((a, b) => dist(b, cols / 2, rows / 2) - dist(a, cols / 2, rows / 2));
    case 'left-to-right':
      return indices.sort((a, b) => (a % cols) - (b % cols));
    case 'right-to-left':
      return indices.sort((a, b) => (b % cols) - (a % cols));
    case 'top-to-bottom':
      return indices.sort((a, b) => Math.floor(a / cols) - Math.floor(b / cols));
    case 'bottom-to-top':
      return indices.sort((a, b) => Math.floor(b / cols) - Math.floor(a / cols));
    case 'diagonal':
      return indices.sort((a, b) => {
        const ax = a % cols, ay = Math.floor(a / cols);
        const bx = b % cols, by = Math.floor(b / cols);
        return (ax + ay) - (bx + by);
      });
    case 'spiral': {
      const result: number[] = [];
      let top = 0, bottom = rows - 1, left = 0, right = cols - 1;
      while (top <= bottom && left <= right) {
        for (let x = left; x <= right; x++) result.push(top * cols + x);
        top++;
        for (let y = top; y <= bottom; y++) result.push(y * cols + right);
        right--;
        if (top <= bottom) {
          for (let x = right; x >= left; x--) result.push(bottom * cols + x);
          bottom--;
        }
        if (left <= right) {
          for (let y = bottom; y >= top; y--) result.push(y * cols + left);
          left++;
        }
      }
      return result;
    }
    case 'pointer': {
      const cx = entryX ?? cols / 2;
      const cy = entryY ?? rows / 2;
      return indices.sort((a, b) => dist(a, cx, cy) - dist(b, cx, cy));
    }
    case 'random':
    default:
      return indices.sort(() => Math.random() - 0.5);
  }
}

export default function PixelSwap({
  firstContent,
  secondContent,
  pattern = 'pointer',
  pixelSize = 48,
  gap = 0,
  pixelRadius = 0,
  pixelScale = 0,
  pixelSpin = 0,
  duration = 400,
  pixelDuration = 350,
  randomness = 0.2,
  bounce = 0.3,
  trigger = 'hover',
  intro = true,
  initialActive = false,
  active: controlledActive,
  onActive,
  style,
  className = '',
}: PixelSwapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isActive, setIsActive] = useState(initialActive);
  const [animating, setAnimating] = useState(false);
  const [hasIntro, setHasIntro] = useState(intro);
  const entryRef = useRef<{ x: number; y: number } | null>(null);

  const active = controlledActive !== undefined ? controlledActive : isActive;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setDimensions({ width, height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (intro) {
      setHasIntro(true);
      const t = setTimeout(() => setHasIntro(false), duration + pixelDuration + 200);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [intro, duration, pixelDuration]);

  const effectiveSize = (() => {
    if (dimensions.width === 0) return pixelSize;
    const cols = Math.ceil(dimensions.width / pixelSize);
    const rows = Math.ceil(dimensions.height / pixelSize);
    if (cols * rows > 600) {
      const area = dimensions.width * dimensions.height;
      return Math.ceil(Math.sqrt(area / 600));
    }
    return pixelSize;
  })();

  const cols = dimensions.width > 0 ? Math.ceil(dimensions.width / effectiveSize) : 0;
  const rows = dimensions.height > 0 ? Math.ceil(dimensions.height / effectiveSize) : 0;
  const total = cols * rows;

  const doSwap = useCallback(
    (newActive: boolean, clientX?: number, clientY?: number) => {
      if (animating) return;
      if (clientX !== undefined && clientY !== undefined && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        entryRef.current = {
          x: ((clientX - rect.left) / rect.width) * cols,
          y: ((clientY - rect.top) / rect.height) * rows,
        };
      }
      setAnimating(true);
      setIsActive(newActive);
      onActive?.(newActive);
      setTimeout(() => setAnimating(false), duration + pixelDuration + 50);
    },
    [animating, cols, rows, duration, pixelDuration, onActive],
  );

  const handlers =
    trigger === 'hover'
      ? {
          onMouseEnter: (e: React.MouseEvent) => doSwap(true, e.clientX, e.clientY),
          onMouseLeave: (e: React.MouseEvent) => doSwap(false, e.clientX, e.clientY),
        }
      : trigger === 'click'
        ? { onClick: (e: React.MouseEvent) => doSwap(!active, e.clientX, e.clientY) }
        : {};

  const order = total > 0
    ? getOrder(cols, rows, pattern, entryRef.current?.x, entryRef.current?.y)
    : [];

  return (
    <div
      ref={containerRef}
      className={`pixel-swap ${className}`}
      style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%', ...style }}
      {...handlers}
    >
      {/* Back layer */}
      <div className="pixel-swap__layer" style={{ opacity: active ? 0 : 1 }}>
        {firstContent}
      </div>
      {/* Front layer */}
      <div className="pixel-swap__layer" style={{ opacity: active ? 1 : 0 }}>
        {secondContent}
      </div>

      {/* Pixel grid overlay during animation or intro */}
      {(animating || hasIntro) && total > 0 && (
        <div className="pixel-swap__grid" aria-hidden="true">
          {order.map((idx, rank) => {
            const x = idx % cols;
            const y = Math.floor(idx / cols);
            const noise = randomness > 0 ? (Math.random() - 0.5) * randomness * duration : 0;
            const delay = (rank / total) * duration + noise;
            return (
              <div
                key={idx}
                className="pixel-swap__pixel"
                style={{
                  left: x * effectiveSize,
                  top: y * effectiveSize,
                  width: effectiveSize - gap,
                  height: effectiveSize - gap,
                  borderRadius: `${pixelRadius}%`,
                  transitionDelay: `${Math.max(0, delay)}ms`,
                  transitionDuration: `${pixelDuration}ms`,
                  transitionTimingFunction: bounce > 0
                    ? `cubic-bezier(0.34, ${1 + bounce}, 0.64, 1)`
                    : 'ease',
                  transform: `scale(${pixelScale}) rotate(${pixelSpin}deg)`,
                  opacity: 0,
                  ...(animating || hasIntro
                    ? { transform: 'scale(1) rotate(0deg)', opacity: 1 }
                    : {}),
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
