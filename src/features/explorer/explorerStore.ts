import { create } from 'zustand';
import type { BenefitType, MerchantCategory } from '@/api/types';
import type { MerchantSearch } from './api';

/**
 * État UI de la recherche (client state) → Zustand.
 * Les données serveur (liste de commerçants) → React Query.
 * Garder cette séparation est un point d'architecture souvent discuté en entretien.
 */
interface ExplorerState extends MerchantSearch {
  setQuery: (q: string) => void;
  setCategory: (c?: MerchantCategory) => void;
  setBenefit: (b?: BenefitType) => void;
  setSort: (s: MerchantSearch['sort']) => void;
  reset: () => void;
}

const initial: MerchantSearch = { q: '', category: undefined, benefit: undefined, sort: 'distance' };

export const useExplorerStore = create<ExplorerState>()((set) => ({
  ...initial,
  setQuery: (q) => set({ q }),
  setCategory: (category) => set({ category }),
  setBenefit: (benefit) => set({ benefit }),
  setSort: (sort) => set({ sort }),
  reset: () => set(initial),
}));
