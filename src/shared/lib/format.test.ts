import { formatDistance, formatEuro } from './format';

// Intl utilise des espaces insécables : on les normalise pour des assertions lisibles
const norm = (s: string) => s.replace(/\s/g, ' ');

describe('formatEuro', () => {
  it('formate un montant en euros à la française', () => {
    expect(norm(formatEuro(1234.5))).toBe('1 234,50 €');
  });
});

describe('formatDistance', () => {
  it.each([
    [850, '850 m'],
    [1000, '1 km'],
    [1530, '1,5 km'],
  ])('%i m → %s', (input, expected) => {
    expect(formatDistance(input)).toBe(expected);
  });
});
