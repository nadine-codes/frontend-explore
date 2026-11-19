import { useRef, useState } from 'react';
import { ControlsPanel } from '../../playground/ControlsPanel';
import { read, type ControlsManifest, type Settings } from '../../playground/manifest';
import { Playground } from '../../pages/pattern/blocks';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';
import { TiltCard, TiltLayer, type TiltFrame, type TiltPhase } from './TiltCard';
import './stage.css';

const PHASE_LABELS: Record<TiltPhase, string> = {
  idle: 'idle',
  tilting: 'tilting',
  settling: 'easing back',
  disabled: 'reduced motion (tilt off)',
};

interface TiltPlaygroundProps {
  manifest: ControlsManifest;
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function TiltPlayground({ manifest, settings, onChange }: TiltPlaygroundProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [allowMotion, setAllowMotion] = useState(false);
  const [hovering, setHovering] = useState(false);

  // The readout changes every frame, so it is written straight to the DOM
  // through refs instead of React state. No re-renders while animating.
  const phaseRef = useRef<HTMLElement>(null);
  const pointerRef = useRef<HTMLElement>(null);
  const rotateRef = useRef<HTMLElement>(null);

  const onFrame = (frame: TiltFrame) => {
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

  const depth = read.boolean(settings, 'depth');

  const stage = (
    <div className="fe-stage" onPointerEnter={() => setHovering(true)} onPointerLeave={() => setHovering(false)}>
      <p className="fe-stage__hint mono" style={{ opacity: hovering ? 0 : 1 }}>
        Hover the card · or drag a finger across it
      </p>
      <TiltCard
        className="mission-card"
        wrapperClassName="mission-card__wrap"
        maxTilt={read.number(settings, 'maxTilt')}
        perspective={read.number(settings, 'perspective')}
        smoothing={read.number(settings, 'smoothing')}
        lift={read.number(settings, 'lift')}
        glare={read.boolean(settings, 'glare')}
        invert={read.boolean(settings, 'invert')}
        respectReducedMotion={!allowMotion}
        captureTouch
        onFrame={onFrame}
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
        <TiltLayer depth={depth ? 60 : 0} className="float-chip float-chip--a">
          Typed props
        </TiltLayer>
        <TiltLayer depth={depth ? 40 : 0} className="float-chip float-chip--b">
          Custom hook
        </TiltLayer>
        <TiltLayer depth={depth ? 50 : 0} className="float-chip float-chip--c">
          CSS variables
        </TiltLayer>
      </TiltCard>
    </div>
  );

  const panel = (
    <ControlsPanel manifest={manifest} settings={settings} onChange={onChange} label="Tilt controls">
      {prefersReducedMotion && (
        <div className="fe-notice">
          Your system asks for reduced motion, so the tilt is off.
          <label>
            <input type="checkbox" checked={allowMotion} onChange={(e) => setAllowMotion(e.target.checked)} />
            Turn it on anyway
          </label>
        </div>
      )}
      <div className="fe-readout" aria-live="off">
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
    </ControlsPanel>
  );

  return <Playground stage={stage} panel={panel} />;
}
