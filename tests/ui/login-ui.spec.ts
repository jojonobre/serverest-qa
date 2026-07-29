import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { LoginPage } from '../pages/LoginPage';

test.describe('US001 - Funcionalidade de Login (UI)', () => {
  let loginPage: LoginPage;
  let createdUserId: string | null = null;
  let validUser = {
    email: '',
    password: '',
  };

  test.beforeEach(async ({ page, request }) => {
    loginPage = new LoginPage(page);
    validUser = {
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password({ length: 10 }),
    };

    const res = await request.post('https://serverest.dev/usuarios', {
      data: {
        nome: faker.person.fullName(),
        email: validUser.email,
        password: validUser.password,
        administrador: 'false',
      },
    });

    expect(res.ok()).toBeTruthy(); 
    const data = await res.json();
    createdUserId = data._id;

    await loginPage.navigate();
  });

  test.afterEach(async ({ request }) => {
    if (createdUserId) {
      await request.delete(`https://serverest.dev/usuarios/${createdUserId}`).catch(() => {});
      createdUserId = null;
    }
  });

  test('CT001 - Login com sucesso (Usuário Cliente)', async ({ page }) => {
    await loginPage.login(validUser.email, validUser.password);
    await expect(page).toHaveURL(/.*home/);
  });

  test('CT002 - Login com senha inválida', async () => {
    const wrongPassword = faker.internet.password({ length: 12 });
    await loginPage.login(validUser.email, wrongPassword);
    await loginPage.assertErrorMessage('Email e/ou senha inválidos');
  });

  test('CT003 - Login com email não cadastrado', async () => {
    const unregisteredEmail = faker.internet.email().toLowerCase();
    const randomPassword = faker.internet.password();

    await loginPage.login(unregisteredEmail, randomPassword);
    await loginPage.assertErrorMessage('Email e/ou senha inválidos');
  });

  test('CT004 - Login com email em formato inválido', async () => {
    const invalidEmailFormat = faker.string.alphanumeric(8); 

    await loginPage.login(invalidEmailFormat, 'senha123');
    await loginPage.assertInvalidEmail();
  });
});