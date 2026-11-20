import { useState } from 'react';
import { ControlsPanel } from '../../playground/ControlsPanel';
import { read, type ControlsManifest, type Settings } from '../../playground/manifest';
import { Playground } from '../../pages/pattern/blocks';
import { Combobox } from './Combobox';
import type { MatchMode } from './Combobox';
import './stage.css';

interface Destination {
  name: string;
  kind: 'Planet' | 'Moon' | 'Dwarf planet' | 'Star';
}

/** Real bodies in and near the solar system. */
export const DESTINATIONS: Destination[] = [
  { name: 'Mercury', kind: 'Planet' },
  { name: 'Venus', kind: 'Planet' },
  { name: 'Earth', kind: 'Planet' },
  { name: 'Mars', kind: 'Planet' },
  { name: 'Jupiter', kind: 'Planet' },
  { name: 'Saturn', kind: 'Planet' },
  { name: 'Uranus', kind: 'Planet' },
  { name: 'Neptune', kind: 'Planet' },
  { name: 'Pluto', kind: 'Dwarf planet' },
  { name: 'Ceres', kind: 'Dwarf planet' },
  { name: 'Eris', kind: 'Dwarf planet' },
  { name: 'Haumea', kind: 'Dwarf planet' },
  { name: 'Makemake', kind: 'Dwarf planet' },
  { name: 'Moon', kind: 'Moon' },
  { name: 'Phobos', kind: 'Moon' },
  { name: 'Deimos', kind: 'Moon' },
  { name: 'Io', kind: 'Moon' },
  { name: 'Europa', kind: 'Moon' },
  { name: 'Ganymede', kind: 'Moon' },
  { name: 'Callisto', kind: 'Moon' },
  { name: 'Titan', kind: 'Moon' },
  { name: 'Enceladus', kind: 'Moon' },
  { name: 'Mimas', kind: 'Moon' },
  { name: 'Miranda', kind: 'Moon' },
  { name: 'Triton', kind: 'Moon' },
  { name: 'Charon', kind: 'Moon' },
  { name: 'Sun', kind: 'Star' },
  { name: 'Proxima Centauri', kind: 'Star' },
  { name: 'Alpha Centauri A', kind: 'Star' },
  { name: 'Sirius', kind: 'Star' },
  { name: 'Betelgeuse', kind: 'Star' },
  { name: 'Polaris', kind: 'Star' },
];

const getLabel = (d: Destination) => d.name;
const getKeywords = (d: Destination) => [d.kind];

interface ComboboxPlaygroundProps {
  manifest: ControlsManifest;
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function ComboboxPlayground({ manifest, settings, onChange }: ComboboxPlaygroundProps) {
  const [picked, setPicked] = useState<Destination | null>(null);

  const stage = (
    <div className="fe-stage combobox-stage">
      <div className="combobox-stage__card">
        <Combobox
          label="Destination"
          items={DESTINATIONS}
          getLabel={getLabel}
          getKeywords={getKeywords}
          onSelect={setPicked}
          renderHint={(d) => d.kind}
          placeholder="Try “mo” or “europa”"
          matchMode={read.string(settings, 'matchMode') as MatchMode}
          maxResults={read.number(settings, 'maxResults')}
          autoHighlight={read.boolean(settings, 'autoHighlight')}
          highlightMatch={read.boolean(settings, 'highlightMatch')}
        />
        <p className="combobox-stage__picked">
          Course set for <b>{picked ? `${picked.name} (${picked.kind.toLowerCase()})` : 'nowhere yet'}</b>
        </p>
      </div>
    </div>
  );

  const panel = (
    <ControlsPanel manifest={manifest} settings={settings} onChange={onChange} label="Combobox controls">
      <div className="fe-readout">
        <div>
          items <b>{DESTINATIONS.length}</b>
        </div>
        <div>
          keys <b>↓ ↑ move · ↵ pick · esc close</b>
        </div>
        <div>
          picked <b>{picked?.name ?? '–'}</b>
        </div>
      </div>
    </ControlsPanel>
  );

  return <Playground stage={stage} panel={panel} />;
}
