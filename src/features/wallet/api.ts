import { queryOptions } from '@tanstack/react-query';
import { apiFetch } from '@/api/client';
import type { Wallet } from '@/api/types';

/** Les query keys sont centralisées par feature : facilite l'invalidation ciblée. */
export const walletKeys = {
  all: ['wallets'] as const,
};

export const walletsQuery = () =>
  queryOptions({
    queryKey: walletKeys.all,
    queryFn: ({ signal }) => apiFetch<Wallet[]>('/wallets', { signal }),
    staleTime: 30_000,
  });
