import { useQuery } from '@tanstack/react-query';
import { useEffect, useId, useMemo, useRef } from 'react';
import type { BenefitType, MerchantCategory } from '@/api/types';
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue';
import { benefitLabels } from '@/shared/ui/BenefitBadge';
import { Button } from '@/shared/ui/Button';
import { EmptyState, ErrorState, Loader } from '@/shared/ui/States';
import { merchantsQuery } from './api';
import { categoryLabels } from './categories';
import { useExplorerStore } from './explorerStore';
import { useFavoritesStore } from './favoritesStore';
import { MerchantCard } from './MerchantCard';
import styles from './ExplorerPage.module.scss';

export function ExplorerPage() {
  const {
    q,
    category,
    benefit,
    sort,
    favoritesOnly,
    setQuery,
    setCategory,
    setBenefit,
    setSort,
    setFavoritesOnly,
    clearFilters,
    reset,
  } = useExplorerStore();
  const favoriteIds = useFavoritesStore((s) => s.ids);
  const debouncedQ = useDebouncedValue(q, 300);
  const searchId = useId();

  const { data, isPending, isError, isFetching, refetch } = useQuery(
    merchantsQuery({ q: debouncedQ, category, benefit, sort }),
  );

  // Les favoris ne vivent que dans le navigateur : on filtre la réponse côté client.
  // useMemo : la référence ne change que si les données ou les favoris changent, ce qui
  // rend explicite le déclenchement de l'effet de focus ci-dessous.
  const merchants = useMemo(
    () => (favoritesOnly ? data?.filter((m) => favoriteIds.includes(m.id)) : data),
    [data, favoritesOnly, favoriteIds],
  );

  // En mode « Favoris uniquement », retirer un favori fait disparaître la carte… et le bouton
  // qui avait le focus. On le replace sur le cœur de la carte voisine, sinon sur la bascule.
  // Les cœurs sont indexés par id (callback refs) : on ne dépend pas de la structure du DOM.
  const favoriteButtons = useRef(new Map<string, HTMLButtonElement>());
  const favoritesToggleRef = useRef<HTMLButtonElement>(null);
  const pendingFocus = useRef<{ nextId: string | undefined } | null>(null);

  useEffect(() => {
    if (!pendingFocus.current) return;
    const { nextId } = pendingFocus.current;
    pendingFocus.current = null;
    const next = nextId ? favoriteButtons.current.get(nextId) : undefined;
    (next ?? favoritesToggleRef.current)?.focus();
  }, [merchants]);

  // Liste vide : trois situations, trois messages
  const hasOtherFilters = Boolean(debouncedQ.trim() || category || benefit);
  const emptyState = !favoritesOnly ? (
    <EmptyState title="Aucun commerçant trouvé">
      <Button variant="secondary" onClick={reset}>
        Effacer les filtres
      </Button>
    </EmptyState>
  ) : hasOtherFilters ? (
    <EmptyState title="Aucun favori ne correspond à ces filtres">
      <Button variant="secondary" onClick={clearFilters}>
        Effacer les autres filtres
      </Button>
    </EmptyState>
  ) : (
    // aucun favori, ou des favoris qui n'existent plus dans le catalogue
    <EmptyState title="Aucun favori pour l’instant">
      <p>Touchez le cœur d’un commerçant pour le retrouver ici.</p>
    </EmptyState>
  );

  return (
    <div className={styles.page}>
      <header>
        <h1>Explorer</h1>
        <p className={styles.subtitle}>Trouvez où utiliser vos avantages près de chez vous.</p>
      </header>

      <div role="search" className={styles.search}>
        <label htmlFor={searchId} className="visually-hidden">
          Rechercher un commerçant ou une ville
        </label>
        <input
          id={searchId}
          type="search"
          placeholder="Rechercher un commerçant ou une ville…"
          value={q}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className={styles.chips} role="group" aria-label="Catégories">
        {(Object.keys(categoryLabels) as MerchantCategory[]).map((c) => (
          <button
            key={c}
            type="button"
            className={styles.chip}
            aria-pressed={category === c}
            onClick={() => setCategory(category === c ? undefined : c)}
          >
            {categoryLabels[c]}
          </button>
        ))}
      </div>

      <div className={styles.toolbar}>
        <label>
          <span>Avantage accepté</span>
          <select
            value={benefit ?? ''}
            onChange={(e) => setBenefit((e.target.value || undefined) as BenefitType | undefined)}
          >
            <option value="">Tous</option>
            {(Object.keys(benefitLabels) as BenefitType[]).map((b) => (
              <option key={b} value={b}>
                {benefitLabels[b]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Trier par</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as 'distance' | 'rating')}>
            <option value="distance">Distance</option>
            <option value="rating">Note</option>
          </select>
        </label>
        <button
          ref={favoritesToggleRef}
          type="button"
          className={styles.chip}
          aria-pressed={favoritesOnly}
          onClick={() => setFavoritesOnly(!favoritesOnly)}
        >
          Favoris uniquement
        </button>
        <Button variant="ghost" onClick={reset}>
          Réinitialiser
        </Button>
      </div>

      {isPending && <Loader label="Recherche des commerçants…" />}
      {isError && <ErrorState message="La recherche a échoué." onRetry={() => refetch()} />}
      {merchants && (
        <>
          <p className={styles.count} aria-live="polite" aria-busy={isFetching}>
            {merchants.length} résultat{merchants.length > 1 ? 's' : ''}
          </p>
          {merchants.length === 0 ? (
            emptyState
          ) : (
            <ul className={styles.list} aria-label="Commerçants">
              {merchants.map((m, index) => (
                <li key={m.id}>
                  <MerchantCard
                    merchant={m}
                    favoriteButtonRef={(el) => {
                      if (el) favoriteButtons.current.set(m.id, el);
                      else favoriteButtons.current.delete(m.id);
                    }}
                    onUnfavorite={
                      favoritesOnly
                        ? () => {
                            // la carte retirée laisse sa place à la suivante, ou à la précédente si c'était la dernière
                            pendingFocus.current = {
                              nextId: (merchants[index + 1] ?? merchants[index - 1])?.id,
                            };
                          }
                        : undefined
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
