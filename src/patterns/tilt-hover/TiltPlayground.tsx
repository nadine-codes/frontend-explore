import { useRef, useState } from 'react';
import { TiltCard, TiltLayer, type TiltFrame, type TiltPhase } from '../../components/TiltCard';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export interface TiltSettings {
  maxTilt: number;
  perspective: number;
  smoothing: number;
  lift: number;
  glare: boolean;
  depth: boolean;
  invert: boolean;
}

export const DEFAULT_SETTINGS: TiltSettings = {
  maxTilt: 10,
  perspective: 900,
  smoothing: 0.14,
  lift: 1.02,
  glare: true,
  depth: true,
  invert: false,
};

type PresetName = 'tilt' | 'glare' | 'depth' | 'all';

const PRESETS: Record<PresetName, { label: string; glare: boolean; depth: boolean }> = {
  tilt: { label: 'Tilt only', glare: false, depth: false },
  glare: { label: '+ Glare', glare: true, depth: false },
  depth: { label: '+ Depth', glare: false, depth: true },
  all: { label: 'Everything', glare: true, depth: true },
};

interface Slider {
  key: 'maxTilt' | 'perspective' | 'smoothing' | 'lift';
  label: string;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
}

const SLIDERS: Slider[] = [
  { key: 'maxTilt', label: 'Max tilt', min: 0, max: 25, step: 1, format: (v) => `${v}°` },
  { key: 'perspective', label: 'Perspective', min: 300, max: 2000, step: 50, format: (v) => `${v}px` },
  { key: 'smoothing', label: 'Smoothing (follow speed)', min: 0.04, max: 1, step: 0.02, format: (v) => v.toFixed(2) },
  { key: 'lift', label: 'Lift on hover', min: 1, max: 1.08, step: 0.005, format: (v) => `×${v.toFixed(3)}` },
];

const PHASE_LABELS: Record<TiltPhase, string> = {
  idle: 'idle',
  tilting: 'tilting',
  settling: 'easing back',
  disabled: 'reduced motion (tilt off)',
};

interface TiltPlaygroundProps {
  settings: TiltSettings;
  onChange: (settings: TiltSettings) => void;
}

export function TiltPlayground({ settings, onChange }: TiltPlaygroundProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [allowMotion, setAllowMotion] = useState(false);
  const [hovering, setHovering] = useState(false);

  // The readout changes every frame, so it's written straight to the DOM
  // through refs instead of React state. No re-renders while animating.
  const phaseRef = useRef<HTMLElement>(null);
  const pointerRef = useRef<HTMLElement>(null);
  const rotateRef = useRef<HTMLElement>(null);

  const handleFrame = (frame: TiltFrame) => {
    if (phaseRef.current) phaseRef.current.textContent = PHASE_LABELS[frame.phase];
    if (pointerRef.current) {
      pointerRef.current.textContent = frame.pointer
        ? `${Math.round(frame.pointer.x * 100)}%, ${Math.round(frame.pointer.y * 100)}%`
        : '–';
    }
    if (rotateRef.current) {
      rotateRef.current.textContent = `${frame.rotateX.toFixed(1)}° · ${frame.rotateY.toFixed(1)}°`;
    }
  };

  const update = <K extends keyof TiltSettings>(key: K, value: TiltSettings[K]) =>
    onChange({ ...settings, [key]: value });

  const activePreset = (Object.keys(PRESETS) as PresetName[]).find(
    (name) => PRESETS[name].glare === settings.glare && PRESETS[name].depth === settings.depth,
  );

  return (
    <div className="playground">
      <div
        className="stage"
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
      >
        <p className="stage__hint mono" style={{ opacity: hovering ? 0 : 1 }}>
          Hover the card · or drag a finger across it
        </p>
        <TiltCard
          className="mission-card"
          wrapperClassName="mission-card__wrap"
          maxTilt={settings.maxTilt}
          perspective={settings.perspective}
          smoothing={settings.smoothing}
          lift={settings.lift}
          glare={settings.glare}
          invert={settings.invert}
          respectReducedMotion={!allowMotion}
          captureTouch
          onFrame={handleFrame}
        >
          <div className="mission-card__head mono">
            <span>Mission FE-01 · T-minus 00:09</span>
            <span className="status-pill">
              <i aria-hidden="true" />
              Go for launch
            </span>
          </div>
          <dl className="mission-card__rows">
            <div>
              <dt>Vehicle</dt>
              <dd>React 19 component</dd>
            </div>
            <div>
              <dt>Payload</dt>
              <dd className="mono">&lt;TiltCard /&gt;</dd>
            </div>
            <div>
              <dt>Guidance</dt>
              <dd className="mono">useTilt()</dd>
            </div>
            <div>
              <dt>Type check</dt>
              <dd>TiltCardProps ✓</dd>
            </div>
            <div>
              <dt>Frame budget</dt>
              <dd>60fps, zero re-renders</dd>
            </div>
          </dl>
          <TiltLayer depth={settings.depth ? 60 : 0} className="float-chip float-chip--a">
            Typed props
          </TiltLayer>
          <TiltLayer depth={settings.depth ? 40 : 0} className="float-chip float-chip--b">
            Custom hook
          </TiltLayer>
          <TiltLayer depth={settings.depth ? 50 : 0} className="float-chip float-chip--c">
            CSS variables
          </TiltLayer>
        </TiltCard>
      </div>

      <aside className="controls" aria-label="Tilt controls">
        <h2 className="controls__title mono">Presets</h2>
        <div className="presets">
          {(Object.keys(PRESETS) as PresetName[]).map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={activePreset === name}
              onClick={() => onChange({ ...settings, glare: PRESETS[name].glare, depth: PRESETS[name].depth })}
            >
              {PRESETS[name].label}
            </button>
          ))}
        </div>

        <h2 className="controls__title mono">Tune it</h2>
        {SLIDERS.map((slider) => (
          <label key={slider.key} className="slider">
            <span className="slider__top">
              {slider.label}
              <output>{slider.format(settings[slider.key])}</output>
            </span>
            <input
              type="range"
              min={slider.min}
              max={slider.max}
              step={slider.step}
              value={settings[slider.key]}
              onChange={(event) => update(slider.key, Number(event.target.value))}
            />
          </label>
        ))}

        <div className="checks">
          <label>
            <input type="checkbox" checked={settings.glare} onChange={(e) => update('glare', e.target.checked)} />
            Glare (light follows the pointer)
          </label>
          <label>
            <input type="checkbox" checked={settings.depth} onChange={(e) => update('depth', e.target.checked)} />
            Depth (chips float above the card)
          </label>
          <label>
            <input type="checkbox" checked={settings.invert} onChange={(e) => update('invert', e.target.checked)} />
            Invert (tilt away from the pointer)
          </label>
        </div>

        {prefersReducedMotion && (
          <div className="notice">
            Your system asks for reduced motion, so the tilt is off.
            <label>
              <input type="checkbox" checked={allowMotion} onChange={(e) => setAllowMotion(e.target.checked)} />
              Turn it on anyway
            </label>
          </div>
        )}

        <div className="readout mono" aria-live="off">
          <div>
            state <b ref={phaseRef}>idle</b>
          </div>
          <div>
            pointer <b ref={pointerRef}>–</b>
          </div>
          <div>
            rotateX · rotateY <b ref={rotateRef}>0.0° · 0.0°</b>
          </div>
        </div>
      </aside>
    </div>
  );
}
