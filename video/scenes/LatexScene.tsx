import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Backdrop } from '../components/Backdrop';
import { Eyebrow, Reveal } from '../components/Brand';
import { Paper } from '../components/Paper';
import { COLORS, FONTS } from '../constants';

const snippets = ['x = (−b ± √(b²−4ac)) / 2a', 'E = mc²', '∫₀¹ x² dx', 'Σᵢ₌₁ⁿ i'];

export const LatexScene = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const vertical = width < 1400;
  const formulaIn = spring({ frame: frame - 26, fps, config: { damping: 15, stiffness: 150 } });
  const underline = interpolate(frame, [70, 112], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <Backdrop dark>
      <div style={{ position: 'absolute', left: vertical ? 66 : 110, top: vertical ? 78 : 82 }}>
        <Reveal><Eyebrow light>Markdown + LaTeX</Eyebrow></Reveal>
        <Reveal delay={8}>
          <div style={{ marginTop: 18, color: COLORS.white, fontFamily: FONTS.display, fontSize: vertical ? 72 : 88, letterSpacing: -3.4, lineHeight: 1 }}>
            Fórmulas precisas.<br />Sin romper el trazo.
          </div>
        </Reveal>
      </div>
      <div style={{ position: 'absolute', left: vertical ? 58 : 108, right: vertical ? 58 : 108, bottom: vertical ? 100 : 84, height: vertical ? 870 : 550, display: 'grid', gridTemplateColumns: vertical ? '1fr' : '1fr 1.2fr', gap: 34 }}>
        <div style={{ display: 'grid', gridTemplateColumns: vertical ? '1fr 1fr' : '1fr', gap: 16, alignContent: 'center' }}>
          {snippets.map((formula, index) => {
            const enter = spring({ frame: frame - 34 - index * 7, fps, config: { damping: 20, stiffness: 190 } });
            return (
              <div key={formula} style={{ opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [-45, 0])}px)`, border: '1px solid #514b45', background: '#2d2a27', borderRadius: 12, padding: vertical ? '22px 18px' : '18px 24px', color: index === 1 ? '#f4bbb5' : '#ece4da', fontFamily: FONTS.display, fontSize: vertical ? 25 : 27 }}>
                {formula}
              </div>
            );
          })}
        </div>
        <Paper grid="grid" enterAt={18} style={{ borderRadius: 8, padding: vertical ? '90px 55px' : '78px 66px', transformOrigin: 'center' }}>
          <div style={{ color: COLORS.primary, fontFamily: FONTS.hand, fontSize: vertical ? 58 : 64 }}>Una idea también puede tener fórmula:</div>
          <div style={{ marginTop: 70, opacity: formulaIn, transform: `scale(${interpolate(formulaIn, [0, 1], [.72, 1])})`, color: COLORS.blueInk, fontFamily: FONTS.display, fontSize: vertical ? 58 : 72, textAlign: 'center' }}>
            E = mc²
          </div>
          <div style={{ margin: '55px auto 0', width: '72%', height: 5, borderRadius: 999, background: COLORS.primary, transform: `scaleX(${underline})`, transformOrigin: 'left center' }} />
          <div style={{ marginTop: 44, color: COLORS.ink, fontFamily: FONTS.hand, fontSize: vertical ? 44 : 50, textAlign: 'center' }}>letras a mano, símbolos exactos.</div>
        </Paper>
      </div>
    </Backdrop>
  );
};
