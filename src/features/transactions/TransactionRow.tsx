import clsx from 'clsx';
import type { Transaction } from '@/api/types';
import { formatDate, formatEuro } from '@/shared/lib/format';
import { BenefitBadge } from '@/shared/ui/BenefitBadge';
import styles from './TransactionRow.module.scss';

export function TransactionRow({ transaction: t }: { transaction: Transaction }) {
  const sign = t.kind === 'credit' ? '+' : '−';
  return (
    <li className={styles.row}>
      <div className={styles.main}>
        <span className={styles.merchant}>{t.merchantName}</span>
        <span className={styles.sub}>
          <time dateTime={t.date}>{formatDate(t.date)}</time> · <BenefitBadge benefit={t.benefit} />
        </span>
      </div>
      <span className={clsx(styles.amount, t.kind === 'credit' && styles.credit)}>
        <span className="visually-hidden">{t.kind === 'credit' ? 'Crédit de' : 'Débit de'} </span>
        <span aria-hidden="true">{sign}</span>
        {formatEuro(t.amount)}
      </span>
    </li>
  );
}
