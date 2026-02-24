"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let mouseX = -1000;
    let mouseY = -1000;

    const isMobile = window.innerWidth < 768;

    // Using teal color (primary color variant)
    const config = {
      baseColor: "13, 148, 136",
      particleSize: isMobile ? 1.2 : 1.5,
      spacing: isMobile ? 60 : 40, // Increased spacing on mobile to dramatically reduce lag
      hoverRadius: 150,
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);

    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() * 0.001; // Continuous time variable for automatic drift

      const cols = Math.floor(canvas.width / config.spacing) + 2;
      const rows = Math.floor(canvas.height / config.spacing) + 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const basePathX = i * config.spacing;
          const basePathY = j * config.spacing;

          // Introduce automatic drifting animation for all particles
          const x = basePathX + Math.sin(time + j * 0.5) * 10;
          const y = basePathY + Math.cos(time + i * 0.5) * 10;

          const dx = mouseX - x;
          const dy = mouseY - y;
          const distance = mouseX !== -1000 ? Math.sqrt(dx * dx + dy * dy) : 9999;

          let size = config.particleSize;
          let opacity = theme === "dark" ? 0.2 : 0.15;

          // Automatic pulse calculation (makes it look premium even without hover)
          const autoPulse = (Math.sin(time * 2.5 + i * 0.1 + j * 0.1) + 1) * 0.5;

          // Mouse Hover effect takes priority
          if (distance < config.hoverRadius && !isMobile) {
            const factor = 1 - distance / config.hoverRadius;
            size = config.particleSize + factor * 2.5;
            opacity = (theme === "dark" ? 0.3 : 0.2) + factor * 0.6;
          } else {
            // Apply automatic pulsing animation when idle or on mobile
            size = config.particleSize + autoPulse * 0.8;
            opacity = opacity + autoPulse * 0.15;
          }

          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${config.baseColor}, ${opacity})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-2]">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
