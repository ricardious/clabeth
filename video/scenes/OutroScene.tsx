import { ArrowRight } from 'lucide-react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Backdrop } from '../components/Backdrop';
import { Brand, Reveal } from '../components/Brand';
import { HandText, Paper, RedRule } from '../components/Paper';
import { COLORS, FONTS } from '../constants';

export const OutroScene = ({ cta, productUrl }: { cta: string; productUrl: string }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const vertical = width < 1400;
  const line = interpolate(frame, [62, 104], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const button = spring({ frame: frame - 92, fps, config: { damping: 18, stiffness: 170 } });

  return (
    <Backdrop>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: vertical ? 66 : 90 }}>
        <Paper grid="lines" style={{ width: vertical ? '86%' : '72%', height: vertical ? '72%' : '78%', borderRadius: 10, padding: vertical ? '130px 78px' : '110px 120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <Reveal delay={5}><Brand /></Reveal>
          <Reveal delay={20}>
            <HandText color={COLORS.primary} size={vertical ? 86 : 102} style={{ marginTop: 58 }}>Escribe limpio.</HandText>
          </Reveal>
          <Reveal delay={34}>
            <HandText size={vertical ? 62 : 72}>Que parezca hecho a mano.</HandText>
          </Reveal>
          <div style={{ width: vertical ? '72%' : '58%', marginTop: 42 }}><RedRule progress={line} /></div>
          <div style={{ opacity: button, transform: `translateY(${interpolate(button, [0, 1], [30, 0])}px) scale(${interpolate(button, [0, 1], [.88, 1])})`, marginTop: 50, display: 'flex', alignItems: 'center', gap: 14, borderRadius: 10, padding: '18px 30px', color: COLORS.white, background: COLORS.primary, boxShadow: '0 12px 28px rgba(200,30,46,.25)', fontFamily: FONTS.ui, fontSize: 23, fontWeight: 600 }}>
            {cta}<ArrowRight size={24} />
          </div>
          <div style={{ marginTop: 24, color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 16 }}>{productUrl} · Sin cuentas · Guardado local</div>
        </Paper>
      </div>
    </Backdrop>
  );
};
