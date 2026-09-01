import type { ReactNode } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../constants';

export const Backdrop = ({ children, dark = false }: { children: ReactNode; dark?: boolean }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const drift = interpolate(frame, [0, durationInFrames], [-30, 30]);
  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background: dark ? COLORS.dark : COLORS.background,
        color: dark ? COLORS.white : COLORS.ink,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -100,
          transform: `translateX(${drift}px)`,
          opacity: dark ? 0.08 : 0.25,
          backgroundImage:
            'radial-gradient(circle at 10% 30%, rgba(200,30,46,.12) 0 2px, transparent 2.5px), radial-gradient(circle at 80% 70%, rgba(80,60,40,.12) 0 1px, transparent 1.6px)',
          backgroundSize: '54px 68px, 37px 43px',
        }}
      />
      {children}
    </AbsoluteFill>
  );
};
