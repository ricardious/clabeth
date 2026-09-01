import type { CSSProperties, ReactNode } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../constants';

export const Paper = ({
  children,
  style,
  grid = 'lines',
  enterAt = 0,
}: {
  children: ReactNode;
  style?: CSSProperties;
  grid?: 'lines' | 'grid' | 'dots' | 'plain';
  enterAt?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame: frame - enterAt, fps, config: { damping: 18, stiffness: 120 } });
  const patterns = {
    lines: `repeating-linear-gradient(to bottom, transparent 0 47px, rgba(91,109,122,.16) 47px 49px)`,
    grid: `linear-gradient(rgba(91,109,122,.13) 1px, transparent 1px), linear-gradient(90deg, rgba(91,109,122,.13) 1px, transparent 1px)`,
    dots: `radial-gradient(circle, rgba(91,109,122,.27) 1.2px, transparent 1.3px)`,
    plain: 'none',
  } as const;
  const sizes = { lines: '100% 49px', grid: '30px 30px', dots: '24px 24px', plain: 'auto' } as const;

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: COLORS.paper,
        backgroundImage: patterns[grid],
        backgroundSize: sizes[grid],
        border: `1px solid ${COLORS.outline}`,
        boxShadow: '0 28px 70px rgba(64,42,25,.22), 0 4px 10px rgba(64,42,25,.09)',
        transform: `translateY(${interpolate(entrance, [0, 1], [80, 0])}px) rotate(${interpolate(entrance, [0, 1], [-3.5, 0])}deg) scale(${interpolate(entrance, [0, 1], [.92, 1])})`,
        opacity: entrance,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.24,
          backgroundImage:
            'radial-gradient(circle at 18% 32%, rgba(102,72,43,.13) 0 1px, transparent 1.4px), radial-gradient(circle at 77% 68%, rgba(255,255,255,.7) 0 1px, transparent 1.6px)',
          backgroundSize: '17px 19px, 23px 29px',
          pointerEvents: 'none',
        }}
      />
      {children}
    </div>
  );
};

export const HandText = ({
  children,
  color = COLORS.ink,
  size = 48,
  style,
}: {
  children: ReactNode;
  color?: string;
  size?: number;
  style?: CSSProperties;
}) => (
  <div style={{ color, fontFamily: FONTS.hand, fontSize: size, lineHeight: 1.08, ...style }}>
    {children}
  </div>
);

export const RedRule = ({ progress }: { progress: number }) => (
  <div
    style={{
      height: 5,
      width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
      background: COLORS.primary,
      borderRadius: 999,
      transform: 'rotate(-1deg)',
      transformOrigin: 'left center',
    }}
  />
);
