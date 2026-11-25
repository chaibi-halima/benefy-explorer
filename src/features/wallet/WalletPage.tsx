import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { formatEuro } from '@/shared/lib/format';
import { ErrorState, Loader } from '@/shared/ui/States';
import { useAuthStore } from '@/features/auth/authStore';
import { RecentTransactions } from '@/features/transactions/RecentTransactions';
import { BalanceCard } from './BalanceCard';
import { walletsQuery } from './api';
import styles from './WalletPage.module.scss';

export function WalletPage() {
  const firstName = useAuthStore((s) => s.user?.firstName);
  const { data: wallets, isPending, isError, refetch } = useQuery(walletsQuery());

  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.title}>Bonjour {firstName} 👋</h1>
        {wallets && (
          <p className={styles.total}>
            Total disponible : <strong>{formatEuro(wallets.reduce((sum, w) => sum + w.balance, 0))}</strong>
          </p>
        )}
      </header>

      <section aria-label="Mes soldes">
        {isPending && <Loader label="Chargement des soldes…" />}
        {isError && <ErrorState message="Impossible de charger vos soldes." onRetry={() => refetch()} />}
        {wallets && (
          <div className={styles.grid}>
            {wallets.map((w) => (
              <BalanceCard key={w.benefit} wallet={w} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="recent-title" className={styles.recent}>
        <div className={styles.sectionHeader}>
          <h2 id="recent-title">Dernières opérations</h2>
          <Link to="/transactions">Tout voir</Link>
        </div>
        <RecentTransactions />
      </section>
    </div>
  );
}
