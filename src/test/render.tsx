import { QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import { demoUser } from '@/mocks/data';
import { useAuthStore } from '@/features/auth/authStore';
import { createQueryClient } from '@/app/queryClient';
import { routes as appRoutes } from '@/app/routes';

export function loginAsDemoUser() {
  useAuthStore.setState({ token: 'demo-token', user: demoUser });
}


/** Rend un composant isolé avec les providers nécessaires. */
export function renderWithProviders(ui: ReactElement, { route = '/' } = {}) {
  return renderRoutes([{ path: '*', element: ui }], route);
}

/** Rend l'application complète (vraies routes) à une URL donnée. */
export function renderApp(route = '/') {
  return renderRoutes(appRoutes, route);
}

function renderRoutes(routes: RouteObject[], route: string) {
  const router = createMemoryRouter(routes, { initialEntries: [route] });
  // même config qu'en prod (gestion globale des 401), sans retry pour des tests rapides
  const queryClient = createQueryClient({ retry: false });
  return {
    router,
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    ),
  };
}
