import { Composition, Folder, Still } from 'remotion';
import { ClabethPromo } from './ClabethPromo';
import { DURATION_IN_FRAMES, FPS } from './constants';
import { DEFAULT_PROMO_PROPS } from './types';
import { Thumbnail } from './Thumbnail';
import './fonts';

export const RemotionRoot = () => (
  <>
    <Folder name="Clabeth-Promo">
      <Composition
        id="ClabethPromo"
        component={ClabethPromo}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={DEFAULT_PROMO_PROPS}
      />
      <Composition
        id="ClabethPromoVertical"
        component={ClabethPromo}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={DEFAULT_PROMO_PROPS}
      />
      <Still id="ClabethPromoThumbnail" component={Thumbnail} width={1920} height={1080} />
    </Folder>
  </>
);
