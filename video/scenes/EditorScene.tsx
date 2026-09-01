import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { AppWindow, Toolbar } from '../components/AppWindow';
import { Backdrop } from '../components/Backdrop';
import { Eyebrow, Reveal } from '../components/Brand';
import { HandText, Paper } from '../components/Paper';
import { COLORS, FONTS } from '../constants';

const MARKDOWN = '# Mi próxima gran idea\n\nTodo empieza con una nota.\n\n- clara\n- personal\n- lista para compartir';

export const EditorScene = () => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();
  const vertical = width < 1400;
  const typed = MARKDOWN.slice(0, Math.floor(interpolate(frame, [12, 118], [0, MARKDOWN.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })));
  const zoom = spring({ frame: frame - 4, fps, config: { damping: 200 } });

  return (
    <Backdrop>
      <div style={{ position: 'absolute', top: vertical ? 70 : 62, left: vertical ? 62 : 104, zIndex: 2 }}>
        <Reveal><Eyebrow>Escribe sin pelear con el formato</Eyebrow></Reveal>
      </div>
      <div
        style={{
          position: 'absolute',
          left: vertical ? 40 : 92,
          right: vertical ? 40 : 92,
          top: vertical ? 150 : 126,
          bottom: vertical ? 86 : 74,
          transform: `scale(${interpolate(zoom, [0, 1], [.94, 1])})`,
          opacity: zoom,
        }}
      >
        <AppWindow>
          <Toolbar />
          <div style={{ display: 'grid', gridTemplateColumns: vertical ? '0.42fr 0.58fr' : '0.44fr 0.56fr', height: 'calc(100% - 52px)' }}>
            <div style={{ padding: vertical ? '35px 28px' : '48px 44px', borderRight: `1px solid ${COLORS.outline}`, background: '#fbf8f2' }}>
              <div style={{ color: COLORS.muted, fontFamily: FONTS.ui, fontSize: 16, marginBottom: 22 }}>documento.md</div>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: COLORS.ink, fontFamily: FONTS.mono, fontSize: vertical ? 22 : 25, lineHeight: 1.72 }}>
                {typed}
                <span style={{ color: COLORS.primary, opacity: frame % 18 < 11 ? 1 : 0 }}>▋</span>
              </pre>
            </div>
            <div style={{ display: 'grid', placeItems: 'center', background: COLORS.panel, padding: vertical ? 24 : 38 }}>
              <Paper style={{ width: vertical ? '88%' : '76%', height: '92%', borderRadius: 5, padding: vertical ? '82px 46px' : '94px 64px' }}>
                <div style={{ position: 'absolute', left: 42, top: 0, bottom: 0, width: 2, background: '#c8666d66' }} />
                <HandText color={COLORS.primary} size={vertical ? 50 : 62}>Mi próxima gran idea</HandText>
                <HandText size={vertical ? 35 : 43} style={{ marginTop: 35 }}>
                  Todo empieza con una nota.
                  <br /><br />• clara<br />• personal<br />• lista para compartir
                </HandText>
              </Paper>
            </div>
          </div>
        </AppWindow>
      </div>
    </Backdrop>
  );
};
