import type { AppProps } from 'next/app';
import { useIdsStore } from '@/hooks/useIdsStore';
import { BUSINESS_IDS, INVOICE_IDS } from '@/utils/constants';
import { growthbook } from '@/utils/growthbook-client';
import { GrowthBookProvider } from '@growthbook/growthbook-react';
import { useCallback, useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] });

const generateRandomNumber = () => {
  // const numberRange = 100;
  const numberRange = 40;
  return Math.floor(Math.random() * numberRange);
};

export default function App({ Component, pageProps }: AppProps) {
  const [RANDOMISING_INDEX, setRandomisingIndex] = useState<number>(0);
  const { INVOICE_ID, BUSINESS_ID, setBusinessId, setInvoiceId } =
    useIdsStore();

  useEffect(() => {
    setRandomisingIndex(generateRandomNumber);
  }, []);

  const updateIds = useCallback(() => {
    setBusinessId(BUSINESS_IDS[RANDOMISING_INDEX]);
    setInvoiceId(INVOICE_IDS[RANDOMISING_INDEX]);
  }, [RANDOMISING_INDEX, setBusinessId, setInvoiceId]);

  const setGrowthBookAttributes = useCallback(() => {
    if (!growthbook?.ready) return;
    growthbook.setAttributes({
      businessId: BUSINESS_ID, // Configured for ForceValue
      invoiceId: INVOICE_ID, // Using for hash assignment for experiment
    });
  }, [INVOICE_ID, BUSINESS_ID]);

  useEffect(() => {
    // Load features asynchronously when the app renders
    growthbook
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

  useEffect(() => {
    updateIds();
  }, [updateIds]);

  /**
   * WARNING setAttributes cannot have other dependents, should
   * just contain the items it need like invoiceId and businessId
   */
  useEffect(() => {
    setGrowthBookAttributes();
  }, [setGrowthBookAttributes]);

  return (
    <GrowthBookProvider growthbook={growthbook}>
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
    </GrowthBookProvider>
  );
}
