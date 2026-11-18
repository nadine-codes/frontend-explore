import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useTilt, type TiltOptions } from './useTilt';
import './TiltCard.css';

export interface TiltCardProps extends TiltOptions, HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** CSS perspective on the wrapper, in px. Smaller = more dramatic. Default 900. */
  perspective?: number;
  /** Soft light that follows the pointer. Default true. */
  glare?: boolean;
  /** Stay flat when the visitor prefers reduced motion. Default true. */
  respectReducedMotion?: boolean;
  /** Block scrolling while a finger drags across the card, so touch can tilt it. Default false. */
  captureTouch?: boolean;
  /** Class for the outer perspective wrapper. `className` goes on the card itself. */
  wrapperClassName?: string;
}

export function TiltCard({
  children,
  perspective = 900,
  glare = true,
  respectReducedMotion = true,
  captureTouch = false,
  wrapperClassName,
  className,
  style,
  maxTilt,
  smoothing,
  lift,
  invert,
  disabled = false,
  onFrame,
  ...rest
}: TiltCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useTilt<HTMLDivElement>({
    maxTilt,
    smoothing,
    lift,
    invert,
    onFrame,
    disabled: disabled || (respectReducedMotion && prefersReducedMotion),
  });

  return (
    <div
      className={join('tilt', wrapperClassName)}
      style={{ '--tilt-perspective': `${perspective}px` } as CSSProperties}
    >
      <div
        ref={ref}
        className={join('tilt__card', className)}
        style={{ touchAction: captureTouch ? 'none' : undefined, ...style }}
        {...rest}
      >
        {children}
        {glare && <span className="tilt__glare" aria-hidden="true" />}
      </div>
    </div>
  );
}

export interface TiltLayerProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** How far the layer floats above the card, in px. 0 = flat on the card. */
  depth?: number;
}

/** A child that floats above the card, so it shifts more than the card as it tilts. */
export function TiltLayer({ depth = 40, className, style, children, ...rest }: TiltLayerProps) {
  return (
    <span
      className={join('tilt__layer', className)}
      style={{ '--tilt-depth': `${depth}px`, ...style } as CSSProperties}
      {...rest}
    >
      {children}
    </span>
  );
}

function join(...names: Array<string | undefined>) {
  return names.filter(Boolean).join(' ');
}
