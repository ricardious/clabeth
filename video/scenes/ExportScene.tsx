import { Check, Download, FileImage, FileText } from 'lucide-react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Backdrop } from '../components/Backdrop';
import { Eyebrow, Reveal } from '../components/Brand';
import { HandText, Paper } from '../components/Paper';
import { COLORS, FONTS } from '../constants';

export const ExportScene = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const vertical = width < 1400;
  const progress = interpolate(frame, [40, 108], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const done = spring({ frame: frame - 104, fps, config: { damping: 16, stiffness: 180 } });

  return (
    <Backdrop dark>
      <div style={{ position: 'absolute', left: vertical ? 64 : 108, top: vertical ? 76 : 74 }}>
        <Reveal><Eyebrow light>Llévatelo terminado</Eyebrow></Reveal>
        <Reveal delay={8}>
          <div style={{ marginTop: 16, color: COLORS.white, fontFamily: FONTS.display, fontSize: vertical ? 72 : 88, letterSpacing: -3.4 }}>
            Lo que ves<br />es lo que exportas.
          </div>
        </Reveal>
      </div>

      <div style={{ position: 'absolute', left: vertical ? 50 : 102, right: vertical ? 50 : 102, bottom: vertical ? 100 : 78, height: vertical ? 930 : 630, display: 'grid', gridTemplateColumns: vertical ? '1fr' : '1.1fr .9fr', gap: 48 }}>
        <div style={{ position: 'relative', minHeight: 0 }}>
          {[2, 1, 0].map((index) => {
            const enter = spring({ frame: frame - 12 - index * 7, fps, config: { damping: 18, stiffness: 130 } });
            return (
              <Paper key={index} style={{ position: 'absolute', width: vertical ? '64%' : '66%', height: vertical ? 640 : 560, left: `${14 + index * 9}%`, top: index * 13, borderRadius: 6, padding: '72px 48px', transform: `translateY(${interpolate(enter, [0, 1], [80, 0])}px) rotate(${(index - 1) * 2.6}deg)` }}>
                <HandText color={COLORS.primary} size={42}>Apuntes finales</HandText>
                <HandText size={31} style={{ marginTop: 38 }}>Una página lista para entregar.</HandText>
              </Paper>
            );
          })}
        </div>

        <div style={{ alignSelf: 'center', padding: vertical ? '36px 42px' : '38px', borderRadius: 18, background: '#302d29', border: '1px solid #514b45', boxShadow: '0 25px 70px rgba(0,0,0,.28)', fontFamily: FONTS.ui }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: COLORS.white, fontSize: 27, fontWeight: 600 }}><Download size={28} /> Exportar documento</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 30 }}>
            <FormatCard icon={<FileText />} label="PDF" active />
            <FormatCard icon={<FileImage />} label="PNG" />
          </div>
          <div style={{ marginTop: 29, color: '#c9c1b8', fontSize: 16 }}>Renderizando páginas…</div>
          <div style={{ marginTop: 10, height: 9, background: '#4c4742', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${progress * 100}%`, height: '100%', borderRadius: 999, background: COLORS.primary }} />
          </div>
          <div style={{ marginTop: 24, opacity: done, transform: `scale(${interpolate(done, [0, 1], [.8, 1])})`, display: 'flex', alignItems: 'center', gap: 10, color: '#8bd1a5', fontSize: 19 }}><Check size={22} /> Documento listo</div>
        </div>
      </div>
    </Backdrop>
  );
};

const FormatCard = ({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '20px 14px', borderRadius: 10, border: `1px solid ${active ? COLORS.primary : '#5b554e'}`, background: active ? '#47282a' : '#393530', color: active ? '#f8c2bd' : '#ded6cd', fontSize: 20, fontWeight: 600 }}>
    {icon}{label}
  </div>
);
