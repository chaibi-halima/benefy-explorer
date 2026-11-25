import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { loginAsDemoUser, renderApp } from '@/test/render';

describe('Page Opérations', () => {
  beforeEach(loginAsDemoUser);

  it('pagine les opérations', async () => {
    const user = userEvent.setup();
    renderApp('/transactions');
    expect(await screen.findByText('Page 1 / 7')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Suivant' }));
    expect(await screen.findByText('Page 2 / 7')).toBeInTheDocument();
  });

  it("filtre par type et synchronise l'URL", async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/transactions');
    await screen.findByText(/64 opérations/);

    await user.selectOptions(screen.getByLabelText('Type'), 'credit');

    await waitFor(() => expect(router.state.location.search).toBe('?kind=credit'));
    expect(await screen.findByText(/8 opérations/)).toBeInTheDocument();
    expect(screen.getAllByText('Chargement employeur').length).toBeGreaterThan(0);
  });
});
