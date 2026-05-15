"use client";

import { useEffect, useRef } from "react";

/**
 * Renderuje animowane tło – statyczna siatka CSS + subtelne "cząsteczki" na canvas.
 * Respektuje prefers-reduced-motion i pauzuje przy ukrytym tabie.
 */
export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Jeśli user wymaga reduced motion — pomijamy animację cząsteczek
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }[] = [];

    const PARTICLE_COUNT = 40;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    let animationId: number | null = null;
    let running = true;

    const animate = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    // Pauza gdy tab ukryty — oszczędza CPU/baterię
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
      {/* Siatka – czysto CSS, bez JS */}
      <div className="fixed inset-0 bg-grid pointer-events-none z-0" />
      {/* Gradient od góry */}
      <div className="fixed inset-0 bg-gradient-cyber pointer-events-none z-0" />
      {/* Canvas z cząsteczkami */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.6 }}
      />
    </>
  );
}
