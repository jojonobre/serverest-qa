import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';

test.describe('US004 - Lista de Compras (Carrinho)', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    cartPage = new CartPage(page);

    await loginPage.navigate();
    await loginPage.login('fulano@qa.com', 'teste');
    
    await homePage.searchProduct('Logitech');
    await homePage.addFirstProductToCart();
  });

  test('CT017 - Visualização dos produtos adicionados na lista de compras', async ({ page }) => {
    await expect(page).toHaveURL(/.*carrinho/);
    await cartPage.assertCartIsNotEmpty();
  });

  test('CT019 - Aumentar quantidade de um produto na lista', async () => {
    await cartPage.increaseQuantity();
  });

  test('CT020 - Diminuir quantidade de um produto na lista', async () => {
    await cartPage.increaseQuantity(); // Aumenta primeiro para permitir decrementar
    await cartPage.decreaseQuantity();
  });
});