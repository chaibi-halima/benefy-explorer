import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { apiFetch } from '@/api/client';
import type { BenefitType, Paginated, Transaction, TransactionKind } from '@/api/types';

export interface TransactionFilters {
  benefit?: BenefitType;
  kind?: TransactionKind;
  page: number;
  pageSize: number;
}

export const transactionKeys = {
  all: ['transactions'] as const,
  list: (filters: TransactionFilters) => [...transactionKeys.all, 'list', filters] as const,
};

export const transactionsQuery = (filters: TransactionFilters) =>
  queryOptions({
    queryKey: transactionKeys.list(filters),
    queryFn: ({ signal }) =>
      apiFetch<Paginated<Transaction>>('/transactions', { query: { ...filters }, signal }),
    // garde la page précédente affichée pendant le chargement de la suivante (pas de "flash")
    placeholderData: keepPreviousData,
  });
