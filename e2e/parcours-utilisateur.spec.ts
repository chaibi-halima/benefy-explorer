import { expect, test } from '@playwright/test';

test.describe('Parcours utilisateur', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Mot de passe').fill('demo1234');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page.getByRole('heading', { name: /Bonjour Camille/ })).toBeVisible();
  });

  test("affiche les soldes sur l'accueil", async ({ page }) => {
    await expect(page.getByRole('article', { name: 'Repas' })).toContainText('142,50');
    await expect(page.getByRole('article', { name: 'Mobilité' })).toBeVisible();
  });

  test('recherche un commerçant dans Explorer', async ({ page }) => {
    await page.getByRole('link', { name: 'Explorer' }).click();
    await page.getByRole('searchbox').fill('bistrot');
    await expect(page.getByRole('heading', { name: 'Le Petit Bistrot' })).toBeVisible();
    await expect(page.getByText('1 résultat')).toBeVisible();
  });

  test('les filtres des opérations sont conservés dans l’URL', async ({ page }) => {
    await page.getByRole('link', { name: 'Opérations' }).click();
    await page.getByLabel('Type').selectOption('credit');
    await expect(page).toHaveURL(/kind=credit/);
    await expect(page.getByText('8 opérations')).toBeVisible();

    // Nouvelle navigation vers la même URL (plutôt que page.reload(), qui peut bloquer
    // le redémarrage du Service Worker MSW selon le navigateur)
    await page.goto(page.url());
    await expect(page.getByRole('heading', { name: 'Mes opérations' })).toBeVisible();
    await expect(page.getByLabel('Type')).toHaveValue('credit');
    await expect(page.getByText('8 opérations')).toBeVisible();
  });
});
