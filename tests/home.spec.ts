import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';

test.describe('US003 - Funcionalidade de Home', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page, request }) => {
    const loginPage = new LoginPage(page);
    homePage = new HomePage(page);

    const email = `user_comum_${Date.now()}@qa.com`;
    const password = 'teste123';

    await request.post('https://serverest.dev/usuarios', {
      data: {
        nome: 'Usuário Comum',
        email,
        password,
        administrador: 'false',
      },
    }).catch(() => {});

    await loginPage.navigate();
    await loginPage.login(email, password);

    await expect(page).toHaveURL(/\/home/, {
      timeout: 15000,
    });
  });

  test('CT009 - Pesquisar item por nome', async () => {
    await homePage.searchProduct('Logitech');
    await homePage.assertProductIsVisible('Logitech');
  });

  test('CT010 - Pesquisar produto inexistente', async () => {
    await homePage.searchProduct('Produto Inexistente XYZ');
    await homePage.assertNoProductFound();
  });

  test('CT011 - Adicionar produto à lista de compras', async ({ page }) => {
    await homePage.addFirstProductToCart();

    // Valida que não há mensagem de erro
    await expect(page.locator('.alert-danger')).not.toBeVisible();
  });
});