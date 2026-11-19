import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion';

/** Star tints: mostly white, a few blue, violet and cyan. */
const TINTS = ['#ffffff', '#ffffff', '#ffffff', '#cfd8ff', '#b9a8ff', '#9be8f7'];
const MAX_STARS = 420;
/** One star per this many square pixels of viewport. */
const AREA_PER_STAR = 4200;
/** Upward drift in px per ms, scaled by depth. */
const DRIFT = 0.006;

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  /** 0 is far and slow, 1 is near and fast. */
  depth: number;
  twinkleRate: number;
  twinkleOffset: number;
  tint: string;
}

function makeStars(width: number, height: number): Star[] {
  const count = Math.min(MAX_STARS, Math.round((width * height) / AREA_PER_STAR));
  return Array.from({ length: count }, () => {
    const depth = Math.random();
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: 0.3 + depth * 1.3,
      brightness: 0.35 + depth * 0.6,
      depth,
      twinkleRate: 0.4 + Math.random() * 1.6,
      twinkleOffset: Math.random() * Math.PI * 2,
      tint: TINTS[Math.floor(Math.random() * TINTS.length)] ?? '#ffffff',
    };
  });
}

/**
 * The night sky behind every page: a full-screen canvas of stars that drift
 * upward and twinkle. Under reduced motion it draws once and holds still.
 */
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const still = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let frame = 0;

    const paint = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        const twinkle = still ? 1 : 0.65 + 0.35 * Math.sin((now / 1000) * star.twinkleRate + star.twinkleOffset);
        const y = still ? star.y : (((star.y - now * DRIFT * (0.2 + star.depth)) % height) + height) % height;
        ctx.globalAlpha = star.brightness * twinkle;
        ctx.fillStyle = star.tint;
        ctx.beginPath();
        ctx.arc(star.x, y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const fit = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      stars = makeStars(width, height);
      paint(performance.now());
    };

    const loop = (now: number) => {
      paint(now);
      frame = requestAnimationFrame(loop);
    };

    fit();
    window.addEventListener('resize', fit);
    if (!still) frame = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', fit);
      cancelAnimationFrame(frame);
    };
  }, [still]);

  return <canvas ref={canvasRef} className="fe-starfield" aria-hidden="true" />;
}
