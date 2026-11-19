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
import { OrbitPlayground } from './OrbitPlayground';
import orbitSystemSource from './OrbitSystem/OrbitSystem.tsx?raw';
import orbitSystemCss from './OrbitSystem/OrbitSystem.css?raw';

const SLUG = 'orbit-animation';

/** The usage example follows whatever the controls are set to. */
function usageCode(s: Settings): string {
  const speed = read.number(s, 'speed');
  const direction = read.string(s, 'direction');
  const tilt = read.number(s, 'tilt');
  const props = [
    'orbits={orbits}',
    'center={<Logo />}',
    speed !== 1 ? `speed={${speed}}` : null,
    direction !== 'clockwise' ? `direction="${direction}"` : null,
    tilt ? `tilt={${tilt}}` : null,
    read.boolean(s, 'uprightLabels') ? null : 'uprightLabels={false}',
    read.boolean(s, 'showPaths') ? null : 'showPaths={false}',
    read.boolean(s, 'pauseOnHover') ? 'pauseOnHover' : null,
    read.boolean(s, 'paused') ? 'paused' : null,
    'label="Our stack orbiting the product"',
  ].filter(Boolean);

  return `import { OrbitSystem, type Orbit } from './components/OrbitSystem';

const orbits: Orbit[] = [
  { size: 44, duration: 38, planets: [{ label: 'Components', color: '#5ee0f5', angle: 20 }] },
  {
    size: 70,
    duration: 60,
    planets: [
      { label: 'React', color: '#61dafb', angle: 200 },
      { label: 'Hooks', color: '#ff8ad8', angle: 60 },
    ],
  },
];

export function StackOrbit() {
  return (
    <OrbitSystem
      ${props.join('\n      ')}
    />
  );
}`;
}

const CONCEPTS = [
  {
    name: 'CSS @keyframes',
    body: 'One "orbit-spin" keyframe (0° → 360°) runs every ring. No JavaScript drives the motion frame by frame.',
  },
  {
    name: 'Counter-rotation',
    body: 'Each planet spins the opposite way at the same speed as its ring, so the two cancel out and the label stays upright.',
  },
  {
    name: 'Web Animations API',
    body: 'getAnimations() finds the running CSS animations; playbackRate changes their speed without restarting them.',
  },
  {
    name: 'Individual transforms',
    body: 'The spin uses the `rotate` property while `transform` holds the static angles, so the two never overwrite each other.',
  },
  {
    name: 'CSS trig functions',
    body: 'The tilt squashes the plane by cos(tilt), and each planet stretches back by 1 / cos(tilt), all in plain CSS.',
  },
  {
    name: 'Data-driven props',
    body: 'Orbits are a typed Orbit[] array. Add a planet by adding an object; the component renders the rest.',
  },
  {
    name: 'React 19 ref as a prop',
    body: 'OrbitSystem takes `ref` as an ordinary prop (no forwardRef), and useImperativeHandle exposes the root element.',
  },
  {
    name: 'Accessible decoration',
    body: 'With a label it is announced as one image; without one it is aria-hidden, so screen readers skip the moving parts.',
  },
];

export default function OrbitAnimationPage() {
  const pattern = findPattern(SLUG);
  const manifest = controlsFor(SLUG);
  const [settings, setSettings] = useState<Settings>(() => defaultSettings(manifest));
  if (!pattern) return null;

  return (
    <PatternArticle>
      <PatternHeader pattern={pattern}>
        Planets circle a center on spinning rings, each at its own speed, while their labels stay upright. It's the
        animation on this site's home page. Try the <b>No counter-spin</b> preset to see the trick that makes it work.
      </PatternHeader>

      <OrbitPlayground manifest={manifest} settings={settings} onChange={setSettings} />

      <Section
        title="Use it"
        intro={
          <>
            The playground above is the real component. The <b>Usage</b> tab updates as you change the controls; the
            other tabs are the actual source files.
          </>
        }
      >
        <CodeTabs
          files={[
            { name: 'Usage.tsx', code: usageCode(settings) },
            { name: 'OrbitSystem.tsx', code: orbitSystemSource },
            { name: 'OrbitSystem.css', code: orbitSystemCss },
          ]}
        />
      </Section>

      <Section title="How it's built">
        <Steps
          items={[
            {
              title: 'Rings',
              body: (
                <>
                  Each orbit is a circle, centered with <code>inset</code>, that spins with a CSS animation:{' '}
                  <code>rotate</code> from 0° to 360°, <code>linear</code>, <code>infinite</code>. Bigger rings get
                  longer durations, so the outer planets drift slower, like real orbits.
                </>
              ),
            },
            {
              title: 'Planets',
              body: (
                <>
                  Inside each ring, an "arm" is rotated to the planet's starting angle, and the planet sits at the top of
                  the arm. Because it's inside the ring, it travels around with it.
                </>
              ),
            },
            {
              title: 'Counter-rotation',
              body: (
                <>
                  Without help, the label would spin too and end up upside down. So each planet runs the same animation
                  in <code>reverse</code> with the same duration. The two rotations cancel and the label always reads
                  normally.
                </>
              ),
            },
            {
              title: 'Speed and direction',
              body: (
                <>
                  Changing <code>animation-duration</code> mid-flight makes planets jump. Instead the component finds the
                  running animations with <code>getAnimations()</code> and sets <code>playbackRate</code>. A negative
                  rate plays them backwards.
                </>
              ),
            },
            {
              title: 'Tilt',
              body: (
                <>
                  A real 3D <code>rotateX</code> slices the planets where they cross the orbit plane, so the tilt is
                  faked in 2D: the plane is squashed with <code>scaleY(cos(tilt))</code>, turning circles into ellipses,
                  and each planet and the sun are stretched back with <code>scaleY(1 / cos(tilt))</code> so they stay
                  round.
                </>
              ),
            },
            {
              title: 'Pausing',
              body: (
                <>
                  Every animation reads <code>animation-play-state: var(--orbit-play)</code>, so flipping one CSS
                  variable (on hover, or with <code>paused</code>) freezes the whole system at once.
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
                <b>Orbit animation</b> or <b>orbital animation</b>
              </>,
              <>
                <b>Solar system animation</b>, when there's a sun in the middle
              </>,
              <>
                <b>Orbiting icons</b> or an <b>integrations orbit</b>, when logos circle a product's logo
              </>,
              <>
                <b>Rotating rings</b> or <b>concentric orbits</b>
              </>,
              <>
                The upright-label trick is <b>counter-rotation</b>
              </>,
            ]}
          />
        </SubSection>
        <SubSection title="Interaction or motion?">
          <Bullets
            items={[
              <>
                On its own it's <b>ambient (decorative) motion</b>: it moves without you doing anything, so it isn't an
                interaction.
              </>,
              <>
                It becomes a <b>micro-interaction</b> once it responds to you: pause on hover, planets growing under the
                pointer, or a click that opens a planet.
              </>,
              'In a case study: "an ambient orbit animation in the hero that shows the stack as a system, with hover states on each planet."',
            ]}
          />
        </SubSection>
      </SectionPair>

      <Section title="Design notes">
        <Bullets
          items={[
            'Keep it slow. A lap of 40–90 seconds reads as calm; under 10 seconds feels like a loading spinner.',
            'Give outer rings longer durations than inner ones. It looks natural because real orbits work that way.',
            'Keep labels upright with counter-rotation. Rotating text is hard to read and looks broken.',
            'It runs forever, so it needs an off switch: respect reduced motion, and consider pause on hover so people can read the labels.',
            'Use it once, as a hero visual. Next to other moving things it competes for attention.',
          ]}
        />
      </Section>

      <Section title="Seen in the wild">
        <p>
          <b>This site's home page</b> uses this exact component to show the front-end stack. The pattern is common in
          SaaS hero sections, where integration logos orbit the product's logo to say "it connects to everything."
        </p>
      </Section>
    </PatternArticle>
  );
}
