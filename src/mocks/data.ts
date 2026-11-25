import type { BenefitType, Merchant, MerchantCategory, Transaction, User, Wallet } from '@/api/types';

/** Générateur pseudo-aléatoire déterministe : mêmes données à chaque lancement (tests stables). */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
const rand = seeded(42);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];

export const demoUser: User = {
  id: 'u-1',
  firstName: 'Camille',
  lastName: 'Martin',
  email: 'camille@demo.fr',
  company: 'Acme Corp',
};
export const DEMO_PASSWORD = 'demo1234';

export const wallets: Wallet[] = [
  { benefit: 'meal', label: 'Repas', balance: 142.5, dailyLimit: 25, expiresAt: '2027-02-28' },
  { benefit: 'gift', label: 'Cadeaux', balance: 80, dailyLimit: null, expiresAt: '2027-12-31' },
  { benefit: 'mobility', label: 'Mobilité', balance: 46.2, dailyLimit: null, expiresAt: null },
];

const merchantNames: Record<MerchantCategory, string[]> = {
  restaurant: ['Le Petit Bistrot', 'Sushi Kan', 'La Trattoria', 'Green Bowl', 'Chez Paulette', 'Burger Lab', 'Pho 75'],
  grocery: ['Marché Frais', 'Bio & Co', 'Épicerie du Coin', 'SuperPrix'],
  bakery: ['Boulangerie Dupain', 'Au Bon Croissant', 'Le Fournil'],
  transport: ['Vélo Libre', 'TrottiCity', 'Station Recharge+'],
  culture: ['Ciné Lumière', 'Librairie des Arts', 'Musée Moderne'],
  shopping: ['Mode & Style', 'TechStore', 'Maison Déco'],
};
const benefitsByCategory: Record<MerchantCategory, BenefitType[]> = {
  restaurant: ['meal', 'gift'],
  grocery: ['meal', 'gift'],
  bakery: ['meal'],
  transport: ['mobility'],
  culture: ['gift'],
  shopping: ['gift'],
};
const cities = ['Paris', 'Lyon', 'Lille', 'Bordeaux'] as const;
const streets = ['rue de la Paix', 'avenue Victor Hugo', 'boulevard Voltaire', 'rue Nationale', 'place de la République'];

export const merchants: Merchant[] = (Object.keys(merchantNames) as MerchantCategory[]).flatMap((category) =>
  merchantNames[category].map((name, i) => ({
    id: `m-${category}-${i}`,
    name,
    category,
    city: pick(cities),
    address: `${Math.floor(rand() * 120) + 1} ${pick(streets)}`,
    distance: Math.round(rand() * 4800 + 100),
    acceptedBenefits: benefitsByCategory[category],
    rating: Math.round((rand() * 2 + 3) * 10) / 10,
    discount: rand() > 0.6 ? pick([5, 10, 15, 20]) : null,
  })),
);

const start = new Date('2026-11-24T12:00:00Z').getTime();
export const transactions: Transaction[] = Array.from({ length: 64 }, (_, i) => {
  const isCredit = i % 9 === 0;
  const merchant = pick(merchants);
  const benefit = isCredit ? pick(['meal', 'gift', 'mobility'] as const) : pick(merchant.acceptedBenefits);
  return {
    id: `t-${i + 1}`,
    benefit,
    kind: isCredit ? 'credit' : 'debit',
    amount: isCredit ? pick([50, 100, 180]) : Math.round((rand() * 23 + 2) * 100) / 100,
    merchantName: isCredit ? 'Chargement employeur' : merchant.name,
    date: new Date(start - i * 1000 * 60 * 60 * 19).toISOString(),
  };
});
