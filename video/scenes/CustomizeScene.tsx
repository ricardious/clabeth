import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Backdrop } from '../components/Backdrop';
import { Eyebrow, Reveal } from '../components/Brand';
import { HandText, Paper } from '../components/Paper';
import { COLORS, FONTS } from '../constants';

const inks = [COLORS.ink, COLORS.blueInk, COLORS.primary, '#6d2434', COLORS.greenInk, '#755335'];
const paperModes = ['lines', 'grid', 'dots'] as const;

export const CustomizeScene = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const vertical = width < 1400;
  const phase = Math.min(2, Math.floor(interpolate(frame, [30, 132], [0, 3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })));
  const headingColors = [COLORS.primary, COLORS.blueInk, '#6d2434'];
  const bodyColors = [COLORS.ink, COLORS.blueInk, COLORS.greenInk];

  return (
    <Backdrop>
      <div style={{ position: 'absolute', left: vertical ? 60 : 105, top: vertical ? 68 : 70 }}>
        <Reveal><Eyebrow>Haz que la hoja se sienta tuya</Eyebrow></Reveal>
        <Reveal delay={8}>
          <div style={{ marginTop: 15, fontFamily: FONTS.display, fontSize: vertical ? 68 : 82, fontWeight: 620, letterSpacing: -3.4 }}>
            Tu letra. Tu tinta. Tu papel.
          </div>
        </Reveal>
      </div>

      <div style={{ position: 'absolute', left: vertical ? 52 : 100, right: vertical ? 52 : 100, top: vertical ? 240 : 210, bottom: vertical ? 100 : 75, display: 'grid', gridTemplateColumns: vertical ? '1fr' : '0.78fr 1.22fr', gap: vertical ? 34 : 55 }}>
        <div style={{ order: vertical ? 2 : 1, display: 'grid', alignContent: 'center', gap: 18 }}>
          <Control label="Fuente" value={['Reenie Beanie', 'Nothing You Could Do', 'Give You Glory'][phase]!} frame={frame} delay={22} />
          <Control label="Tinta del texto" frame={frame} delay={29}>
            <div style={{ display: 'flex', gap: 12 }}>
              {inks.map((color, index) => (
                <div key={color} style={{ width: 34, height: 34, borderRadius: 999, padding: 4, background: COLORS.paper, border: index === phase + 1 ? `3px solid ${COLORS.primary}` : `1px solid ${COLORS.outline}` }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: 999, background: color }} />
                </div>
              ))}
            </div>
          </Control>
          <Control label="Tinta de los títulos" frame={frame} delay={36}>
            <div style={{ display: 'flex', gap: 12 }}>
              {headingColors.map((color, index) => (
                <div key={color} style={{ width: 42, height: 24, borderRadius: 999, background: color, outline: index === phase ? `3px solid ${COLORS.primarySoft}` : 'none', outlineOffset: 3 }} />
              ))}
            </div>
          </Control>
          <Control label="Irregularidad" frame={frame} delay={43}>
            <div style={{ width: '100%', height: 7, borderRadius: 999, background: COLORS.outline }}>
              <div style={{ width: `${42 + phase * 22}%`, height: '100%', borderRadius: 999, background: COLORS.primary }} />
            </div>
          </Control>
        </div>

        <div style={{ order: vertical ? 1 : 2, display: 'grid', placeItems: 'center', minHeight: 0 }}>
          <Paper grid={paperModes[phase]} style={{ width: vertical ? '74%' : '72%', height: vertical ? 600 : '96%', minHeight: vertical ? 0 : 590, borderRadius: 7, padding: vertical ? '86px 55px' : '94px 68px' }}>
            <HandText color={headingColors[phase]} size={vertical ? 56 : 66}>Mi próxima gran idea</HandText>
            <HandText color={bodyColors[phase]} size={vertical ? 38 : 48} style={{ marginTop: 48 }}>
              No todas las notas suenan igual.
              <br /><br />Esta ya se siente mía.
            </HandText>
            <div style={{ position: 'absolute', left: 60, right: 60, bottom: 62, display: 'flex', justifyContent: 'space-between', color: COLORS.muted, fontFamily: FONTS.ui, fontSize: 16 }}>
              <span>{['Rayado', 'Cuadriculado', 'Punteado'][phase]}</span><span>1 / 1</span>
            </div>
          </Paper>
        </div>
      </div>
    </Backdrop>
  );
};

const Control = ({ label, value, children, frame, delay }: { label: string; value?: string; children?: React.ReactNode; frame: number; delay: number }) => {
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 180 } });
  return (
    <div style={{ opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [-38, 0])}px)`, padding: '18px 20px', borderRadius: 12, border: `1px solid ${COLORS.outline}`, background: COLORS.surface }}>
      <div style={{ marginBottom: 11, color: COLORS.muted, fontFamily: FONTS.ui, fontSize: 17, fontWeight: 600 }}>{label}</div>
      {value ? <div style={{ color: COLORS.ink, fontFamily: FONTS.hand, fontSize: 34 }}>{value}</div> : children}
    </div>
  );
};
