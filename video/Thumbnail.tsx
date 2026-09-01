import { AbsoluteFill } from 'remotion';
import { Backdrop } from './components/Backdrop';
import { Brand } from './components/Brand';
import { HandText, Paper } from './components/Paper';
import { COLORS, FONTS } from './constants';

export const Thumbnail = () => (
  <AbsoluteFill>
    <Backdrop>
      <div style={{ position: 'absolute', left: 90, top: 68 }}><Brand /></div>
      <div style={{ position: 'absolute', left: 98, top: 220, width: 700 }}>
        <div style={{ color: COLORS.primary, fontFamily: FONTS.ui, fontSize: 25, fontWeight: 650, letterSpacing: 2.5 }}>MARKDOWN → PAPEL</div>
        <div style={{ marginTop: 25, color: COLORS.ink, fontFamily: FONTS.display, fontSize: 92, lineHeight: .96, letterSpacing: -4.5 }}>Escribe limpio.<br />Que parezca<br />hecho a mano.</div>
      </div>
      <Paper style={{ position: 'absolute', right: 110, top: 92, width: 730, height: 850, borderRadius: 8, padding: '120px 80px', transform: 'rotate(3deg)', opacity: 1 }}>
        <HandText color={COLORS.primary} size={76}>Mi próxima gran idea</HandText>
        <HandText size={54} style={{ marginTop: 62 }}>empieza con texto plano,<br /><br />pero termina en papel.</HandText>
      </Paper>
    </Backdrop>
  </AbsoluteFill>
);
