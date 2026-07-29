import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { RegisterPage } from '../pages/RegisterPage';

test.describe('US002 - Cadastrar Usuário (UI)', () => {
  let registerPage: RegisterPage;
  let createdUserIds: string[] = [];

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.navigate();
  });

  test.afterEach(async ({ request }) => {
    for (const userId of createdUserIds) {
      await request.delete(`https://serverest.dev/usuarios/${userId}`).catch(() => {});
    }
    createdUserIds = [];
  });

  test('CT006 - Cadastro com sucesso com atribuição de Administrador', async ({ page }) => {
    const randomUser = {
      nome: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password({ length: 10 }),
    };

    const responsePromise = registerPage.registerUser(
      randomUser.nome,
      randomUser.email,
      randomUser.password,
      true
    );

    const response = await responsePromise;
    if (response.ok()) {
      const body = await response.json();
      if (body._id) createdUserIds.push(body._id);
    }

    await expect(page).toHaveURL(/\/admin\/home$/, {
      timeout: 15000,
    });
  });

  test('CT007 - Cadastro com sucesso sem atribuição de Administrador', async ({ page }) => {
    const randomUser = {
      nome: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password({ length: 10 }),
    };

    const responsePromise = registerPage.registerUser(
      randomUser.nome,
      randomUser.email,
      randomUser.password,
      false
    );

    const response = await responsePromise;
    if (response.ok()) {
      const body = await response.json();
      if (body._id) createdUserIds.push(body._id);
    }

    await expect(page).toHaveURL(/\/home$/, {
      timeout: 15000,
    });
  });

  //(BUG-001): Validação de nome com caracteres especiais/numéricos
test('CT008 - Cadastro com nome inválido', async () => {
  const randomEmail = faker.internet.email().toLowerCase();
  const randomPassword = faker.internet.password();
  await registerPage.registerUser('12345!@#$', randomEmail, randomPassword, false);
  await registerPage.assertAlertMessage('Nome não pode ser apenas caracteres especiais');
});

  test('CT010 - Cadastrar com e-mail já utilizado', async ({ request }) => {
    const existingEmail = faker.internet.email().toLowerCase();
    const initialUserRes = await request.post('https://serverest.dev/usuarios', {
      data: {
        nome: faker.person.fullName(),
        email: existingEmail,
        password: faker.internet.password(),
        administrador: 'false',
      },
    });

    expect(initialUserRes.ok()).toBeTruthy();
    const initialUserData = await initialUserRes.json();
    createdUserIds.push(initialUserData._id);
    await registerPage.registerUser(
      faker.person.fullName(),
      existingEmail,
      faker.internet.password(),
      false
    );

    await registerPage.assertAlertMessage('Este email já está sendo usado');
  });
});