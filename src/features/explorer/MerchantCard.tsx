import { type Ref, useId } from 'react';
import type { Merchant } from '@/api/types';
import { formatDistance } from '@/shared/lib/format';
import { BenefitBadge } from '@/shared/ui/BenefitBadge';
import { categoryEmoji, categoryLabels } from './categories';
import { useFavoritesStore } from './favoritesStore';
import styles from './MerchantCard.module.scss';

interface MerchantCardProps {
  merchant: Merchant;
  /** Appelé quand le commerçant est retiré des favoris (permet au parent de gérer le focus). */
  onUnfavorite?: () => void;
  /** Ref vers le bouton cœur, pour que le parent puisse y déplacer le focus. */
  favoriteButtonRef?: Ref<HTMLButtonElement>;
}

export function MerchantCard({ merchant: m, onUnfavorite, favoriteButtonRef }: MerchantCardProps) {
  const titleId = useId();
  // sélecteur qui renvoie un booléen : seule la carte concernée se re-rend au toggle
  const isFavorite = useFavoritesStore((s) => s.isFavorite(m.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);

  return (
    <article className={styles.card} aria-labelledby={titleId}>
      <div className={styles.icon} aria-hidden="true">
        {categoryEmoji[m.category]}
      </div>
      <div className={styles.body}>
        <h2 id={titleId} className={styles.name}>
          {m.name}
        </h2>
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
      {/* Nom fixe + aria-pressed : c'est l'état « enfoncé » qui dit si le commerçant est en favori */}
      <button
        ref={favoriteButtonRef}
        type="button"
        className={styles.favorite}
        aria-pressed={isFavorite}
        aria-label={`Ajouter ${m.name} aux favoris`}
        onClick={() => {
          if (isFavorite) onUnfavorite?.();
          toggleFavorite(m.id);
        }}
      >
        <span aria-hidden="true">{isFavorite ? '♥' : '♡'}</span>
      </button>
      {/* TODO (ticket EXP-2) : lien vers /explorer/:id */}
    </article>
  );
}
