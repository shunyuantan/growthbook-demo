/* eslint-disable @typescript-eslint/no-use-before-define */
'use client';

import { useFeatureValue } from '@growthbook/growthbook-react';
import { growthbook } from '@/utils/growthbook';
import { useEffect, useState } from 'react';
import { initialiseSnowplow } from '@/utils/snowplow';
import { setUserId } from '@snowplow/browser-tracker';

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
  initialiseSnowplow();
  const [RANDOM_ID, setRandomId] = useState<number>(0);

  useEffect(() => {
    setRandomId(Math.floor(Math.random() * 10000));
  }, []);

  useEffect(() => {
    growthbook.setAttributes({
      id: RANDOM_ID,
    });
    setUserId(RANDOM_ID.toString());
  }, [RANDOM_ID]);

  const bannerControls: BannerControlProps | Record<string, never> =
    useFeatureValue('nex_card_banner_v2', {});

  return (
    <main className="mx-8 my-12">
      <h1 className="mb-4 text-xl"> Random ID: {RANDOM_ID}</h1>
      {Object.entries(bannerControls).length > 0 ? (
        <div className="space-y-4">
          {(bannerControls.placement_pre as BannerControlDetails).enabled ? (
            <BannerCard
              title="Placement Pre"
              {...(bannerControls.placement_pre as BannerControlDetails)}
            />
          ) : (
            <p>Placement Pre is not enabled</p>
          )}
          {(bannerControls.placement_post as BannerControlDetails).enabled ? (
            <BannerCard
              title="Placement Post"
              {...(bannerControls.placement_post as BannerControlDetails)}
            />
          ) : (
            <p>Placement Pre is not enabled</p>
          )}
          {(bannerControls.placement_email as BannerControlDetails).enabled ? (
            <BannerCard
              title="Placement Email"
              {...(bannerControls.placement_email as BannerControlDetails)}
            />
          ) : (
            <p>Placement Pre is not enabled</p>
          )}
        </div>
      ) : (
        <Spinner />
      )}
    </main>
  );
}

const BannerCard = (props: BannerControlDetails & { title: string }) => {
  const { banner_id, banner_url, redirection_url, title } = props;
  return (
    <div className="p-4 border border-gray-600 rounded-md">
      <h1 className="text-xl">{title}</h1>
      <div>
        <p>Properties</p>
        <pre className="whitespace-break-spaces">
          {JSON.stringify({ banner_id, banner_url, redirection_url }, null, 2)}
        </pre>
      </div>
      <div>
        <p>Items</p>
        <div className="w-40">
          <a href={redirection_url} target="_blank">
            <img id={banner_id} src={banner_url} alt="meme" />
          </a>
        </div>
      </div>
    </div>
  );
};

const Spinner = () => {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="w-8 h-8 mr-2 text-black animate-spin fill-yellow-400"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
