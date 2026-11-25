import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Favoris commerçants (état client persisté dans le localStorage).
 * Un tableau plutôt qu'un Set : sérialisable en JSON tel quel par `persist`.
 */
interface FavoritesState {
  ids: string[];
  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id) ? state.ids.filter((x) => x !== id) : [...state.ids, id],
        })),
      isFavorite: (id) => get().ids.includes(id),
    }),
    {
      name: 'benefy-favorites',
      // on ne persiste que les données, pas les fonctions
      partialize: (state) => ({ ids: state.ids }),
    },
  ),
);
