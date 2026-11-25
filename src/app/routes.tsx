import type { RouteObject } from 'react-router-dom';
import { LoginPage } from '@/features/auth/LoginPage';
import { RequireAuth } from '@/features/auth/RequireAuth';
import { ExplorerPage } from '@/features/explorer/ExplorerPage';
import { TransactionsPage } from '@/features/transactions/TransactionsPage';
import { WalletPage } from '@/features/wallet/WalletPage';
import { Layout } from './Layout';

// TODO (ticket PERF-1) : charger Explorer et Transactions en lazy() + Suspense
export const routes: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <WalletPage /> },
          { path: 'explorer', element: <ExplorerPage /> },
          { path: 'transactions', element: <TransactionsPage /> },
          { path: '*', element: <p>Page introuvable</p> },
        ],
      },
    ],
  },
];
