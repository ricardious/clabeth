import type { ReactNode } from 'react';
import { COLORS, FONTS } from '../constants';
import { Brand } from './Brand';

export const AppWindow = ({ children, dark = false }: { children: ReactNode; dark?: boolean }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      borderRadius: 24,
      background: dark ? '#292622' : COLORS.surface,
      border: `1px solid ${dark ? '#4f4942' : COLORS.outline}`,
      boxShadow: '0 35px 100px rgba(45,31,20,.26)',
      fontFamily: FONTS.ui,
    }}
  >
    <div
      style={{
        height: 70,
        display: 'flex',
        alignItems: 'center',
        padding: '0 22px',
        borderBottom: `1px solid ${dark ? '#4f4942' : COLORS.outline}`,
        background: dark ? '#332f2b' : COLORS.surface,
      }}
    >
      <Brand compact light={dark} />
      <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
        {['#d9d1c5', '#c81e2e', '#e9a06f'].map((color) => (
          <div key={color} style={{ width: 12, height: 12, borderRadius: 999, background: color }} />
        ))}
      </div>
    </div>
    <div style={{ height: 'calc(100% - 70px)' }}>{children}</div>
  </div>
);

export const Toolbar = () => (
  <div
    style={{
      height: 52,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '0 18px',
      borderBottom: `1px solid ${COLORS.outline}`,
      color: COLORS.muted,
      fontFamily: FONTS.ui,
      fontSize: 16,
    }}
  >
    {['H₁', 'H₂', 'B', 'I', '≡', '☑', '∑', '↗'].map((item, index) => (
      <div
        key={`${item}-${index}`}
        style={{
          minWidth: 29,
          height: 29,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 6,
          background: index === 6 ? COLORS.primarySoft : 'transparent',
          color: index === 6 ? COLORS.primary : COLORS.muted,
          fontWeight: index === 2 ? 700 : 500,
        }}
      >
        {item}
      </div>
    ))}
  </div>
);
