import type { Merchant } from '@/api/types';
import { formatDistance } from '@/shared/lib/format';
import { BenefitBadge } from '@/shared/ui/BenefitBadge';
import { categoryEmoji, categoryLabels } from './categories';
import styles from './MerchantCard.module.scss';

export function MerchantCard({ merchant: m }: { merchant: Merchant }) {
  return (
    <article className={styles.card}>
      <div className={styles.icon} aria-hidden="true">
        {categoryEmoji[m.category]}
      </div>
      <div className={styles.body}>
        <h2 className={styles.name}>{m.name}</h2>
        <p className={styles.meta}>
          {categoryLabels[m.category]} · {m.city} · {formatDistance(m.distance)} ·{' '}
          <span aria-label={`Note ${m.rating} sur 5`}>★ {m.rating.toLocaleString('fr-FR')}</span>
        </p>
        <div className={styles.badges}>
          {m.acceptedBenefits.map((b) => (
            <BenefitBadge key={b} benefit={b} />
          ))}
          {m.discount && <span className={styles.discount}>−{m.discount} %</span>}
        </div>
      </div>
      {/* TODO (ticket EXP-1) : bouton "Ajouter aux favoris" (aria-pressed) */}
      {/* TODO (ticket EXP-2) : lien vers /explorer/:id */}
    </article>
  );
}
