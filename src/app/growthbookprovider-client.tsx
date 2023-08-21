'use client';

import { growthbook } from '@/utils/growthbook';
import { GrowthBookProvider } from '@growthbook/growthbook-react';
import { useEffect } from 'react';

export const GrowthBookProviderClient = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => {
    // Load features asynchronously when the app renders
    growthbook.loadFeatures();
  }, []);
  return (
    <GrowthBookProvider growthbook={growthbook}>{children}</GrowthBookProvider>
  );
};
