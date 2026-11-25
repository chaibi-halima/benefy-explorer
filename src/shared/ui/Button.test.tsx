import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('<Button />', () => {
  it('déclenche onClick', async () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Valider</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Valider' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('est désactivé et signale le chargement quand loading=true', () => {
    render(<Button loading>Valider</Button>);
    const btn = screen.getByRole('button', { name: 'Valider' });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });
});
