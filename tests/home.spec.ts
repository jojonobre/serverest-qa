import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';

test.describe('US003 - Funcionalidades da Home', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);

    await loginPage.navigate();
    await loginPage.login('fulano@qa.com', 'teste');
  });

  test('CT010 - Carregar lista de produtos ao acessar a Home', async () => {
    await expect(homePage.productCards.first()).toBeVisible();
  });

  test('CT012 - Pesquisar item por nome', async () => {
    await homePage.searchProduct('Logitech');
    await homePage.assertProductIsVisible('Logitech');
  });

  test('CT013 - Pesquisar produto inexistente', async () => {
    await homePage.searchProduct('ProdutoInexistenteX12399');
    await homePage.assertNoProductFound();
  });

  test('CT014 - Adicionar produto à lista de compras', async ({ page }) => {
    await homePage.searchProduct('Logitech');
    await homePage.addFirstProductToCart();

    await expect(page).toHaveURL(/.*carrinho/);
  });

  test('CT016 - Realizar Logout da aplicação', async ({ page }) => {
    await homePage.logout();
    await expect(page).toHaveURL(/.*login/);
  });
});