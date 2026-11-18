import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  /** 0 = far away (slow), 1 = close (fast). */
  depth: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

const COLORS = ['#ffffff', '#ffffff', '#ffffff', '#cfd8ff', '#b9a8ff', '#9be8f7'];

/** Full-screen canvas of slowly drifting, twinkling stars behind the whole site. */
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let frameId = 0;

    const createStars = () => {
      const count = Math.min(420, Math.round((width * height) / 4200));
      stars = Array.from({ length: count }, () => {
        const depth = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 0.3 + depth * 1.3,
          alpha: 0.35 + depth * 0.6,
          depth,
          twinkleSpeed: 0.4 + Math.random() * 1.6,
          twinklePhase: Math.random() * Math.PI * 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? '#ffffff',
        };
      });
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        const twinkle = reduced ? 1 : 0.65 + 0.35 * Math.sin((time / 1000) * star.twinkleSpeed + star.twinklePhase);
        // Drift upward, closer stars faster, wrapping at the top.
        const y = reduced ? star.y : (((star.y - time * 0.006 * (0.2 + star.depth)) % height) + height) % height;
        ctx.globalAlpha = star.alpha * twinkle;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createStars();
      draw(performance.now());
    };

    const loop = (time: number) => {
      draw(time);
      frameId = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize', resize);
    if (!reduced) frameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}
