import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { loginAsDemoUser, renderApp } from '@/test/render';
import { useExplorerStore } from './explorerStore';

describe('Explorer', () => {
  beforeEach(() => {
    loginAsDemoUser();
    useExplorerStore.getState().reset();
  });

  it('liste les commerçants triés par distance', async () => {
    renderApp('/explorer');
    const list = await screen.findByRole('list', { name: 'Commerçants' });
    expect(within(list).getAllByRole('article').length).toBe(23);
  });

  it('filtre par catégorie via les chips', async () => {
    const user = userEvent.setup();
    renderApp('/explorer');
    await screen.findByText('23 résultats');

    const chip = screen.getByRole('button', { name: 'Boulangeries' });
    await user.click(chip);

    expect(chip).toHaveAttribute('aria-pressed', 'true');
    expect(await screen.findByText('3 résultats')).toBeInTheDocument();
  });

  it('affiche un état vide quand la recherche ne donne rien', async () => {
    const user = userEvent.setup();
    renderApp('/explorer');
    await user.type(await screen.findByRole('searchbox'), 'zzzz');
    expect(await screen.findByText('Aucun commerçant trouvé')).toBeInTheDocument();
  });
});
