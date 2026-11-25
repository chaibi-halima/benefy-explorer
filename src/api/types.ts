/** Contrat de l'API REST (JSON). Partagé entre le front et les mocks MSW. */

export type BenefitType = 'meal' | 'gift' | 'mobility';

export interface Wallet {
  benefit: BenefitType;
  label: string;
  /** Solde en euros */
  balance: number;
  /** Plafond journalier (ex : 25 € pour le titre-restaurant), null si aucun */
  dailyLimit: number | null;
  /** Date d'expiration ISO des fonds, null si aucune */
  expiresAt: string | null;
}

export type TransactionKind = 'debit' | 'credit';

export interface Transaction {
  id: string;
  benefit: BenefitType;
  kind: TransactionKind;
  amount: number;
  merchantName: string;
  date: string; // ISO
}

export type MerchantCategory = 'restaurant' | 'grocery' | 'bakery' | 'transport' | 'culture' | 'shopping';

export interface Merchant {
  id: string;
  name: string;
  category: MerchantCategory;
  city: string;
  address: string;
  /** Distance en mètres depuis la position (fictive) de l'utilisateur */
  distance: number;
  acceptedBenefits: BenefitType[];
  rating: number; // 0..5
  /** Remise en %, null si aucune offre */
  discount: number | null;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiErrorBody {
  code: string;
  message: string;
}
