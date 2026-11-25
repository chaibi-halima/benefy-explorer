import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import type { BenefitType, TransactionKind } from '@/api/types';
import { Button } from '@/shared/ui/Button';
import { benefitLabels } from '@/shared/ui/BenefitBadge';
import { EmptyState, ErrorState, Loader } from '@/shared/ui/States';
import { transactionsQuery } from './api';
import { TransactionRow } from './TransactionRow';
import listStyles from './TransactionList.module.scss';
import styles from './TransactionsPage.module.scss';

const PAGE_SIZE = 10;

/**
 * Les filtres vivent dans l'URL (useSearchParams) : partageables, conservés au refresh,
 * et compatibles avec le bouton "précédent" du navigateur.
 */
export function TransactionsPage() {
  const [params, setParams] = useSearchParams();
  const benefit = (params.get('benefit') as BenefitType | null) ?? undefined;
  const kind = (params.get('kind') as TransactionKind | null) ?? undefined;
  const page = Number(params.get('page') ?? 1);

  const { data, isPending, isError, isPlaceholderData, refetch } = useQuery(
    transactionsQuery({ benefit, kind, page, pageSize: PAGE_SIZE }),
  );

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page'); // un changement de filtre ramène en page 1
    setParams(next);
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div className={styles.page}>
      <h1>Mes opérations</h1>

      <div className={styles.filters} role="group" aria-label="Filtres">
        <label>
          <span>Avantage</span>
          <select value={benefit ?? ''} onChange={(e) => updateParam('benefit', e.target.value)}>
            <option value="">Tous</option>
            {(Object.keys(benefitLabels) as BenefitType[]).map((b) => (
              <option key={b} value={b}>
                {benefitLabels[b]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Type</span>
          <select value={kind ?? ''} onChange={(e) => updateParam('kind', e.target.value)}>
            <option value="">Tous</option>
            <option value="debit">Dépenses</option>
            <option value="credit">Chargements</option>
          </select>
        </label>
      </div>

      {isPending && <Loader />}
      {isError && <ErrorState message="Impossible de charger les opérations." onRetry={() => refetch()} />}
      {data && data.items.length === 0 && <EmptyState title="Aucune opération ne correspond à ces filtres" />}
      {data && data.items.length > 0 && (
        <>
          <p className={styles.count} aria-live="polite">
            {data.total} opération{data.total > 1 ? 's' : ''}
          </p>
          <ul className={listStyles.list} style={{ opacity: isPlaceholderData ? 0.6 : 1 }}>
            {data.items.map((t) => (
              <TransactionRow key={t.id} transaction={t} />
            ))}
          </ul>
          <nav className={styles.pagination} aria-label="Pagination">
            <Button variant="secondary" disabled={page <= 1} onClick={() => updateParam('page', String(page - 1))}>
              Précédent
            </Button>
            <span aria-current="page">
              Page {page} / {totalPages}
            </span>
            <Button
              variant="secondary"
              disabled={page >= totalPages || isPlaceholderData}
              onClick={() => updateParam('page', String(page + 1))}
            >
              Suivant
            </Button>
          </nav>
        </>
      )}
    </div>
  );
}
