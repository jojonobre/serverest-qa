import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';

test.describe('US003 - Funcionalidade de Home (UI)', () => {
  let homePage: HomePage;
  let createdUserId: string | null = null;
  let createdProductId: string | null = null;
  let randomProductName: string;

  test.beforeEach(async ({ page, request }) => {
    const loginPage = new LoginPage(page);
    homePage = new HomePage(page);

    const userPayload = {
      nome: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password({ length: 10 }),
      administrador: 'false',
    };

    const userRes = await request.post('https://serverest.dev/usuarios', {
      data: userPayload,
    });
    expect(userRes.ok()).toBeTruthy();
    const userData = await userRes.json();
    createdUserId = userData._id;

    randomProductName = `Item_${faker.commerce.productName()}_${faker.string.alphanumeric(4)}`;
    const productRes = await request.post('https://serverest.dev/produtos', {
      headers: {
        Authorization: 'token-admin-if-required', 
      },
      data: {
        nome: randomProductName,
        preco: faker.number.int({ min: 10, max: 200 }),
        descricao: faker.commerce.productDescription(),
        quantidade: faker.number.int({ min: 5, max: 50 }),
      },
    }).catch(() => null);

    if (productRes && productRes.ok()) {
      const productData = await productRes.json();
      createdProductId = productData._id;
    }

    await loginPage.navigate();
    await loginPage.login(userPayload.email, userPayload.password);

    await expect(page).toHaveURL(/\/home/, {
      timeout: 15000,
    });
  });

  test.afterEach(async ({ request }) => {
    if (createdProductId) {
      await request.delete(`https://serverest.dev/produtos/${createdProductId}`).catch(() => {});
      createdProductId = null;
    }

    if (createdUserId) {
      await request.delete(`https://serverest.dev/usuarios/${createdUserId}`).catch(() => {});
      createdUserId = null;
    }
  });

  test('CT014 - Pesquisar produto inexistente', async () => {
    const nonexistentTerm = `Inexistente_${faker.string.uuid()}`;
    await homePage.searchProduct(nonexistentTerm);
    await homePage.assertNoProductFound();
  });

  test('CT015 - Adicionar produto à lista de compras', async ({ page }) => {
    await homePage.addFirstProductToCart();

    await expect(page.locator('.alert-danger')).not.toBeVisible();
  });
});