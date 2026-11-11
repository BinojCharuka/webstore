import { useEffect, useRef } from "react";

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  phase: number;
}

export function InteractiveConstellation({
  className = "",
  nodeCount = 42,
  connectDistance = 110,
}: {
  className?: string;
  nodeCount?: number;
  connectDistance?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let isVisible = true;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    const mouse = { x: -9999, y: -9999, radius: 130 };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // Visibility observer to pause RAF when off-screen
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = !!entry?.isIntersecting;
      if (isVisible && !prefersReducedMotion && !animId) {
        animId = requestAnimationFrame(render);
      }
    });
    observer.observe(canvas);

    // Initialize nodes
    const nodes: NodePoint[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * (width || 800),
      y: Math.random() * (height || 600),
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      baseRadius: Math.random() * 1.5 + 1,
      phase: Math.random() * Math.PI * 2,
    }));

    const onPointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const onPointerLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener("mousemove", onPointerMove);
      parent.addEventListener("mouseleave", onPointerLeave);
    }

    let time = 0;

    const render = () => {
      if (!isVisible) return;
      time += 0.015;

      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");
      const dotColor = isDark ? "rgba(36, 220, 165, " : "rgba(22, 142, 105, ";
      const lineColor = isDark ? "rgba(36, 220, 165, " : "rgba(22, 142, 105, ";

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        if (!p) continue;

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          // Wrap edges softly
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;

          // Mouse push/pull physics
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x -= (dx / dist) * force * 1.2;
            p.y -= (dy / dist) * force * 1.2;
          }
        }

        // Draw node
        const pulse = Math.sin(time + p.phase) * 0.4 + 1;
        const r = p.baseRadius * pulse;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `${dotColor}0.45)`;
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const p2 = nodes[j];
          if (!p2) continue;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < connectDistance) {
            const alpha = (1 - d / connectDistance) * (isDark ? 0.22 : 0.15);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${lineColor}${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }

        // Connect to mouse cursor if nearby
        const mdx = mouse.x - p.x;
        const mdy = mouse.y - p.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < connectDistance * 0.95) {
          const mAlpha = (1 - mdist / (connectDistance * 0.95)) * (isDark ? 0.35 : 0.22);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `${lineColor}${mAlpha.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      observer.disconnect();
      if (parent) {
        parent.removeEventListener("mousemove", onPointerMove);
        parent.removeEventListener("mouseleave", onPointerLeave);
      }
    };
  }, [nodeCount, connectDistance]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 opacity-80 ${className}`}
    />
  );
}

