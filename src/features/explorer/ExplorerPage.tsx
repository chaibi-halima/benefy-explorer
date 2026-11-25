import { useQuery } from '@tanstack/react-query';
import { useEffect, useId, useRef } from 'react';
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
    reset,
  } = useExplorerStore();
  const favoriteIds = useFavoritesStore((s) => s.ids);
  const debouncedQ = useDebouncedValue(q, 300);
  const searchId = useId();

  const { data, isPending, isError, isFetching, refetch } = useQuery(
    merchantsQuery({ q: debouncedQ, category, benefit, sort }),
  );

  // Les favoris ne vivent que dans le navigateur : on filtre la réponse côté client
  const merchants = favoritesOnly ? data?.filter((m) => favoriteIds.includes(m.id)) : data;

  // En mode « Favoris uniquement », retirer un favori fait disparaître la carte… et le bouton
  // qui avait le focus. On le replace sur la carte suivante, sinon sur la bascule du filtre.
  const listRef = useRef<HTMLUListElement>(null);
  const favoritesToggleRef = useRef<HTMLButtonElement>(null);
  const removedIndexRef = useRef<number | null>(null);

  useEffect(() => {
    const index = removedIndexRef.current;
    if (index === null) return;
    removedIndexRef.current = null;
    const hearts = listRef.current?.querySelectorAll<HTMLButtonElement>('button[aria-pressed]');
    const next = hearts?.[Math.min(index, hearts.length - 1)];
    (next ?? favoritesToggleRef.current)?.focus();
  }, [merchants]);

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
          {merchants.length === 0 && favoritesOnly && favoriteIds.length === 0 ? (
            <EmptyState title="Aucun favori pour l’instant">
              <p>Touchez le cœur d’un commerçant pour le retrouver ici.</p>
            </EmptyState>
          ) : merchants.length === 0 ? (
            <EmptyState title="Aucun commerçant trouvé">
              <Button variant="secondary" onClick={reset}>
                Effacer les filtres
              </Button>
            </EmptyState>
          ) : (
            <ul ref={listRef} className={styles.list} aria-label="Commerçants">
              {merchants.map((m, index) => (
                <li key={m.id}>
                  <MerchantCard
                    merchant={m}
                    onUnfavorite={
                      favoritesOnly
                        ? () => {
                            removedIndexRef.current = index;
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
