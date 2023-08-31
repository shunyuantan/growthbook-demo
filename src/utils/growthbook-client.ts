import { GrowthBook } from '@growthbook/growthbook-react';
import { trackStructEvent } from '@snowplow/browser-tracker';
import { TRACKER_NAME } from './snowplow';

/**
 * @description GrowthBook configuration
 * SHOULD ONLY BE IMPORTED ONCE
 */
export const growthbookClient = new GrowthBook({
  apiHost: process.env.NEXT_PUBLIC_GB_API_HOST,
  clientKey: process.env.NEXT_PUBLIC_GB_CLIENT_KEY,
  enableDevMode: true,
  trackingCallback: (experiment, result) => {
    // TODO: Use your real analytics tracking system
    console.log('Viewed Experiment', {
      experimentId: experiment.key,
      variationId: result.variationId,
    });

    // need to check if the attribute is available upon snowplow event sent
    const extraAttributes = growthbookClient.getAttributes();
    console.log('extraAttributes => ', extraAttributes);

    trackStructEvent(
      {
        label: experiment.key, // nex_card_banner_v2
        property: result.key, // variant id
        category: extraAttributes.invoiceId,
        action: 'Viewed Experiment',
      },
      [TRACKER_NAME],
    );
  },
});
