import { GrowthBook } from '@growthbook/growthbook-react';
import { trackStructEvent } from '@snowplow/browser-tracker';
import { TRACKER_NAME } from './snowplow';

export const growthbook = new GrowthBook({
  apiHost: process.env.NEXT_PUBLIC_GB_API_HOST,
  clientKey: process.env.NEXT_PUBLIC_GB_CLIENT_KEY,
  enableDevMode: true,
  trackingCallback: (experiment, result) => {
    // TODO: Use your real analytics tracking system
    console.log('Viewed Experiment', {
      experimentId: experiment.key,
      variationId: result.key,
    });
    trackStructEvent(
      {
        category: 'GrowthBook Demo',
        action: 'Viewed Experiment',
        label: 'Experiment Id',
        property: experiment.key,
      },
      [TRACKER_NAME],
    );
    trackStructEvent(
      {
        category: 'GrowthBook Demo',
        action: 'Viewed Experiment',
        label: 'Variation Id',
        property: result.key,
      },
      [TRACKER_NAME],
    );
  },
});
