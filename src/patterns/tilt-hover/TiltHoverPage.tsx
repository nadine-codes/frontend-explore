import { useState } from 'react';
import { Link } from 'react-router';
import { CodeBlock } from '../../components/CodeBlock';
import { DEFAULT_SETTINGS, TiltPlayground, type TiltSettings } from './TiltPlayground';
import tiltCardSource from '../../components/TiltCard/TiltCard.tsx?raw';
import useTiltSource from '../../components/TiltCard/useTilt.ts?raw';
import tiltCardCss from '../../components/TiltCard/TiltCard.css?raw';
import '../../styles/pattern.css';
import './tilt-hover.css';

/** The usage example follows whatever the sliders are set to. */
function usageCode(s: TiltSettings): string {
  const props = [
    `maxTilt={${s.maxTilt}}`,
    `perspective={${s.perspective}}`,
    `smoothing={${s.smoothing}}`,
    `lift={${s.lift}}`,
    s.glare ? 'glare' : 'glare={false}',
    s.invert ? 'invert' : null,
  ].filter(Boolean);
  const layer = s.depth
    ? `\n      <TiltLayer depth={60} className="chip">Typed props</TiltLayer>`
    : '';

  return `import { TiltCard, TiltLayer } from './components/TiltCard';

export function MissionCard() {
  return (
    <TiltCard
      ${props.join('\n      ')}
    >
      <h3>Mission FE-01</h3>
      <p>Go for launch</p>${layer}
    </TiltCard>
  );
}`;
}

const CONCEPTS = [
  {
    name: 'Custom hook',
    body: 'useTilt() holds all the pointer math and the animation loop, so any element can tilt with one line.',
  },
  {
    name: 'Typed props',
    body: 'TiltCardProps extends TiltOptions and the native div attributes, so editors autocomplete every option.',
  },
  {
    name: 'Refs over state',
    body: 'Values that change 60 times a second are written to the DOM through a ref. React never re-renders mid-animation.',
  },
  {
    name: 'requestAnimationFrame',
    body: 'The loop eases toward the target each frame and stops itself once the card is still.',
  },
  {
    name: 'CSS custom properties',
    body: 'JavaScript sets --tilt-rx and --tilt-ry; CSS owns the transform. Styling stays in the stylesheet.',
  },
  {
    name: 'useSyncExternalStore',
    body: 'usePrefersReducedMotion() subscribes to the OS setting and updates live if it changes.',
  },
  {
    name: 'Pointer events',
    body: 'One set of listeners covers mouse, pen and touch, with pointercancel for when the browser takes over.',
  },
  {
    name: 'Effect cleanup',
    body: 'Listeners and the animation frame are removed when the component unmounts, so nothing leaks.',
  },
];

export default function TiltHoverPage() {
  const [settings, setSettings] = useState<TiltSettings>(DEFAULT_SETTINGS);

  return (
    <article className="page pattern-page">
      <header className="page-header">
        <Link to="/explore" className="back-link mono">
          ← Star map
        </Link>
        <p className="kicker mono">Pattern 01 · Hover micro-interaction · motion</p>
        <h1>3D tilt hover</h1>
        <p className="lede">
          A card that follows your pointer. It rotates slightly in 3D toward wherever the pointer is, then eases back to
          flat when it leaves. Use the presets and sliders to see what each part adds.
        </p>
      </header>

      <TiltPlayground settings={settings} onChange={setSettings} />

      <section className="pattern-section">
        <h2>Use it</h2>
        <p>
          The playground above is the real component. The <b>Usage</b> tab updates as you move the sliders; the other tabs
          are the actual source files.
        </p>
        <CodeBlock
          files={[
            { name: 'Usage.tsx', code: usageCode(settings) },
            { name: 'TiltCard.tsx', code: tiltCardSource },
            { name: 'useTilt.ts', code: useTiltSource },
            { name: 'TiltCard.css', code: tiltCardCss },
          ]}
        />
      </section>

      <section className="pattern-section">
        <h2>How it's built</h2>
        <ol className="steps">
          <li>
            <b>Perspective wrapper.</b> <code>&lt;TiltCard&gt;</code> renders an outer div with CSS{' '}
            <code>perspective</code> (about 800–1200px), so rotations look 3D instead of flat squashing.
          </li>
          <li>
            <b>Pointer position.</b> On <code>pointermove</code>, <code>useTilt</code> works out where the pointer is on the
            card as a fraction from 0 to 1 on each axis.
          </li>
          <li>
            <b>Two rotations.</b> Horizontal position drives <code>rotateY</code>; vertical position drives{' '}
            <code>rotateX</code>, inverted so the edge under the pointer tips away. <code>maxTilt</code> caps both.
          </li>
          <li>
            <b>Smoothing.</b> Each animation frame, the current angle moves a fraction (<code>smoothing</code>) of the way
            to the target. That keeps it soft instead of jittery.
          </li>
          <li>
            <b>Ease back.</b> On <code>pointerleave</code>, the target returns to 0° and the loop runs until the card is
            flat, then stops.
          </li>
          <li>
            <b>Extras.</b> Glare is a radial gradient positioned under the pointer. <code>&lt;TiltLayer depth&gt;</code>{' '}
            children use <code>translateZ</code> inside <code>preserve-3d</code>, so they float above the card.
          </li>
        </ol>
      </section>

      <section className="pattern-section">
        <h2>Front-end concepts in this pattern</h2>
        <ul className="concepts" role="list">
          {CONCEPTS.map((concept) => (
            <li key={concept.name}>
              <h3 className="mono">{concept.name}</h3>
              <p>{concept.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="pattern-section two-col">
        <div>
          <h2>Also called</h2>
          <ul className="bullets">
            <li>
              <b>Tilt card</b> or <b>3D tilt hover effect</b>
            </li>
            <li>
              <b>Parallax tilt</b>, when layers move at different depths (see <code>react-parallax-tilt</code>)
            </li>
            <li>
              <b>Perspective hover</b>, after the CSS property behind it
            </li>
            <li>
              <b>Vanilla Tilt</b>, after the popular <code>vanilla-tilt.js</code> library
            </li>
            <li>
              <b>Holographic card</b>, when a glare sweeps across the surface
            </li>
          </ul>
        </div>
        <div>
          <h2>Design notes</h2>
          <ul className="bullets">
            <li>Keep the angle under about 12°. Bigger angles make text hard to read and feel gimmicky.</li>
            <li>Respect reduced motion: the card stays flat and keeps only the subtle lift.</li>
            <li>Touch has no hover. Tilt only while a finger drags (as here), or skip it on touch.</li>
            <li>Use it on one hero element, not every card. It stops standing out when everything moves.</li>
            <li>Animate only <code>transform</code> and opacity so it stays smooth.</li>
          </ul>
        </div>
      </section>

      <section className="pattern-section">
        <h2>Seen in the wild</h2>
        <p>
          <b>Coverage Agent</b> (coverage-agent-rosy.vercel.app): the hero "Case CA-2047" card sits inside a{' '}
          <code>heroCardTilt</code> wrapper whose 3D transform follows the mouse.
        </p>
      </section>
    </article>
  );
}
