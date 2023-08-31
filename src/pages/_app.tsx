import type { AppProps } from 'next/app';
import '../styles/globals.css';

import { Inter } from 'next/font/google';
import { useEffect } from 'react';

import { growthbookClient } from '@/utils/growthbook-client';
import { initialiseSnowplow } from '@/utils/snowplow';
import { GrowthBookProvider } from '@growthbook/growthbook-react';

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  initialiseSnowplow();

  useEffect(() => {
    // Load features asynchronously when the app renders
    growthbookClient
      .loadFeatures({ autoRefresh: true })
      .then((res) => {
        console.log('loadingFeatures');
        return res;
      })
      .catch((err) => {
        console.log('error loading features');
        return err;
      });
  }, []);

  return (
    <GrowthBookProvider growthbook={growthbookClient}>
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
    </GrowthBookProvider>
  );
}
