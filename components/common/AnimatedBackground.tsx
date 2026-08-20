"use client";

import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    // Kolor cząstek z tokenu motywu, nie wpisany na sztywno — inaczej w jasnym
    // motywie (globals.css ma dla niego komplet zmiennych) tło byłoby niewidoczne.
    const particleColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent-700")
        .trim() || "#00708C";

    // Kanwa ma tyle pikseli, ile ich naprawdę ma ekran. Bez tego na monitorach
    // o podwyższonej gęstości cząstki są rozmyte.
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }[] = [];

    const PARTICLE_COUNT = 24;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.4 + 0.5,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.25 + 0.15,
      });
    }

    let animationId: number | null = null;
    let running = true;

    const animate = () => {
      if (!running) return;
      const viewWidth = window.innerWidth;
      const viewHeight = window.innerHeight;
      ctx.clearRect(0, 0, viewWidth, viewHeight);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = viewWidth;
        if (p.x > viewWidth) p.x = 0;
        if (p.y < 0) p.y = viewHeight;
        if (p.y > viewHeight) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = particleColor;
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      animationId = requestAnimationFrame(animate);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        running = false;
        if (animationId !== null) cancelAnimationFrame(animationId);
      } else if (!running) {
        running = true;
        animate();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    animate();

    return () => {
      running = false;
      if (animationId !== null) cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <>
      <div className="bg-dot-grid pointer-events-none fixed inset-0 z-0 opacity-50" />
      <div className="bg-hero-ambient pointer-events-none fixed inset-x-0 top-0 z-0 h-[60vh]" />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{ opacity: 0.8 }}
      />
    </>
  );
}
