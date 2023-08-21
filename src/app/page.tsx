'use client';

import { useFeatureValue } from '@growthbook/growthbook-react';
import { growthbook } from '@/utils/growthbook';
import { useEffect } from 'react';

type BannerControlDetails = {
  enabled: boolean;
  banner_id?: string;
  redirection_url?: string;
  banner_url?: string;
};
type BannerControlProps = {
  placement_pre: BannerControlDetails;
  placement_post: BannerControlDetails;
  placement_email: BannerControlDetails;
};

export default function Home() {
  // String/Number/JSON features with a fallback value

  useEffect(() => {
    growthbook.setAttributes({
      id: Math.random(),
    });
  }, []);

  const bannerControls: BannerControlProps | Record<string, never> =
    useFeatureValue('nex_card_banner_v2', {});

  return (
    <main>
      {Object.entries(bannerControls).length > 0 ? (
        <div>
          {(bannerControls.placement_pre as BannerControlDetails).enabled && (
            <div>Placement Pre</div>
          )}
          {(bannerControls.placement_post as BannerControlDetails).enabled && (
            <div>Placement Post</div>
          )}
          {(bannerControls.placement_email as BannerControlDetails).enabled && (
            <div>Placement Email</div>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
}
