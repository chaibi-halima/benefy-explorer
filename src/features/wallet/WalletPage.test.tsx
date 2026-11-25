import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { loginAsDemoUser, renderApp } from '@/test/render';

describe('Page Accueil (portefeuille)', () => {
  beforeEach(loginAsDemoUser);

  it('affiche les trois soldes', async () => {
    renderApp('/');
    const repas = await screen.findByRole('article', { name: 'Repas' });
    expect(within(repas).getByText(/142,50/)).toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Cadeaux' })).toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Mobilité' })).toBeInTheDocument();
  });

  it("affiche une erreur puis permet de réessayer quand l'API échoue", async () => {
    let calls = 0;
    server.use(
      http.get('/api/wallets', () => {
        calls += 1;
        return calls === 1
          ? HttpResponse.json({ code: 'BOOM', message: 'boom' }, { status: 500 })
          : HttpResponse.json([{ benefit: 'meal', label: 'Repas', balance: 10, dailyLimit: 25, expiresAt: null }]);
      }),
    );
    const user = userEvent.setup();
    renderApp('/');

    // Le client ne retente pas en test (retry:false) → l'erreur s'affiche directement
    expect(await screen.findByText('Impossible de charger vos soldes.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Réessayer' }));
    expect(await screen.findByRole('article', { name: 'Repas' })).toBeInTheDocument();
  });

  it('déconnecte automatiquement sur une 401', async () => {
    server.use(http.get('/api/wallets', () => HttpResponse.json({ code: 'UNAUTHORIZED', message: '' }, { status: 401 })));
    renderApp('/');
    expect(await screen.findByRole('button', { name: 'Se connecter' })).toBeInTheDocument();
  });
});
