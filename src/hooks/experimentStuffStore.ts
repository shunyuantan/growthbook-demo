import { createStore } from 'zustand/vanilla';

type StoreState = {
  experimentId: string;
  variantId: string;
};

export const experimentStuffStore = createStore<StoreState>(() => ({
  experimentId: '',
  variantId: '',
}));
