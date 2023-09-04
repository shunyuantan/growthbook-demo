import { SingleValue } from 'react-select';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type StoreState = {
  selectedCountry: SingleValue<{ value: string; label: string }>;
  setSelectedCountry: (
    country: SingleValue<{ value: string; label: string }>,
  ) => void;
};

export const useCountryStore = create(
  persist<StoreState>(
    (set, get) => ({
      selectedCountry: { value: '', label: '' },
      setSelectedCountry: (country) => {
        set({ selectedCountry: country });
      },
    }),
    {
      name: 'country-storage', // name of the item in the storage (must be unique)
    },
  ),
);
