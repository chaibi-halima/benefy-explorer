import { create } from 'zustand';
import type { BenefitType, MerchantCategory } from '@/api/types';
import type { MerchantSearch } from './api';

/**
 * État UI de la recherche (client state) → Zustand.
 * Les données serveur (liste de commerçants) → React Query.
 * Garder cette séparation est un point d'architecture souvent discuté en entretien.
 */
interface ExplorerFilters extends MerchantSearch {
  /** Filtre appliqué côté client : les favoris ne sont connus que du navigateur. */
  favoritesOnly: boolean;
}

interface ExplorerState extends ExplorerFilters {
  setQuery: (q: string) => void;
  setCategory: (c?: MerchantCategory) => void;
  setBenefit: (b?: BenefitType) => void;
  setSort: (s: MerchantSearch['sort']) => void;
  setFavoritesOnly: (favoritesOnly: boolean) => void;
  reset: () => void;
}

const initial: ExplorerFilters = {
  q: '',
  category: undefined,
  benefit: undefined,
  sort: 'distance',
  favoritesOnly: false,
};

export const useExplorerStore = create<ExplorerState>()((set) => ({
  ...initial,
  setQuery: (q) => set({ q }),
  setCategory: (category) => set({ category }),
  setBenefit: (benefit) => set({ benefit }),
  setSort: (sort) => set({ sort }),
  setFavoritesOnly: (favoritesOnly) => set({ favoritesOnly }),
  reset: () => set(initial),
}));
