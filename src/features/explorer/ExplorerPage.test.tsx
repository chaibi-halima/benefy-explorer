import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { loginAsDemoUser, renderApp } from '@/test/render';
import { useExplorerStore } from './explorerStore';
import { useFavoritesStore } from './favoritesStore';

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

  describe('favoris', () => {
    beforeEach(() => {
      useFavoritesStore.setState({ ids: [] });
    });

    it('met un commerçant en favori avec le bouton cœur', async () => {
      const user = userEvent.setup();
      renderApp('/explorer');

      const heart = await screen.findByRole('button', { name: 'Ajouter Le Petit Bistrot aux favoris' });
      expect(heart).toHaveAttribute('aria-pressed', 'false');

      await user.click(heart);
      expect(heart).toHaveAttribute('aria-pressed', 'true');

      await user.click(heart);
      expect(heart).toHaveAttribute('aria-pressed', 'false');
    });

    it('filtre sur les favoris uniquement', async () => {
      const user = userEvent.setup();
      renderApp('/explorer');
      await screen.findByText('23 résultats');

      await user.click(screen.getByRole('button', { name: 'Ajouter Le Petit Bistrot aux favoris' }));
      await user.click(screen.getByRole('button', { name: 'Ajouter Sushi Kan aux favoris' }));

      const toggle = screen.getByRole('button', { name: 'Favoris uniquement' });
      await user.click(toggle);

      expect(toggle).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByText('2 résultats')).toBeInTheDocument();
      const list = screen.getByRole('list', { name: 'Commerçants' });
      expect(within(list).getByRole('article', { name: 'Le Petit Bistrot' })).toBeInTheDocument();
      expect(within(list).getByRole('article', { name: 'Sushi Kan' })).toBeInTheDocument();
    });

    it('garde le focus sur un contrôle visible quand on retire un favori en mode « Favoris uniquement »', async () => {
      const user = userEvent.setup();
      renderApp('/explorer');
      await screen.findByText('23 résultats');

      // tri par distance : Sushi Kan (1,3 km) puis Le Petit Bistrot (1,4 km)
      await user.click(screen.getByRole('button', { name: 'Ajouter Sushi Kan aux favoris' }));
      await user.click(screen.getByRole('button', { name: 'Ajouter Le Petit Bistrot aux favoris' }));
      await user.click(screen.getByRole('button', { name: 'Favoris uniquement' }));

      // retirer la première carte → le focus passe au cœur de la carte suivante
      await user.click(screen.getByRole('button', { name: 'Ajouter Sushi Kan aux favoris' }));
      expect(screen.getByRole('button', { name: 'Ajouter Le Petit Bistrot aux favoris' })).toHaveFocus();

      // retirer la dernière carte → le focus revient sur la bascule du filtre
      await user.keyboard(' ');
      expect(screen.getByRole('button', { name: 'Favoris uniquement' })).toHaveFocus();
    });

    it("affiche un état vide dédié quand il n'y a aucun favori", async () => {
      const user = userEvent.setup();
      renderApp('/explorer');
      await screen.findByText('23 résultats');

      await user.click(screen.getByRole('button', { name: 'Favoris uniquement' }));

      expect(screen.getByText('Aucun favori pour l’instant')).toBeInTheDocument();
    });
  });

  it('affiche un état vide quand la recherche ne donne rien', async () => {
    const user = userEvent.setup();
    renderApp('/explorer');
    await user.type(await screen.findByRole('searchbox'), 'zzzz');
    expect(await screen.findByText('Aucun commerçant trouvé')).toBeInTheDocument();
  });
});
