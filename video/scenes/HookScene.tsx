import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Backdrop } from '../components/Backdrop';
import { Brand, Eyebrow, Reveal } from '../components/Brand';
import { HandText, Paper, RedRule } from '../components/Paper';
import { COLORS, FONTS } from '../constants';

const SOURCE = '# Mi próxima gran idea';

export const HookScene = ({ headline }: { headline: string }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const vertical = width < 1400;
  const typed = SOURCE.slice(0, Math.floor(interpolate(frame, [8, 54], [0, SOURCE.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })));
  const swap = spring({ frame: frame - 57, fps, config: { damping: 18, stiffness: 120 } });
  const rule = interpolate(frame, [83, 116], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <Backdrop>
      <div style={{ position: 'absolute', left: vertical ? 72 : 110, top: vertical ? 64 : 76 }}>
        <Brand compact={vertical} />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: vertical ? '1fr' : '0.9fr 1.1fr',
          alignItems: 'center',
          gap: vertical ? 38 : 90,
          padding: vertical ? '160px 72px 90px' : '150px 120px 90px',
        }}
      >
        <div style={{ alignSelf: vertical ? 'end' : 'center' }}>
          <Reveal delay={2}>
            <Eyebrow>Markdown entra</Eyebrow>
          </Reveal>
          <Reveal delay={10}>
            <div
              style={{
                marginTop: 22,
                fontFamily: FONTS.display,
                fontSize: vertical ? 72 : 92,
                lineHeight: 0.98,
                letterSpacing: -4.5,
                maxWidth: vertical ? 840 : 720,
              }}
            >
              {headline}
            </div>
          </Reveal>
          {!vertical && (
            <Reveal delay={28}>
              <div style={{ marginTop: 36, color: COLORS.muted, fontFamily: FONTS.ui, fontSize: 25 }}>
                Texto limpio. Resultado humano.
              </div>
            </Reveal>
          )}
        </div>

        <div style={{ position: 'relative', height: vertical ? 760 : 720, minWidth: 0 }}>
          <div
            style={{
              position: 'absolute',
              inset: vertical ? '40px 34px' : '42px 0 20px 35px',
              borderRadius: 24,
              background: COLORS.dark,
              boxShadow: '0 35px 80px rgba(45,31,20,.24)',
              opacity: 1 - swap,
              transform: `translateX(${interpolate(swap, [0, 1], [0, -80])}px) rotate(${interpolate(swap, [0, 1], [0, -3])}deg)`,
              padding: vertical ? '78px 50px' : '88px 62px',
              color: '#f4eee6',
              fontFamily: FONTS.mono,
              fontSize: vertical ? 34 : 38,
            }}
          >
            <span style={{ color: '#e9a06f' }}>#</span>{typed.slice(1)}
            <span style={{ color: COLORS.primary, opacity: frame % 20 < 12 ? 1 : 0 }}>▋</span>
          </div>

          <Paper
            enterAt={56}
            style={{
              position: 'absolute',
              inset: vertical ? '0 30px' : '0 20px 0 55px',
              borderRadius: 8,
              padding: vertical ? '120px 78px' : '126px 88px',
              opacity: swap,
            }}
          >
            <div style={{ position: 'absolute', left: 55, top: 0, bottom: 0, width: 3, background: '#c8666d55' }} />
            <HandText color={COLORS.primary} size={vertical ? 68 : 78}>Mi próxima gran idea</HandText>
            <HandText size={vertical ? 48 : 55} style={{ marginTop: 56 }}>
              empieza con texto plano,
              <br />
              pero termina en papel.
            </HandText>
            <div style={{ position: 'absolute', left: 84, right: 84, bottom: 88 }}>
              <RedRule progress={rule} />
            </div>
          </Paper>
        </div>
      </div>
    </Backdrop>
  );
};
