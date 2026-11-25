import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
// Police auto-hébergée (pas d'appel à Google Fonts) : sous-ensemble latin (suffisant pour le
// français) et seulement les graisses utilisées par les tokens
import '@fontsource/ubuntu/latin-400.css';
import '@fontsource/ubuntu/latin-700.css';
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
