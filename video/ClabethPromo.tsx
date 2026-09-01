import { TransitionSeries, springTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from './constants';
import { HookScene } from './scenes/HookScene';
import { EditorScene } from './scenes/EditorScene';
import { LatexScene } from './scenes/LatexScene';
import { CustomizeScene } from './scenes/CustomizeScene';
import { ExportScene } from './scenes/ExportScene';
import { OutroScene } from './scenes/OutroScene';
import { SCENE_FRAMES, TRANSITION_FRAMES } from './constants';
import type { PromoProps } from './types';

const timing = springTiming({
  durationInFrames: TRANSITION_FRAMES,
  config: { damping: 200 },
});

const CUTS = [123, 276, 414, 567, 705];

export const ClabethPromo = ({ headline, cta, productUrl }: PromoProps) => (
  <AbsoluteFill style={{ background: COLORS.background }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.hook} premountFor={30}>
        <HookScene headline={headline} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: 'from-left' })} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.editor} premountFor={30}>
        <EditorScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: 'from-bottom' })} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.latex} premountFor={30}>
        <LatexScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: 'from-right' })} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.customize} premountFor={30}>
        <CustomizeScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: 'from-left' })} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.export} premountFor={30}>
        <ExportScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: 'from-bottom-left' })} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.outro} premountFor={30}>
        <OutroScene cta={cta} productUrl={productUrl} />
      </TransitionSeries.Sequence>
    </TransitionSeries>

    {CUTS.map((cut, index) => (
      <Sequence key={cut} from={cut - 5} durationInFrames={22} premountFor={10}>
        <InkSweep reverse={index % 2 === 1} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

const InkSweep = ({ reverse }: { reverse: boolean }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const progress = interpolate(frame, [0, 11, 21], [-0.25, 0.5, 1.25], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, [0, 4, 15, 21], [0, 0.9, 0.9, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const x = reverse ? (1 - progress) * width : progress * width;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: -height * 0.2,
        width: 8,
        height: height * 1.4,
        opacity,
        background: COLORS.primary,
        boxShadow: `0 0 0 3px ${COLORS.paper}, 0 0 28px rgba(200,30,46,.3)`,
        transform: 'rotate(11deg)',
      }}
    />
  );
};
