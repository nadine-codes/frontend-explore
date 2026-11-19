import type { Orbit } from './OrbitSystem';

/** The front-end stack, as a solar system. Used on the home page and in pattern 02. */
export const TECH_ORBITS: Orbit[] = [
  { size: 44, duration: 38, planets: [{ label: 'Components', color: '#5ee0f5', angle: 20 }] },
  {
    size: 70,
    duration: 60,
    planets: [
      { label: 'React', color: '#61dafb', angle: 200 },
      { label: 'Hooks', color: '#ff8ad8', angle: 60 },
    ],
  },
  {
    size: 96,
    duration: 90,
    planets: [
      { label: 'TypeScript', color: '#4f8cff', angle: 300 },
      { label: 'CSS', color: '#b9a8ff', angle: 130 },
      { label: 'Motion', color: '#ffc46b', angle: 220 },
    ],
  },
];
