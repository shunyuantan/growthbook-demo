import { GrowthBook } from '@growthbook/growthbook-react';
import {
  trackSelfDescribingEvent,
  trackStructEvent,
} from '@snowplow/browser-tracker';
import { TRACKER_NAME } from './snowplow';
import { experimentStuffStore } from '@/hooks/experimentStuffStore';

/**
 * @description GrowthBook configuration
 * SHOULD ONLY BE IMPORTED ONCE
 */

const { setState } = experimentStuffStore;

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

    setState({ experimentId: experiment.key, variantId: result.key });
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
    // trackSelfDescribingEvent(
    //   {
    //     event: {
    //       schema: 'iglu:com.trysnowplow/object/jsonschema/1-0-0',
    //       data: {
    //         name: 'ExperimentViewed',
    //       },
    //     },
    //   },
    //   [TRACKER_NAME],
    // );
  },
});
