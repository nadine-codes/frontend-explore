import { useEffect, useRef, useState } from 'react';
import { OrbitSystem, type OrbitDirection } from '../../components/OrbitSystem';
import { TECH_ORBITS } from '../../data/techOrbits';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export interface OrbitSettings {
  speed: number;
  direction: OrbitDirection;
  tilt: number;
  uprightLabels: boolean;
  showPaths: boolean;
  pauseOnHover: boolean;
  paused: boolean;
}

export const DEFAULT_ORBIT_SETTINGS: OrbitSettings = {
  speed: 1,
  direction: 'clockwise',
  tilt: 0,
  uprightLabels: true,
  showPaths: true,
  pauseOnHover: false,
  paused: false,
};

type PresetName = 'flat' | 'tilted' | 'broken';

const PRESETS: Record<PresetName, { label: string; apply: Partial<OrbitSettings> }> = {
  flat: { label: 'Flat', apply: { tilt: 0, uprightLabels: true } },
  tilted: { label: '3D tilt', apply: { tilt: 62, uprightLabels: true } },
  broken: { label: 'No counter-spin', apply: { tilt: 0, uprightLabels: false } },
};

interface OrbitPlaygroundProps {
  settings: OrbitSettings;
  onChange: (settings: OrbitSettings) => void;
}

export function OrbitPlayground({ settings, onChange }: OrbitPlaygroundProps) {
  const reduced = usePrefersReducedMotion();
  const systemRef = useRef<HTMLDivElement | null>(null);
  const angleRef = useRef<HTMLElement>(null);
  const rateRef = useRef<HTMLElement>(null);
  const [hovering, setHovering] = useState(false);

  // Live readout: read the inner ring's animation every frame and write it
  // straight into the DOM, so React doesn't re-render 60 times a second.
  useEffect(() => {
    let frame = 0;
    const read = () => {
      const ring = systemRef.current?.querySelector<HTMLElement>('.orbit__ring');
      const spin = ring?.getAnimations()[0];
      const duration = Number(spin?.effect?.getComputedTiming().duration) || 0;
      if (spin && duration && angleRef.current && rateRef.current) {
        const time = Number(spin.currentTime ?? 0);
        angleRef.current.textContent = `${(((time % duration) / duration) * 360).toFixed(0).padStart(3, ' ')}°`;
        rateRef.current.textContent = `${spin.playbackRate.toFixed(2)}×`;
      }
      frame = requestAnimationFrame(read);
    };
    frame = requestAnimationFrame(read);
    return () => cancelAnimationFrame(frame);
  }, []);

  const update = <K extends keyof OrbitSettings>(key: K, value: OrbitSettings[K]) =>
    onChange({ ...settings, [key]: value });

  const activePreset = (Object.keys(PRESETS) as PresetName[]).find((name) =>
    Object.entries(PRESETS[name].apply).every(([key, value]) => settings[key as keyof OrbitSettings] === value),
  );

  const frozen = reduced || settings.paused || settings.speed === 0 || (settings.pauseOnHover && hovering);
  const state = reduced
    ? 'reduced motion (still)'
    : settings.paused
      ? 'paused'
      : settings.speed === 0
        ? 'stopped (speed 0)'
        : frozen
          ? 'paused on hover'
          : `orbiting ${settings.direction}`;

  return (
    <div className="playground">
      <div className="stage orbit-stage" onPointerEnter={() => setHovering(true)} onPointerLeave={() => setHovering(false)}>
        <OrbitSystem
          ref={systemRef}
          className="orbit-demo"
          orbits={TECH_ORBITS}
          center={<span className="orbit-demo__mark mono">&lt;/&gt;</span>}
          label="The front-end stack as planets orbiting a sun: Components, React, Hooks, TypeScript, CSS and Motion."
          {...settings}
        />
      </div>

      <aside className="controls" aria-label="Orbit controls">
        <h2 className="controls__title mono">Presets</h2>
        <div className="presets presets--three">
          {(Object.keys(PRESETS) as PresetName[]).map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={activePreset === name}
              onClick={() => onChange({ ...settings, ...PRESETS[name].apply })}
            >
              {PRESETS[name].label}
            </button>
          ))}
        </div>

        <h2 className="controls__title mono">Tune it</h2>
        <label className="slider">
          <span className="slider__top">
            Speed
            <output>{settings.speed.toFixed(2)}×</output>
          </span>
          <input
            type="range"
            min={0}
            max={4}
            step={0.05}
            value={settings.speed}
            onChange={(e) => update('speed', Number(e.target.value))}
          />
        </label>
        <label className="slider">
          <span className="slider__top">
            3D tilt
            <output>{settings.tilt}°</output>
          </span>
          <input
            type="range"
            min={0}
            max={80}
            step={1}
            value={settings.tilt}
            onChange={(e) => update('tilt', Number(e.target.value))}
          />
        </label>

        <div className="segmented" role="group" aria-label="Direction">
          {(['clockwise', 'counterclockwise'] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              aria-pressed={settings.direction === direction}
              onClick={() => update('direction', direction)}
            >
              {direction === 'clockwise' ? '↻ Clockwise' : '↺ Counter'}
            </button>
          ))}
        </div>

        <div className="checks">
          <label>
            <input
              type="checkbox"
              checked={settings.uprightLabels}
              onChange={(e) => update('uprightLabels', e.target.checked)}
            />
            Counter-rotate labels (keep upright)
          </label>
          <label>
            <input type="checkbox" checked={settings.showPaths} onChange={(e) => update('showPaths', e.target.checked)} />
            Show orbit paths
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.pauseOnHover}
              onChange={(e) => update('pauseOnHover', e.target.checked)}
            />
            Pause on hover
          </label>
        </div>

        <button type="button" className="play-toggle" onClick={() => update('paused', !settings.paused)}>
          {settings.paused ? '▶ Play' : '❚❚ Pause'}
        </button>

        {reduced && <div className="notice">Your system asks for reduced motion, so the orbits stay still.</div>}

        <div className="readout mono">
          <div>
            state <b>{state}</b>
          </div>
          <div>
            playbackRate <b ref={rateRef}>1.00×</b>
          </div>
          <div>
            inner ring angle <b ref={angleRef}>0°</b>
          </div>
        </div>
      </aside>
    </div>
  );
}
