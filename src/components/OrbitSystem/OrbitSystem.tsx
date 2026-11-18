import { useEffect, useImperativeHandle, useRef, type CSSProperties, type ReactNode, type Ref } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import './OrbitSystem.css';

export interface OrbitPlanet {
  label: string;
  color: string;
  /** Starting position in degrees. 0 = top, 90 = right. */
  angle: number;
}

export interface Orbit {
  /** Diameter as a % of the whole system. */
  size: number;
  /** Seconds per lap at speed 1. */
  duration: number;
  planets: OrbitPlanet[];
}

export type OrbitDirection = 'clockwise' | 'counterclockwise';

export interface OrbitSystemProps {
  orbits: Orbit[];
  /** What sits in the middle, e.g. a logo or icon. */
  center?: ReactNode;
  /** Speed multiplier. 1 = each orbit's own duration, 0 = stopped. Default 1. */
  speed?: number;
  direction?: OrbitDirection;
  /** Make the system look tipped back, in degrees (0–80). 0 = flat. Default 0. */
  tilt?: number;
  /** Counter-rotate each planet so its label stays readable. Default true. */
  uprightLabels?: boolean;
  /** Draw the dashed orbit paths. Default true. */
  showPaths?: boolean;
  /** Freeze while the pointer is over the system. Default false. */
  pauseOnHover?: boolean;
  paused?: boolean;
  /** Accessible description. Without one, the system is hidden from screen readers as decoration. */
  label?: string;
  className?: string;
  /** React 19: `ref` is a plain prop on function components. */
  ref?: Ref<HTMLDivElement>;
}

const SPIN = 'orbit-spin';

/**
 * Keeps every ring in step with its planets, then applies speed and direction.
 *
 * Uses the Web Animations API instead of changing `animation-duration`, which
 * would make the planets jump. `playbackRate` changes speed smoothly, and a
 * negative rate runs the same animation backwards.
 */
function syncOrbits(root: HTMLElement, rate: number) {
  root.querySelectorAll<HTMLElement>('.orbit__ring').forEach((ring) => {
    const spins = ring
      .getAnimations({ subtree: true })
      .filter((animation): animation is CSSAnimation => animation instanceof CSSAnimation && animation.animationName === SPIN);
    const lead = ring.getAnimations().find((animation) => spins.includes(animation as CSSAnimation));
    if (!lead) return;

    const duration = Number(lead.effect?.getComputedTiming().duration) || 0;
    let time = Number(lead.currentTime ?? 0);
    // Running backwards from near 0 would hit the start and stop, so jump far
    // ahead by whole laps (which looks identical) before reversing.
    if (duration > 0 && time < duration * 1000) time += duration * 10000;

    for (const animation of spins) {
      animation.currentTime = time;
      animation.playbackRate = rate;
    }
  });
}

export function OrbitSystem({
  orbits,
  center,
  speed = 1,
  direction = 'clockwise',
  tilt = 0,
  uprightLabels = true,
  showPaths = true,
  pauseOnHover = false,
  paused = false,
  label,
  className,
  ref,
}: OrbitSystemProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => rootRef.current as HTMLDivElement, []);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!rootRef.current || reduced) return;
    syncOrbits(rootRef.current, speed * (direction === 'counterclockwise' ? -1 : 1));
  }, [speed, direction, uprightLabels, orbits, reduced]);

  return (
    <div
      ref={rootRef}
      className={['orbit-system', className].filter(Boolean).join(' ')}
      style={{ '--orbit-tilt': `${Math.min(80, Math.max(0, tilt))}deg` } as CSSProperties}
      data-paused={paused || reduced}
      data-pause-on-hover={pauseOnHover}
      data-upright={uprightLabels}
      data-paths={showPaths}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      <div className="orbit__plane">
        <div className="orbit__center">{center}</div>
        {orbits.map((orbit, index) => (
          <div
            key={index}
            className="orbit__ring"
            style={{ '--size': `${orbit.size}%`, '--duration': `${orbit.duration}s` } as CSSProperties}
          >
            {orbit.planets.map((planet) => (
              <div key={planet.label} className="orbit__arm" style={{ '--angle': `${planet.angle}deg` } as CSSProperties}>
                <div className="orbit__body" style={{ '--color': planet.color } as CSSProperties}>
                  <span className="orbit__dot" />
                  <span className="orbit__label">{planet.label}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
