import { setPolyfills } from '@growthbook/growthbook';

export function getServerSideGrowthBookContext() {
  // Set GrowthBook polyfills
  setPolyfills({
    fetch: globalThis.fetch || require('cross-fetch'),
    EventSource: globalThis.EventSource || require('eventsource'),
    SubtleCrypto:
      globalThis.crypto?.subtle || require('node:crypto')?.webcrypto?.subtle,
  });

  return {
    apiHost: process.env.NEXT_PUBLIC_GB_API_HOST,
    clientKey: process.env.NEXT_PUBLIC_GB_CLIENT_KEY,
  };
}
