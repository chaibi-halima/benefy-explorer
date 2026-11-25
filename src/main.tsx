import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './styles/global.scss';

async function enableMocking() {
  // Pas de vrai backend : MSW intercepte les appels /api dans le navigateur.
  // Le jour où un backend existe, conditionner ceci à import.meta.env.VITE_USE_MOCKS.
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass', quiet: true });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
