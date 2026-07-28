import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { LoginPage } from '../pages/LoginPage';
import { AdminPage } from '../pages/AdminPage';

test.describe('US005 - Painel e Ações do Administrador (UI)', () => {
  let adminPage: AdminPage;
  let loginPage: LoginPage;
  let createdUserId: string | null = null;
  let createdProductIds: string[] = [];

  test.beforeEach(async ({ page, request }) => {
    loginPage = new LoginPage(page);
    adminPage = new AdminPage(page);
    const randomUser = {
      nome: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password({ length: 12 }),
      administrador: 'true',
    };
    const responseUsuario = await request.post('https://serverest.dev/usuarios', {
      data: randomUser,
    });

    expect(responseUsuario.ok()).toBeTruthy();
    const bodyUsuario = await responseUsuario.json();
    createdUserId = bodyUsuario._id; 

    await loginPage.navigate();
    await loginPage.login(randomUser.email, randomUser.password);

    await expect(page).toHaveURL(/\/admin\/home/, {
      timeout: 15000,
    });
  });

  test.afterEach(async ({ request }) => {
    for (const productId of createdProductIds) {
      await request.delete(`https://serverest.dev/produtos/${productId}`);
    }
    createdProductIds = []; 
    if (createdUserId) {
      await request.delete(`https://serverest.dev/usuarios/${createdUserId}`);
      createdUserId = null;
    }
  });

  test('CT001 PARA ADMIN - Login com sucesso como Administrador', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/home/);
  });

  test('CT025 - Carregamento do painel de administração', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Bem Vindo');
  });

  test('CT026 - Cadastrar novo produto com sucesso (Admin)', async () => {
    const randomProduct = {
      nome: `Produto ${faker.commerce.productName()} ${faker.string.alphanumeric(4)}`,
      preco: faker.number.int({ min: 10, max: 500 }).toString(),
      descricao: faker.commerce.productDescription(),
      quantidade: faker.number.int({ min: 1, max: 100 }).toString(),
    };

    await adminPage.goToRegisterProduct();
    await adminPage.fillProductForm(
      randomProduct.nome,
      randomProduct.preco,
      randomProduct.descricao,
      randomProduct.quantidade
    );

    const response = await adminPage.submitProduct();
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    if (body._id) {
      createdProductIds.push(body._id); 
    }
  });

  test('CT027 - Tentar cadastrar produto com nome já existente', async () => {
    const productName = `Produto Duplicado ${faker.string.alphanumeric(6)}`;

    await adminPage.goToRegisterProduct();
    await adminPage.fillProductForm(productName, '100', faker.commerce.productDescription(), '10');
    const primeiroCadastro = await adminPage.submitProduct();
    expect(primeiroCadastro.ok()).toBeTruthy();

    const bodyPrimeiro = await primeiroCadastro.json();
    if (bodyPrimeiro._id) {
      createdProductIds.push(bodyPrimeiro._id);
    }

    await adminPage.goToRegisterProduct();
    await adminPage.fillProductForm(productName, '100', faker.commerce.productDescription(), '10');
    const segundoCadastro = await adminPage.submitProduct();

    expect(segundoCadastro.status()).toBe(400);
  });

  test('CT029 - Excluir produto cadastrado via UI', async () => {
    const productName = `Produto Para Excluir ${faker.string.alphanumeric(6)}`;

    await adminPage.goToRegisterProduct();
    await adminPage.fillProductForm(productName, '50', faker.commerce.productDescription(), '5');
    const response = await adminPage.submitProduct();
    expect(response.ok()).toBeTruthy();

    await adminPage.goToListProducts();
    await adminPage.deleteProductByName(productName);
  });
});

test.describe('US001 - Autenticação de Usuário (UI)', () => {
  test('CT030 - Login com email inválido', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login(
      faker.internet.email().toLowerCase(),
      faker.internet.password()
    );

    await loginPage.assertErrorMessage('Email e/ou senha inválidos');
  });
});