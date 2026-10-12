import React, { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FloatingParticlesProps {
  className?: string;
  particleCount?: number;
  interactive?: boolean;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  className = '',
  particleCount = 45,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return true;
  });
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (!isEnabled) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initialize particles
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8, // 0.8px to 3px (representing fine aerosol)
      vx: (Math.random() - 0.5) * 0.35,
      vy: -0.2 - Math.random() * 0.45, // slow upward drift like smoke/haze thermal currents
      opacity: Math.random() * 0.6 + 0.15,
      hue: Math.random() > 0.3 ? 35 : 180, // amber warm smoke or muted cyan-gray
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle =
          p.hue === 35
            ? `rgba(251, 146, 60, ${p.opacity * 0.7})` // amber/smoke particle
            : `rgba(148, 163, 184, ${p.opacity * 0.5})`; // gray atmospheric dust
        ctx.fill();
      });

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isEnabled, particleCount]);

  return (
    <div className={`relative pointer-events-none ${className}`}>
      {isEnabled && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
        />
      )}

      {interactive && (
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          className="pointer-events-auto absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/70 hover:bg-slate-900 text-[10px] font-semibold text-slate-300 backdrop-blur-md border border-slate-700/60 shadow-xs transition-colors"
          title={isEnabled ? 'Nonaktifkan simulasi partikel' : 'Aktifkan simulasi partikel'}
        >
          {isEnabled ? (
            <>
              <Eye className="w-3 h-3 text-teal-400" />
              <span>Aerosol Aktif</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3 h-3 text-slate-400" />
              <span>Aerosol Henti</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
