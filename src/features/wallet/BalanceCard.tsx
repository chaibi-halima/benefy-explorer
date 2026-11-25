import { memo } from 'react';
import type { Wallet } from '@/api/types';
import { formatDate, formatEuro } from '@/shared/lib/format';
import styles from './BalanceCard.module.scss';

export const BalanceCard = memo(function BalanceCard({ wallet }: { wallet: Wallet }) {
  const titleId = `wallet-${wallet.benefit}`;
  return (
    <article className={`${styles.card} ${styles[wallet.benefit]}`} aria-labelledby={titleId}>
      <h2 id={titleId} className={styles.label}>
        {wallet.label}
      </h2>
      <p className={styles.balance}>
        <span className="visually-hidden">Solde : </span>
        {formatEuro(wallet.balance)}
      </p>
      <ul className={styles.meta}>
        {wallet.dailyLimit !== null && <li>Plafond : {formatEuro(wallet.dailyLimit)} / jour</li>}
        {wallet.expiresAt && <li>Valable jusqu'au {formatDate(wallet.expiresAt)}</li>}
      </ul>
    </article>
  );
});
