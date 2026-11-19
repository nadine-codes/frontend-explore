import { useState } from 'react';
import { controlsFor, findPattern } from '../../lib/registry';
import { defaultSettings, read, type Settings } from '../../playground/manifest';
import { CodeTabs } from '../../playground/CodeTabs';
import {
  Bullets,
  ConceptGrid,
  PatternArticle,
  PatternHeader,
  Section,
  SectionPair,
  Steps,
  SubSection,
} from '../../pages/pattern/blocks';
import { TiltPlayground } from './TiltPlayground';
import tiltCardSource from './TiltCard/TiltCard.tsx?raw';
import useTiltSource from './TiltCard/useTilt.ts?raw';
import tiltCardCss from './TiltCard/TiltCard.css?raw';

const SLUG = '3d-tilt-hover';

/** The usage example follows whatever the controls are set to. */
function usageCode(s: Settings): string {
  const props = [
    `maxTilt={${read.number(s, 'maxTilt')}}`,
    `perspective={${read.number(s, 'perspective')}}`,
    `smoothing={${read.number(s, 'smoothing')}}`,
    `lift={${read.number(s, 'lift')}}`,
    read.boolean(s, 'glare') ? 'glare' : 'glare={false}',
    read.boolean(s, 'invert') ? 'invert' : null,
  ].filter(Boolean);
  const layer = read.boolean(s, 'depth')
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
  const pattern = findPattern(SLUG);
  const manifest = controlsFor(SLUG);
  const [settings, setSettings] = useState<Settings>(() => defaultSettings(manifest));
  if (!pattern) return null;

  return (
    <PatternArticle>
      <PatternHeader pattern={pattern}>
        A card that follows your pointer. It rotates slightly in 3D toward wherever the pointer is, then eases back to flat
        when it leaves. Use the presets and sliders to see what each part adds.
      </PatternHeader>

      <TiltPlayground manifest={manifest} settings={settings} onChange={setSettings} />

      <Section
        title="Use it"
        intro={
          <>
            The playground above is the real component. The <b>Usage</b> tab updates as you move the sliders; the other
            tabs are the actual source files.
          </>
        }
      >
        <CodeTabs
          files={[
            { name: 'Usage.tsx', code: usageCode(settings) },
            { name: 'TiltCard.tsx', code: tiltCardSource },
            { name: 'useTilt.ts', code: useTiltSource },
            { name: 'TiltCard.css', code: tiltCardCss },
          ]}
        />
      </Section>

      <Section title="How it's built">
        <Steps
          items={[
            {
              title: 'Perspective wrapper',
              body: (
                <>
                  <code>&lt;TiltCard&gt;</code> renders an outer div with CSS <code>perspective</code> (about 800–1200px),
                  so rotations look 3D instead of flat squashing.
                </>
              ),
            },
            {
              title: 'Pointer position',
              body: (
                <>
                  On <code>pointermove</code>, <code>useTilt</code> works out where the pointer is on the card as a
                  fraction from 0 to 1 on each axis.
                </>
              ),
            },
            {
              title: 'Two rotations',
              body: (
                <>
                  Horizontal position drives <code>rotateY</code>; vertical position drives <code>rotateX</code>,
                  inverted so the edge under the pointer tips away. <code>maxTilt</code> caps both.
                </>
              ),
            },
            {
              title: 'Smoothing',
              body: (
                <>
                  Each animation frame, the current angle moves a fraction (<code>smoothing</code>) of the way to the
                  target. That keeps it soft instead of jittery.
                </>
              ),
            },
            {
              title: 'Ease back',
              body: (
                <>
                  On <code>pointerleave</code>, the target returns to 0° and the loop runs until the card is flat, then
                  stops.
                </>
              ),
            },
            {
              title: 'Extras',
              body: (
                <>
                  Glare is a radial gradient positioned under the pointer. <code>&lt;TiltLayer depth&gt;</code> children
                  use <code>translateZ</code> inside <code>preserve-3d</code>, so they float above the card.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Front-end concepts in this pattern">
        <ConceptGrid items={CONCEPTS} />
      </Section>

      <SectionPair>
        <SubSection title="Also called">
          <Bullets
            items={[
              <>
                <b>Tilt card</b> or <b>3D tilt hover effect</b>
              </>,
              <>
                <b>Parallax tilt</b>, when layers move at different depths (see <code>react-parallax-tilt</code>)
              </>,
              <>
                <b>Perspective hover</b>, after the CSS property behind it
              </>,
              <>
                <b>Vanilla Tilt</b>, after the popular <code>vanilla-tilt.js</code> library
              </>,
              <>
                <b>Holographic card</b>, when a glare sweeps across the surface
              </>,
            ]}
          />
        </SubSection>
        <SubSection title="Design notes">
          <Bullets
            items={[
              'Keep the angle under about 12°. Bigger angles make text hard to read and feel gimmicky.',
              'Respect reduced motion: the card stays flat and keeps only the subtle lift.',
              'Touch has no hover. Tilt only while a finger drags (as here), or skip it on touch.',
              'Use it on one hero element, not every card. It stops standing out when everything moves.',
              <>
                Animate only <code>transform</code> and opacity so it stays smooth.
              </>,
            ]}
          />
        </SubSection>
      </SectionPair>

      <Section title="Seen in the wild">
        <p>
          <b>Coverage Agent</b> (coverage-agent-rosy.vercel.app): the hero "Case CA-2047" card sits inside a{' '}
          <code>heroCardTilt</code> wrapper whose 3D transform follows the mouse.
        </p>
      </Section>
    </PatternArticle>
  );
}
