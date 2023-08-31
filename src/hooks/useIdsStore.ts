import { create } from 'zustand';

type StoreState = {
  INVOICE_ID: string;
  BUSINESS_ID: string;
  setInvoiceId: (id: string) => void;
  setBusinessId: (id: string) => void;
};

export const useIdsStore = create<StoreState>((set) => ({
  INVOICE_ID: '',
  BUSINESS_ID: '',
  setInvoiceId: (id) => set({ INVOICE_ID: id }),
  setBusinessId: (id) => set({ BUSINESS_ID: id }),
}));
