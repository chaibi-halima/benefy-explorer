import { queryOptions } from '@tanstack/react-query';
import { apiFetch } from '@/api/client';
import type { BenefitType, Merchant, MerchantCategory } from '@/api/types';

export interface MerchantSearch {
  q: string;
  category?: MerchantCategory;
  benefit?: BenefitType;
  sort: 'distance' | 'rating';
}

export const merchantKeys = {
  all: ['merchants'] as const,
  search: (s: MerchantSearch) => [...merchantKeys.all, 'search', s] as const,
  detail: (id: string) => [...merchantKeys.all, 'detail', id] as const,
};

export const merchantsQuery = (search: MerchantSearch) =>
  queryOptions({
    queryKey: merchantKeys.search(search),
    queryFn: ({ signal }) => apiFetch<Merchant[]>('/merchants', { query: { ...search }, signal }),
    staleTime: 60_000,
  });

// TODO (ticket EXP-2) : merchantQuery(id) pour la page détail → GET /api/merchants/:id
