import { QueryCache, QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/api/client';
import { useAuthStore } from '@/features/auth/authStore';

export function createQueryClient({ retry = true }: { retry?: boolean } = {}) {
  return new QueryClient({
    queryCache: new QueryCache({
      // 401 global → déconnexion (le RequireAuth redirige vers /login)
      onError: (error) => {
        if (error instanceof ApiError && error.status === 401) useAuthStore.getState().logout();
      },
    }),
    defaultOptions: {
      queries: {
        retry: retry
          ? (failureCount, error) => !(error instanceof ApiError && error.status < 500) && failureCount < 2
          : false,
        refetchOnWindowFocus: false,
      },
    },
  });
}
