import { newTracker, TrackerConfiguration } from '@snowplow/browser-tracker';
import { SiteTrackingPlugin } from '@snowplow/browser-plugin-site-tracking';

const TESTING_TRACKER_URL =
  'https://0e5c7e3a-2c36-498f-b953-4a45bf92cbea.app.try-snowplow.com';

let TRACKER_URL: string;

console.log('process.env.NODE', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  TRACKER_URL = 'https://snowplow-collector.iluma.ai';
} else {
  TRACKER_URL = TESTING_TRACKER_URL;
}

/**
 * @description SnowPlow tracker configuration
 * @see {@link https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/browser-tracker-v3-reference/tracker-setup/initialization-options/}
 */
const configuration: TrackerConfiguration = {
  appId: 'nex-growth-book-demo',
  // plugins: [SiteTrackingPlugin()],
};

export const TRACKER_NAME = 'spNexGrowthBookDemo';
export const initialiseSnowplow = () => {
  console.log('tracking_url ==> ', TRACKER_URL);
  return newTracker(TRACKER_NAME, TRACKER_URL, configuration);
};
