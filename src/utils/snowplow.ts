import { newTracker, TrackerConfiguration } from '@snowplow/browser-tracker';

const TESTING_TRACKER_URL =
  'https://c4ad0795-3fc7-4ebc-a0fa-fbb62c94fe6a.app.try-snowplow.com';

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
};

export const TRACKER_NAME = 'spNexGrowthBookDemo';
export const initialiseSnowplow = () => {
  // console.log('tracking_url ==> ', TRACKER_URL);
  return newTracker(TRACKER_NAME, TRACKER_URL, configuration);
};
