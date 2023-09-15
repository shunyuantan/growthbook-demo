import { createStore } from 'zustand/vanilla';

type StoreState = {
  experimentId: string;
  variantId: string;
  // setExperimentStuffIds: (experimentId: string, variantId: string) => void;
  // getExperimentId: () => string;
  // getVariantId: () => string;
};

export const experimentStuffStore = createStore<StoreState>(() => ({
  experimentId: '',
  variantId: '',
  // setExperimentStuffIds: (experimentId, variantId) => set({ experimentId, variantId }),
  // getExperimentId: () => set((state) => state.experimentId),
  // getVariantId: () => set((state) => state.variantId),
}));
