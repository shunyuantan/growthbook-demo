import { newTracker, TrackerConfiguration } from '@snowplow/browser-tracker';

const TRACKER_URL = 'https://snowplow-collector.iluma.ai';

/**
 * @description SnowPlow tracker configuration
 * @see {@link https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/browser-tracker-v3-reference/tracker-setup/initialization-options/}
 */
const configuration: TrackerConfiguration = {
  appId: 'nex-growth-book-demo',
};

export const TRACKER_NAME = 'spNexGrowthBookDemo';
export const initialiseSnowplow = () => {
  return newTracker(TRACKER_NAME, TRACKER_URL, configuration);
};
