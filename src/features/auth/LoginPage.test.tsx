import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '@/test/render';

describe('Connexion', () => {
  it("redirige vers /login quand l'utilisateur n'est pas connecté", async () => {
    renderApp('/transactions');
    expect(await screen.findByRole('button', { name: 'Se connecter' })).toBeInTheDocument();
  });

  it('affiche une erreur si les identifiants sont faux', async () => {
    const user = userEvent.setup();
    renderApp('/login');
    await user.type(screen.getByLabelText('Mot de passe'), 'mauvais');
    await user.click(screen.getByRole('button', { name: 'Se connecter' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Identifiants incorrects');
  });

  it("connecte l'utilisateur et le renvoie vers la page demandée", async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/transactions');
    await user.type(await screen.findByLabelText('Mot de passe'), 'demo1234');
    await user.click(screen.getByRole('button', { name: 'Se connecter' }));
    expect(await screen.findByRole('heading', { name: 'Mes opérations' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/transactions');
  });
});
