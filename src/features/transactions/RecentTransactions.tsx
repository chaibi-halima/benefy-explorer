import { useQuery } from '@tanstack/react-query';
import { EmptyState, ErrorState, Loader } from '@/shared/ui/States';
import { transactionsQuery } from './api';
import { TransactionRow } from './TransactionRow';
import styles from './TransactionList.module.scss';

export function RecentTransactions() {
  const { data, isPending, isError, refetch } = useQuery(transactionsQuery({ page: 1, pageSize: 5 }));

  if (isPending) return <Loader />;
  if (isError) return <ErrorState message="Impossible de charger les opérations." onRetry={() => refetch()} />;
  if (data.items.length === 0) return <EmptyState title="Aucune opération pour le moment" />;

  return (
    <ul className={styles.list}>
      {data.items.map((t) => (
        <TransactionRow key={t.id} transaction={t} />
      ))}
    </ul>
  );
}
