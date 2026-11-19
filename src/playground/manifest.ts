/**
 * Controls manifest: registry/controls/<slug>.json.
 * One file lists a pattern's presets and controls. The playground panel is
 * built from it, so the same file can drive any later surface (the helper, a selection file).
 */

export type ControlValue = number | boolean | string;
export type Settings = Record<string, ControlValue>;

interface BaseControl {
  id: string;
  label: string;
}

export interface RangeControl extends BaseControl {
  type: 'range';
  default: number;
  min: number;
  max: number;
  step: number;
  /** deg shows 10°, px shows 900px, scale shows ×1.020, multiplier shows 1.00×. */
  unit?: 'deg' | 'px' | 'scale' | 'multiplier';
  decimals?: number;
}

export interface ToggleControl extends BaseControl {
  type: 'toggle';
  default: boolean;
  /** checkbox (default) or a full-width button whose text flips. */
  display?: 'checkbox' | 'button';
  /** Button text while the value is true. */
  onLabel?: string;
  /** Button text while the value is false. */
  offLabel?: string;
}

export interface ChoiceControl extends BaseControl {
  type: 'choice';
  default: string;
  options: Array<{ value: string; label: string }>;
}

export type Control = RangeControl | ToggleControl | ChoiceControl;

export interface Preset {
  id: string;
  label: string;
  /** The settings this preset applies. It shows as active while they all match. */
  set: Settings;
}

export interface ControlsManifest {
  pattern: string;
  presets?: Preset[];
  controls: Control[];
}

export function defaultSettings(manifest: ControlsManifest): Settings {
  return Object.fromEntries(manifest.controls.map((control) => [control.id, control.default]));
}

export function formatRange(control: RangeControl, value: number): string {
  const text = control.decimals === undefined ? String(value) : value.toFixed(control.decimals);
  switch (control.unit) {
    case 'deg':
      return `${text}°`;
    case 'px':
      return `${text}px`;
    case 'scale':
      return `×${text}`;
    case 'multiplier':
      return `${text}×`;
    default:
      return text;
  }
}

export function activePreset(manifest: ControlsManifest, settings: Settings): Preset | undefined {
  return manifest.presets?.find((preset) => Object.entries(preset.set).every(([key, value]) => settings[key] === value));
}

/** Typed reads, so pattern stages do not cast by hand. */
export const read = {
  number: (settings: Settings, id: string): number => {
    const value = settings[id];
    if (typeof value !== 'number') throw new Error(`Setting "${id}" is not a number`);
    return value;
  },
  boolean: (settings: Settings, id: string): boolean => {
    const value = settings[id];
    if (typeof value !== 'boolean') throw new Error(`Setting "${id}" is not a boolean`);
    return value;
  },
  string: (settings: Settings, id: string): string => {
    const value = settings[id];
    if (typeof value !== 'string') throw new Error(`Setting "${id}" is not a string`);
    return value;
  },
};
