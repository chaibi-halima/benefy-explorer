import { useFavoritesStore } from './favoritesStore';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  it("n'a aucun favori au départ", () => {
    expect(useFavoritesStore.getState().isFavorite('m1')).toBe(false);
  });

  it('toggle ajoute puis retire un commerçant des favoris', () => {
    const { toggle } = useFavoritesStore.getState();

    toggle('m1');
    expect(useFavoritesStore.getState().isFavorite('m1')).toBe(true);
    expect(useFavoritesStore.getState().isFavorite('m2')).toBe(false);

    toggle('m1');
    expect(useFavoritesStore.getState().isFavorite('m1')).toBe(false);
  });

  it('persiste les favoris dans le localStorage', () => {
    useFavoritesStore.getState().toggle('m1');

    const stored = JSON.parse(localStorage.getItem('benefy-favorites') ?? '{}') as {
      state?: { ids?: string[] };
    };
    expect(stored.state?.ids).toEqual(['m1']);
  });
});
