import type { BenefitType } from '@/api/types';
import styles from './BenefitBadge.module.scss';

export const benefitLabels: Record<BenefitType, string> = {
  meal: 'Repas',
  gift: 'Cadeaux',
  mobility: 'Mobilité',
};

export function BenefitBadge({ benefit }: { benefit: BenefitType }) {
  return <span className={`${styles.badge} ${styles[benefit]}`}>{benefitLabels[benefit]}</span>;
}
