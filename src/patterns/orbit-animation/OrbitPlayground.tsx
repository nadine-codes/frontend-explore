import { useEffect, useRef, useState } from 'react';
import { ControlsPanel } from '../../playground/ControlsPanel';
import { read, type ControlsManifest, type Settings } from '../../playground/manifest';
import { Playground } from '../../pages/pattern/blocks';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';
import { OrbitSystem, type OrbitDirection } from './OrbitSystem';
import { TECH_ORBITS } from './techOrbits';
import './stage.css';

interface OrbitPlaygroundProps {
  manifest: ControlsManifest;
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function OrbitPlayground({ manifest, settings, onChange }: OrbitPlaygroundProps) {
  const reduced = usePrefersReducedMotion();
  const systemRef = useRef<HTMLDivElement | null>(null);
  const angleRef = useRef<HTMLElement>(null);
  const rateRef = useRef<HTMLElement>(null);
  const [hovering, setHovering] = useState(false);

  const speed = read.number(settings, 'speed');
  const direction = read.string(settings, 'direction') as OrbitDirection;
  const paused = read.boolean(settings, 'paused');
  const pauseOnHover = read.boolean(settings, 'pauseOnHover');

  // Live readout: read the inner ring's animation every frame and write it
  // straight into the DOM, so React does not re-render 60 times a second.
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const ring = systemRef.current?.querySelector<HTMLElement>('.orbit__ring');
      const spin = ring?.getAnimations()[0];
      const duration = Number(spin?.effect?.getComputedTiming().duration) || 0;
      if (spin && duration && angleRef.current && rateRef.current) {
        const time = Number(spin.currentTime ?? 0);
        angleRef.current.textContent = `${(((time % duration) / duration) * 360).toFixed(0).padStart(3, ' ')}°`;
        rateRef.current.textContent = `${spin.playbackRate.toFixed(2)}×`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const state = reduced
    ? 'reduced motion (still)'
    : paused
      ? 'paused'
      : speed === 0
        ? 'stopped (speed 0)'
        : pauseOnHover && hovering
          ? 'paused on hover'
          : `orbiting ${direction}`;

  const stage = (
    <div
      className="fe-stage orbit-stage"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      <OrbitSystem
        ref={systemRef}
        className="orbit-demo"
        orbits={TECH_ORBITS}
        center={<span className="orbit-demo__mark mono">&lt;/&gt;</span>}
        label="The front-end stack as planets orbiting a sun: Components, React, Hooks, TypeScript, CSS and Motion."
        speed={speed}
        direction={direction}
        tilt={read.number(settings, 'tilt')}
        uprightLabels={read.boolean(settings, 'uprightLabels')}
        showPaths={read.boolean(settings, 'showPaths')}
        pauseOnHover={pauseOnHover}
        paused={paused}
      />
    </div>
  );

  const panel = (
    <ControlsPanel manifest={manifest} settings={settings} onChange={onChange} label="Orbit controls">
      {reduced && <div className="fe-notice">Your system asks for reduced motion, so the orbits stay still.</div>}
      <div className="fe-readout">
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
    </ControlsPanel>
  );

  return <Playground stage={stage} panel={panel} />;
}
