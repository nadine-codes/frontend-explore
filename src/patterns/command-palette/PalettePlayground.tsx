import { useMemo, useState } from 'react';
import { ControlsPanel } from '../../playground/ControlsPanel';
import { read, type ControlsManifest, type Settings } from '../../playground/manifest';
import { Playground } from '../../pages/pattern/blocks';
import type { MatchMode } from '../combobox/Combobox';
import { CommandPalette, type Command } from './CommandPalette';
import './stage.css';

interface PalettePlaygroundProps {
  manifest: ControlsManifest;
  settings: Settings;
  onChange: (settings: Settings) => void;
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
const MOD = isMac ? '⌘' : 'Ctrl';

export function PalettePlayground({ manifest, settings, onChange }: PalettePlaygroundProps) {
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);
  const [trails, setTrails] = useState(true);
  const [probes, setProbes] = useState(0);
  const [log, setLog] = useState('');

  // Every command changes something you can see in the stage.
  const commands = useMemo<Command[]>(
    () => [
      { id: 'probe', label: 'Launch probe', group: 'Mission', run: () => setProbes((n) => n + 1) },
      { id: 'recall', label: 'Recall all probes', group: 'Mission', keywords: ['reset'], run: () => setProbes(0) },
      { id: 'theme', label: 'Toggle light cockpit', group: 'View', keywords: ['theme', 'dark', 'light'], run: () => setLight((v) => !v) },
      { id: 'trails', label: 'Toggle star trails', group: 'View', keywords: ['stars', 'motion'], run: () => setTrails((v) => !v) },
      { id: 'clear', label: 'Clear mission log', group: 'Log', keywords: ['reset', 'history'], run: () => setLog('') },
    ],
    [],
  );

  const stage = (
    <div className={`fe-stage palette-stage${light ? ' palette-stage--light' : ''}${trails ? ' palette-stage--trails' : ''}`}>
      <div className="palette-stage__app">
        <div className="palette-stage__bar">
          <span className="mono">Mission control</span>
          <button type="button" className="palette-stage__search" onClick={() => setOpen(true)}>
            Search commands <kbd>{MOD}</kbd>
            <kbd>K</kbd>
          </button>
        </div>
        <div className="palette-stage__body">
          <p className="palette-stage__count">
            <b>{probes}</b> probe{probes === 1 ? '' : 's'} in flight
          </p>
          <p className="palette-stage__hint mono">Press {MOD}+K, or use the button</p>
          <p className="palette-stage__log" role="status">
            {log}
          </p>
        </div>
      </div>
      <CommandPalette
        commands={commands}
        open={open}
        onOpenChange={setOpen}
        showGroups={read.boolean(settings, 'showGroups')}
        closeOnRun={read.boolean(settings, 'closeOnRun')}
        matchMode={read.string(settings, 'matchMode') as MatchMode}
        onRun={(command) => setLog(`Ran: ${command.label}`)}
      />
    </div>
  );

  const panel = (
    <ControlsPanel manifest={manifest} settings={settings} onChange={onChange} label="Command palette controls">
      <div className="fe-readout">
        <div>
          state <b>{open ? 'open' : 'closed'}</b>
        </div>
        <div>
          shortcut <b>{MOD}+K</b>
        </div>
        <div>
          last command <b>{log ? log.replace('Ran: ', '') : '–'}</b>
        </div>
      </div>
    </ControlsPanel>
  );

  return <Playground stage={stage} panel={panel} />;
}
