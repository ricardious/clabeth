import type { CSSProperties, ReactNode } from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../constants';

export const Brand = ({ compact = false, light = false }: { compact?: boolean; light?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: compact ? 12 : 18 }}>
    <Img
      src={staticFile('favicon.svg')}
      style={{ width: compact ? 44 : 62, height: compact ? 44 : 62, borderRadius: compact ? 10 : 14 }}
    />
    <div
      style={{
        color: light ? COLORS.white : COLORS.ink,
        fontFamily: FONTS.display,
        fontSize: compact ? 31 : 46,
        fontWeight: 650,
        letterSpacing: -1.8,
      }}
    >
      Clabeth<span style={{ color: COLORS.primary }}>.</span>
    </div>
  </div>
);

export const Reveal = ({
  children,
  delay = 0,
  y = 36,
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [y, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Eyebrow = ({ children, light = false }: { children: ReactNode; light?: boolean }) => (
  <div
    style={{
      color: light ? '#f4bbb5' : COLORS.primary,
      fontFamily: FONTS.ui,
      fontSize: 21,
      fontWeight: 600,
      letterSpacing: 2.8,
      textTransform: 'uppercase',
    }}
  >
    {children}
  </div>
);
