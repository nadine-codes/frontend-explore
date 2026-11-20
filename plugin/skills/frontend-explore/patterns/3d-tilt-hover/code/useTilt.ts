import { useEffect, useRef } from 'react';

export type TiltPhase = 'idle' | 'tilting' | 'settling' | 'disabled';

/** What the card is doing on a given animation frame. */
export interface TiltFrame {
  rotateX: number;
  rotateY: number;
  /** Pointer position inside the card, 0–1 on each axis. `null` when it's outside. */
  pointer: { x: number; y: number } | null;
  phase: TiltPhase;
}

export interface TiltOptions {
  /** Largest rotation in degrees, reached at the card's edges. Default 10. */
  maxTilt?: number;
  /** How much of the remaining distance to cover each frame (0–1). Lower = softer. Default 0.14. */
  smoothing?: number;
  /** Scale while hovered. 1 = no lift. Default 1.02. */
  lift?: number;
  /** Tilt away from the pointer instead of toward it. */
  invert?: boolean;
  /** Keep the card flat (e.g. for reduced motion). The lift still applies. */
  disabled?: boolean;
  /** Called every animation frame. Write to the DOM here, don't set React state. */
  onFrame?: (frame: TiltFrame) => void;
}

const DEFAULTS = { maxTilt: 10, smoothing: 0.14, lift: 1.02, invert: false, disabled: false };

type Motion = { rx: number; ry: number; gx: number; gy: number; hover: number };
const KEYS = ['rx', 'ry', 'gx', 'gy', 'hover'] as const;
const REST: Motion = { rx: 0, ry: 0, gx: 50, gy: 50, hover: 0 };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function resolve(options: TiltOptions) {
  return {
    maxTilt: options.maxTilt ?? DEFAULTS.maxTilt,
    smoothing: clamp(options.smoothing ?? DEFAULTS.smoothing, 0.01, 1),
    lift: options.lift ?? DEFAULTS.lift,
    invert: options.invert ?? DEFAULTS.invert,
    disabled: options.disabled ?? DEFAULTS.disabled,
  };
}

/**
 * Pointer-reactive 3D tilt.
 *
 * Attach the returned ref to an element. The hook writes CSS custom properties
 * (`--tilt-rx`, `--tilt-ry`, `--tilt-scale`, `--tilt-hover`, `--tilt-glare-*`)
 * straight onto it every frame, so the animation never re-renders React.
 * The loop only runs while something is moving, then stops.
 */
export function useTilt<T extends HTMLElement>(options: TiltOptions = {}) {
  const ref = useRef<T>(null);
  const latest = useRef(options);
  const wake = useRef<() => void>(() => {});

  // Keep the newest options for the animation loop, and redraw once
  // so changes like `disabled` show up even when the pointer is still.
  useEffect(() => {
    latest.current = options;
    wake.current();
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let target: Motion = { ...REST };
    const current: Motion = { ...REST };
    let pointer: TiltFrame['pointer'] = null;
    let frameId = 0;

    const render = () => {
      const o = resolve(latest.current);
      const rx = o.disabled ? 0 : current.rx;
      const ry = o.disabled ? 0 : current.ry;
      const style = el.style;
      style.setProperty('--tilt-rx', `${rx.toFixed(2)}deg`);
      style.setProperty('--tilt-ry', `${ry.toFixed(2)}deg`);
      style.setProperty('--tilt-scale', (1 + (o.lift - 1) * current.hover).toFixed(4));
      style.setProperty('--tilt-hover', current.hover.toFixed(3));
      style.setProperty('--tilt-glare-x', `${current.gx.toFixed(1)}%`);
      style.setProperty('--tilt-glare-y', `${current.gy.toFixed(1)}%`);
      style.setProperty('--tilt-glare-o', o.disabled ? '0' : current.hover.toFixed(3));

      const phase: TiltPhase = o.disabled
        ? 'disabled'
        : pointer
          ? 'tilting'
          : Math.abs(current.rx) + Math.abs(current.ry) > 0.05
            ? 'settling'
            : 'idle';
      latest.current.onFrame?.({ rotateX: rx, rotateY: ry, pointer, phase });
    };

    // Each frame, move a fraction of the way toward the target (smoothing).
    const tick = () => {
      const { smoothing } = resolve(latest.current);
      let moving = false;
      for (const key of KEYS) {
        const gap = target[key] - current[key];
        if (Math.abs(gap) > 0.001) {
          current[key] += gap * smoothing;
          moving = true;
        } else {
          current[key] = target[key];
        }
      }
      render();
      frameId = moving ? requestAnimationFrame(tick) : 0;
    };

    const start = () => {
      if (!frameId) frameId = requestAnimationFrame(tick);
    };
    wake.current = start;

    const aim = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      const x = clamp((event.clientX - box.left) / box.width, 0, 1);
      const y = clamp((event.clientY - box.top) / box.height, 0, 1);
      const o = resolve(latest.current);
      const direction = o.invert ? -1 : 1;
      pointer = { x, y };
      target = {
        rx: -(y - 0.5) * 2 * o.maxTilt * direction, // pointer at the top tips the top away
        ry: (x - 0.5) * 2 * o.maxTilt * direction,
        gx: x * 100,
        gy: y * 100,
        hover: 1,
      };
      start();
    };

    const release = () => {
      pointer = null;
      target = { ...REST, gx: target.gx, gy: target.gy }; // glare fades where it was
      start();
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') release(); // finger lifted
    };

    el.addEventListener('pointermove', aim);
    el.addEventListener('pointerdown', aim);
    el.addEventListener('pointerleave', release);
    el.addEventListener('pointercancel', release);
    el.addEventListener('pointerup', onPointerUp);
    render();

    return () => {
      el.removeEventListener('pointermove', aim);
      el.removeEventListener('pointerdown', aim);
      el.removeEventListener('pointerleave', release);
      el.removeEventListener('pointercancel', release);
      el.removeEventListener('pointerup', onPointerUp);
      cancelAnimationFrame(frameId);
      wake.current = () => {};
    };
  }, []);

  return ref;
}
