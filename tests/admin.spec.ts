import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AdminPage } from '../pages/AdminPage';

test.describe('US005 - Painel e Ações do Administrador', () => {
  let adminPage: AdminPage;

  test.beforeEach(async ({ page, request }) => {
    const loginPage = new LoginPage(page);
    adminPage = new AdminPage(page);

    const email = `admin${Date.now()}@teste.com`;
    const password = 'Admin123';

    const cadastro = await request.post(
      'https://serverest.dev/usuarios',
      {
        data: {
          nome: 'Administrador de Teste',
          email,
          password,
          administrador: 'true',
        },
      }
    );

    expect(cadastro.ok()).toBeTruthy();

    await loginPage.navigate();
    await loginPage.login(email, password);

    await expect(page).toHaveURL(/\/admin\/home/, {
      timeout: 15000,
    });
  });

  test('CT001 PARA ADMIN - Login com sucesso como Administrador', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/home/);
  });

  test('CT025 - Carregamento do painel de administração', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Bem Vindo');
  });

  test('CT026 - Cadastrar novo produto com sucesso (Admin)', async () => {
    await adminPage.goToRegisterProduct();

    await adminPage.fillProductForm(
      `Produto ${Date.now()}`,
      '100',
      'Produto de teste',
      '10'
    );

    await adminPage.submitProduct();
  });

  test('CT027 - Tentar cadastrar produto com nome já existente', async () => {
    const productName = `Produto duplicado ${Date.now()}`;

    await adminPage.goToRegisterProduct();

    await adminPage.fillProductForm(
      productName,
      '100',
      'Produto de teste',
      '10'
    );

    const primeiroCadastro = await adminPage.submitProduct();
    expect(primeiroCadastro.ok()).toBeTruthy();

    await adminPage.goToRegisterProduct();

    await adminPage.fillProductForm(
      productName,
      '100',
      'Produto duplicado',
      '10'
    );

    const segundoCadastro = await adminPage.submitProduct();

    expect(segundoCadastro.status()).toBe(400);
  });

  test('CT029 - Excluir produto cadastrado', async () => {
    const productName = `Produto para excluir ${Date.now()}`;

    await adminPage.goToRegisterProduct();

    await adminPage.fillProductForm(
      productName,
      '50',
      'Produto criado para exclusão',
      '5'
    );

    const response = await adminPage.submitProduct();
    expect(response.ok()).toBeTruthy();

    await adminPage.goToListProducts();
    await adminPage.deleteProductByName(productName);
  });
});