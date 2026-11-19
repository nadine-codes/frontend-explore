import { useId, type ReactNode } from 'react';
import {
  activePreset,
  formatRange,
  type ChoiceControl,
  type ControlsManifest,
  type RangeControl,
  type Settings,
  type ToggleControl,
} from './manifest';

interface ControlsPanelProps {
  manifest: ControlsManifest;
  settings: Settings;
  onChange: (settings: Settings) => void;
  /** Names the panel for screen readers, such as "Tilt controls". */
  label: string;
  /** Pattern-specific extras below the controls: notices, live readouts. */
  children?: ReactNode;
}

/** The controls panel, built entirely from a pattern's controls manifest. */
export function ControlsPanel({ manifest, settings, onChange, label, children }: ControlsPanelProps) {
  const baseId = useId();
  const set = (id: string, value: Settings[string]) => onChange({ ...settings, [id]: value });
  const current = activePreset(manifest, settings);

  const ranges = manifest.controls.filter((c): c is RangeControl => c.type === 'range');
  const choices = manifest.controls.filter((c): c is ChoiceControl => c.type === 'choice');
  const toggles = manifest.controls.filter((c): c is ToggleControl => c.type === 'toggle');
  const checkboxes = toggles.filter((c) => c.display !== 'button');
  const buttons = toggles.filter((c) => c.display === 'button');

  return (
    <aside className="fe-controls" aria-label={label}>
      {manifest.presets && manifest.presets.length > 0 && (
        <>
          <h2 className="fe-controls__title">Presets</h2>
          <div className="fe-presets" data-columns={manifest.presets.length % 3 === 0 ? 3 : 2}>
            {manifest.presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                aria-pressed={current?.id === preset.id}
                onClick={() => onChange({ ...settings, ...preset.set })}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </>
      )}

      {ranges.length > 0 && <h2 className="fe-controls__title">Tune it</h2>}
      {ranges.map((control) => {
        const value = settings[control.id] as number;
        const shown = formatRange(control, value);
        const inputId = `${baseId}-${control.id}`;
        // The input is named by the label text alone and reads its value with the unit.
        // The visible output is hidden from screen readers so it is not announced twice.
        return (
          <div key={control.id} className="fe-slider">
            <span className="fe-slider__top">
              <label htmlFor={inputId}>{control.label}</label>
              <output htmlFor={inputId} aria-hidden="true">
                {shown}
              </output>
            </span>
            <input
              id={inputId}
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={value}
              aria-valuetext={shown}
              onChange={(event) => set(control.id, Number(event.target.value))}
            />
          </div>
        );
      })}

      {choices.map((control) => (
        <div key={control.id} className="fe-segmented" role="group" aria-label={control.label}>
          {control.options.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={settings[control.id] === option.value}
              onClick={() => set(control.id, option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      ))}

      {checkboxes.length > 0 && (
        <div className="fe-checks">
          {checkboxes.map((control) => (
            <label key={control.id}>
              <input
                type="checkbox"
                checked={settings[control.id] === true}
                onChange={(event) => set(control.id, event.target.checked)}
              />
              {control.label}
            </label>
          ))}
        </div>
      )}

      {buttons.map((control) => {
        const on = settings[control.id] === true;
        return (
          <button key={control.id} type="button" className="fe-toggle-button" onClick={() => set(control.id, !on)}>
            {(on ? control.onLabel : control.offLabel) ?? control.label}
          </button>
        );
      })}

      {children}
    </aside>
  );
}
